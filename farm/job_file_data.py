import bpy
import click
import json
import os
import sys
import math


@click.command()
@click.argument('file', type=click.Path(exists=True, readable=True))
@click.option('--out', type=click.Path(writable=True), help='Path to the JSON output file.', default='job_file_data.json')
def main(file, out):
    frames = frames_from_blendfile(file)
    keyframes = export_animation_data(frames)

    data = {
        'frame_start': frames[0],
        'frame_end': frames[1],
        'keyframes': keyframes,
        'resolution_x': bpy.context.scene.render.resolution_x,
        'resolution_y': bpy.context.scene.render.resolution_y,
        'samples': bpy.context.scene.cycles.samples,
        'resolution_percentage': bpy.context.scene.render.resolution_percentage,
    }

    with open(out, 'w') as json_file:
        json.dump(data, json_file)


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

    animated_objects = [obj for obj in bpy.data.objects if obj.animation_data]
    assert len(
        animated_objects) == 1, "There should be exactly one object with animation data."

    return (bpy.context.scene.frame_start, bpy.context.scene.frame_end, animated_objects[0])


def export_animation_data(frames):
    frame_start, frame_end, animated_object = frames
    animation_data = {}

    for frame in range(frame_start, frame_end + 1):
        bpy.context.scene.frame_set(frame)
        rotation = animated_object.rotation_euler
        rotation_degrees = [math.degrees(rotation.x), math.degrees(
            rotation.y), math.degrees(rotation.z)]

        # Normalize the rotation to 0 ~ 360 range
        rotation_normalized = [int(angle % 360) for angle in rotation_degrees]

        animation_data[str(frame)] = {
            'rotation': rotation_normalized
        }

    return animation_data


if __name__ == "__main__":
    main()
