import sys
import click
import os
import bpy
from tqdm import tqdm
from pathlib import Path
from flamenco.manager import ApiClient, Configuration
from flamenco.manager.apis import MetaApi
from flamenco.manager.models import FlamencoVersion

configuration = Configuration(host="http://192.168.0.6:8080")
api_client = ApiClient(configuration)

shared_drive = "/Volumes/the-bundle"

MAX_CHUNK_PER_FILE = 8


def frames_from_blendfile(blendfile):
    # === redirect output to log file
    logfile = 'blender_render.log'
    open(logfile, 'a').close()
    old = os.dup(sys.stdout.fileno())
    sys.stdout.flush()
    os.close(sys.stdout.fileno())
    fd = os.open(logfile, os.O_WRONLY)
    # ===

    bpy.ops.wm.open_mainfile(filepath=str(blendfile))

    # === disable output redirection
    os.close(fd)
    os.dup(old)
    os.close(old)
    # ===

    return (bpy.context.scene.frame_start, bpy.context.scene.frame_end)


def chunksize(frames: (int, int)):
    size = frames[1] - frames[0] + 1
    return min(MAX_CHUNK_PER_FILE, size)


def frames_str(frames: (int, int)) -> str:
    return f"{frames[0]}-{frames[1]}"


def pre():
    """
    TODO: loop trhough rendered outputs, create a queue for only required jobs
    """
    ...


def post_job(name, blendfile, frames, render_output_path, priority=50, chunk_size=3, metadata={}):
    return api_client.call_api("/api/v3/jobs", "POST", body={
        "metadata": {
            "project": "The Bundle",
            "user.email": "ci-bot@bundle.grida.co",
            "user.name": "The Bundle by Grida CI Bot",
            # used for query
            "name": name,
            "priority": str(priority),
            **metadata
        },
        "name": name,
        "type": "simple-blender-render",
        "priority": priority,
        "submitter_platform": "manager",
        # https://projects.blender.org/studio/flamenco/src/branch/main/internal/manager/job_compilers/scripts/simple_blender_render.js
        "settings": {
            # "blender_cmd": "{blender}",
            # "extract_audio": True,
            # "fps": 24,
            # "render_output_root": "",
            "chunk_size": chunk_size,
            "blendfile": blendfile,
            "has_previews": False,
            "format": "PNG",
            "frames": frames,
            "images_or_video": "images",
            "output_file_extension": ".png",
            "render_output_path": render_output_path
        }
    })

def is_excluded(filepath, includes, excludes):
    return (excludes and any(e in filepath for e in excludes)) or \
           (includes and not any(i in filepath for i in includes))


def extract_segments(pattern, filepath):
    pattern_segments = pattern.split('/')
    file_segments = filepath.parts[-len(pattern_segments):]
    
    metadata = {}
    for pattern_segment, file_segment in zip(pattern_segments, file_segments):
        if pattern_segment.endswith('.blend'):
            pattern_segment = pattern_segment.replace('.blend', '')
            file_segment = Path(file_segment).stem
        if '{' in pattern_segment and '}' in pattern_segment:
            key = pattern_segment.strip('{}')
            metadata[key] = file_segment
    return metadata


@click.command()
@click.argument('queue', type=click.Path(exists=True))
@click.option('--material-packages-include', '-mpi', default=None, help='Explicit package names to include. if not specified, includes all.', multiple=True, type=str)
@click.option('--material-packages-exclude', '-mpe', default=None, help='Explicit package names to exclude. if not specified, excludes none.', multiple=True, type=str)
@click.option('--material-include', '-mi', default=None, help='Explicit material names to include. if not specified, includes all.', multiple=True, type=str)
@click.option('--material-exclude', '-me', default=None, help='Explicit material names to exclude. if not specified, excludes none.', multiple=True, type=str)
@click.option('--object-packages-include', '-opi', default=None, help='Explicit package names to include. if not specified, includes all.', multiple=True, type=str)
@click.option('--object-packages-exclude', '-ope', default=None, help='Explicit package names to exclude. if not specified, excludes none.', multiple=True, type=str)
@click.option('--object-include', '-oi', default=None, help='Explicit object names to include. if not specified, includes all.', multiple=True, type=str)
@click.option('--object-exclude', '-oe', default=None, help='Explicit object names to exclude. if not specified, excludes none.', multiple=True, type=str)
@click.option('--priority', default=50, help='Job priority', type=int)
@click.option('--chunk-size', default=None, help='Chunk size', type=int)
@click.option('--batch', default=1, help='Batch number', type=int)
@click.option('--name', default=None)
@click.option('--max', default=None, help='Max number of jobs to submit', type=int)
@click.option('--job-file-pattern', default="{material_package}/{material_key}/{object_package}/{target_rotation}/{object_key}.blend", help='Job file pattern, relative to queue path', type=str)
@click.option("--render-output-path", default="{shared_drive}/renders/{material_package}/{material_key}/{object_package}/{object_key}/{target_rotation}/######.png", help="Render output path")
@click.option("--dry-run", is_flag=True, help="Don't actually submit jobs")
def regular(
        queue, 
        material_packages_include,
        material_packages_exclude,
        material_include,
        material_exclude,
        object_packages_include,
        object_packages_exclude,
        object_include,
        object_exclude,
        priority,
        chunk_size,
        name,
        batch,
        max,
        job_file_pattern,
        render_output_path,
        dry_run
    ):
    queue = Path(queue)
    assert queue.exists()

    pattern = job_file_pattern.replace("{", "**/{").format(
        material_package="*",
        material_key="*",
        object_package="*",
        target_rotation="*",
        object_key="*"
    )

    jobs_map = []
    for job in queue.glob(pattern):
        metadata = extract_segments(job_file_pattern, job)

        # Check exclusions/includes
        if any(is_excluded(metadata[key], includes, excludes) for key, includes, excludes in [
            ("material_package", material_packages_include, material_packages_exclude),
            ("material_key", material_include, material_exclude),
            ("object_package", object_packages_include, object_packages_exclude),
            ("object_key", object_include, object_exclude)]):
            continue

        jobs_map.append({"path": job, "metadata": metadata})

    for i, job_data in tqdm(enumerate(jobs_map)):
        if max is not None and i >= max:
            break

        job = job_data["path"]
        metadata = job_data["metadata"]

        _frames = frames_from_blendfile(job)
        __chunk_size = chunk_size or chunksize(_frames)
        frames = frames_str(_frames)

        # You can now access values like this: metadata["material_package"], metadata["material_key"], ...
        jobname = name or f'{metadata["material_key"]}/{metadata["object_key"]}'

        __render_output_path = render_output_path.format(
                shared_drive=shared_drive,
                **metadata
        )

        tqdm.write(
            f'☑️ {job.relative_to(queue)} → {__render_output_path} ({frames} {priority})')

        if not dry_run:
            post_job(
                name=jobname,
                blendfile=str(job),
                frames=frames,
                chunk_size=__chunk_size,
                priority=priority,
                render_output_path=__render_output_path,
                metadata={
                    **metadata,
                    'version': '1',
                    'batch': str(batch)
                }
            )


@click.group()
def cli():
    pass

cli.add_command(regular)

if __name__ == '__main__':
    cli()
