import math
from pathlib import Path
import bpy
import click
from PIL import Image
from mathutils import Euler


@click.command()
@click.option('--file', help='Path to .blend file', required=True, type=click.Path(exists=True, dir_okay=False, file_okay=True, resolve_path=True))
@click.option('--out', help='Output folder', required=True, type=click.Path(exists=True, dir_okay=True, file_okay=False, resolve_path=True))
@click.option('--step', help='Steps in degrees', type=int, default=6)
@click.option('--skip-if-exists', help='Skip render for point if exists', is_flag=True)
@click.option('--resolution-percentage', help='sets resolution_percentage', type=int, default=100)
def bake(file, out, step, skip_if_exists, resolution_percentage):

    # Range of angles to rotate the object through
    # range function does not include the stop value, hence 46
    range_x = range(-30, 31, step)
    range_y = range(-45, 46, step)
    range_z = range(0, 1, step)

    points = []
    for x in range_x:
        for y in range_y:
            for z in range_z:
                points.append((x, y, z))

    print(f'Number of points: {len(points)}')

    # open file
    bpy.ops.wm.open_mainfile(filepath=file)

    # Define scene
    scene = bpy.context.scene

    # Access the object
    obj = bpy.data.objects['text']

    # Iterate over each angle in each range
    for x, y, z in points:
        outfile = f'{out}/render_x{x}_y{y}_z{z}.png'
        if skip_if_exists and Path(outfile).exists():
            continue

        print(f'x: {x}, y: {y}, z: {z}')
        # Rotate object
        obj.rotation_euler = \
            Euler((math.radians(x), math.radians(y), math.radians(z)), 'XYZ')

        print('ROTATION', obj.rotation_euler)

        # Define render output path
        scene.render.filepath = outfile

        # Down resolution % for testing
        scene.render.resolution_percentage = resolution_percentage

        # Render scene
        bpy.ops.render.render(write_still=True)

        # Open rendered image
        img = Image.open(scene.render.filepath)
        img.save(scene.render.filepath, optimize=True)


if __name__ == '__main__':
    bake()
