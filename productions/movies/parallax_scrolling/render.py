import bpy
import click
from pathlib import Path
import random


def setup():
    bpy.ops.wm.read_homefile(use_empty=True)

    # Create a new screen for video editing
    bpy.ops.screen.new()
    # Switch to the new screen
    bpy.context.window.screen = bpy.data.screens[-1]
    bpy.context.window.screen.name = "Video Editing"

    # Set areas for the Video Sequence Editor
    for area in bpy.context.screen.areas:
        area.type = 'SEQUENCE_EDITOR'

    sequence_editor = bpy.context.scene.sequence_editor
    if not sequence_editor:
        sequence_editor = bpy.context.scene.sequence_editor_create()

    return sequence_editor


HARD_MAX = 128


@click.command()
@click.option("--images", type=click.Path(exists=True, dir_okay=True), help="Path to images directory")
@click.option("--pattern", default="*.png", help="Glob pattern for image selection")
@click.option("--n", type=int, default=None, help="Number of images to select and use")
def main(images, pattern, n):

    # setup the VSE
    frame_end = 80

    # Define range for random distribution
    x_range = (-500, 500)  # Horizontal range: modify as needed
    y_range = (-1000, 500)  # Vertical range: modify as needed

    # scale rate for parallax effect
    initial_scale_rate = 0.6
    scale_rate = 0.8
    scroll_step = 800
    scroll_rate = 0.8

    images = Path(images).resolve()
    # list png images in directory
    pngs = list(images.glob(pattern))

    click.echo(f"Found {len(pngs)} images")

    if n and 0 < n < len(pngs):
        pngs = random.sample(pngs, n)
    else:
        pngs = random.sample(pngs, min(len(pngs), HARD_MAX))

    sequence_editor = setup()

    # camera resolution
    bpy.context.scene.render.resolution_x = 1024
    bpy.context.scene.render.resolution_y = 1024
    # scene format resolution

    i = 0
    for png in pngs:
        channel = i + 1
        strip = sequence_editor.sequences.new_image(
            png.name, png.as_posix(), channel, 1,
            fit_method='FIT'
        )
        strip.frame_final_end = frame_end + 1  # Set the strip's end frame

        strip.transform.scale_x = initial_scale_rate
        strip.transform.scale_y = initial_scale_rate

        # Apply scaling based on depth, with smooth damping function (TODO)
        scale_factor = scale_rate ** (len(pngs) - i - 1)
        strip.transform.scale_x = strip.transform.scale_x * scale_factor
        strip.transform.scale_y = strip.transform.scale_y * scale_factor

        random_offset_x = random.uniform(*x_range)
        random_offset_y = random.uniform(*y_range)
        strip.transform.offset_x = random_offset_x
        strip.transform.offset_y = random_offset_y
        i += 1

    # Set initial offsets
    for png in pngs:
        strip = bpy.context.scene.sequence_editor.sequences_all[png.name]
        strip.transform.keyframe_insert(data_path="offset_y", frame=1)

    # # Set ending offsets (Change these as you see fit for your desired parallax effect)
    i = 0
    for png in pngs:
        strip = bpy.context.scene.sequence_editor.sequences_all[png.name]
        a = strip.transform.offset_y
        b = scroll_step * scroll_rate ** i
        c = a + b
        strip.transform.offset_y = c
        i += 1

    # # Keyframe ending offsets at frame 50 (or another desired frame)
    for png in pngs:
        strip = bpy.context.scene.sequence_editor.sequences_all[png.name]
        strip.transform.keyframe_insert(data_path="offset_y", frame=frame_end)

    # set frame range
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = frame_end

    # save the blend file
    bpy.ops.wm.save_as_mainfile(filepath="/tmp/parallax_scrolling.blend")

    bpy.context.scene.render.image_settings.file_format = 'FFMPEG'
    bpy.context.scene.render.ffmpeg.format = "MPEG4"
    bpy.context.scene.render.ffmpeg.codec = "H264"
    bpy.context.scene.render.ffmpeg.video_bitrate = 6000
    bpy.ops.render.render(animation=True)


if __name__ == "__main__":
    main()
