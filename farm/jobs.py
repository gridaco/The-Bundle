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


@click.command()
@click.argument('queue', type=click.Path(exists=True))
@click.option('--priority', default=50, help='Job priority', type=int)
@click.option('--chunk-size', default=None, help='Chunk size', type=int)
@click.option('--batch', default=1, help='Batch number', type=int)
@click.option('--name', default=None)
@click.option('--max', default=None, help='Max number of jobs to submit', type=int)
@click.option("--render-output-path", default=None, help="Render output path")
@click.option("--dry-run", is_flag=True, help="Don't actually submit jobs")
def main(queue, priority, chunk_size, name, batch, max, render_output_path, dry_run):
    queue = Path(queue)
    assert queue.exists()

    for i, job in tqdm(enumerate(queue.glob('**/*.blend'))):
        if max is not None and i >= max:
            break

        _frames = frames_from_blendfile(job)
        __chunk_size = chunk_size or chunksize(_frames)
        frames = frames_str(_frames)

        obj = Path(job).stem
        mat = Path(job).parent.name
        jobname = name or f"{mat}/{obj}"

        # print(f'{mat}/{obj}', render_output_path)
        # following the mat / obj.blend -> renders/mat/obj-######.png
        # be careful not to overwrite the output path name - we made this mistake before, it was painful.
        __render_output_path =\
            render_output_path.format(
                shared_drive=shared_drive,
                object=obj
            )\
            if render_output_path\
            else \
            os.path.join(shared_drive, 'renders',
                         str(mat), f'{obj}-######.png')

        tqdm.write(
            f'☑️ {job} → {__render_output_path} ({frames} {chunk_size} {obj} {mat})')
        if not dry_run:
            post_job(
                name=jobname,
                blendfile=str(job),
                frames=frames,
                chunk_size=__chunk_size,
                priority=priority,
                render_output_path=__render_output_path,
                metadata={
                    'material': mat,
                    'object': obj,
                    'version': '1',
                    'batch': str(batch)
                }
            )
    ...


if __name__ == '__main__':
    main()
