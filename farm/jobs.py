import click
import os
from pathlib import Path
from flamenco.manager import ApiClient, Configuration
from flamenco.manager.apis import MetaApi
from flamenco.manager.models import FlamencoVersion

configuration = Configuration(host="http://192.168.0.6:8080")
api_client = ApiClient(configuration)

shared_drive = "/Volumes/the-bundle"


def post_job(blendfile, frames, render_output_path, priority=50, chunk_size=3):
    return api_client.call_api("/api/v3/jobs", "POST", body={
        "metadata": {
            "project": "The Bundle",
            "user.email": "ci-bot@bundle.grida.co",
            "user.name": "The Bundle by Grida CI Bot"
        },
        "name": "test",
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
@click.option('--max', default=None, help='Max number of jobs to submit', type=int)
def main(queue, max):
    queue = Path(queue)
    assert queue.exists()

    for i, job in enumerate(queue.glob('**/*.blend')):
        if max is not None and i >= max:
            break

        # following the mat / obj.blend -> renders/mat/obj-######.png
        render_output_path = os.path.join(
            shared_drive, 'renders', str(job.parent.relative_to(queue)), f'{job.stem}-######.png')
        print(f'Posting job {job}, output to {render_output_path}')
        post_job(
            blendfile=str(job),
            # TODO: make this dynamic
            frames='0-7',  # this
            chunk_size=8,  # and this
            render_output_path=render_output_path
        )
    ...


if __name__ == '__main__':
    main()
