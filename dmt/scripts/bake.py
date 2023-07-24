import bpy
import click
from PIL import Image
from mathutils import Euler


@click.command()
@click.option('--file', help='Path to .blend file', required=True, type=click.Path(exists=True, dir_okay=False, file_okay=True, resolve_path=True))
@click.option('--out', help='Output folder', required=True, type=click.Path(exists=True, dir_okay=True, file_okay=False, resolve_path=True))
@click.option('--step', help='Steps in degrees', type=int, default=6)
def bake(file, out, step):

    # open file
    bpy.ops.wm.open_mainfile(filepath=file)

    # Access the object
    obj = bpy.data.objects['text']

    # Range of angles to rotate the object through
    # range function does not include the stop value, hence 46
    range_x = range(-30, 31, step)
    range_y = range(-30, 31, step)
    range_z = range(-5, 6, step)

    # Define scene
    scene = bpy.context.scene

    points = []
    for x in range_x:
        for y in range_y:
            for z in range_z:
                points.append((x, y, z))

    print(f'Number of points: {len(points)}')

    # Iterate over each angle in each range
    for x, y, z in points:
        print(f'x: {x}, y: {y}, z: {z}')
        # Rotate object
        obj.rotation_euler = Euler((x, y, z), 'XYZ')
        # obj.rotation_mode = "XYZ"
        # obj.rotation_euler = \
        #     (math.radians(90 + x), math.radians(y), math.radians(z))

        print('ROTATION', obj.rotation_euler)

        # Define render output path
        scene.render.filepath = f'{out}/render_x{x}_y{y}_z{z}.png'

        # Render scene
        bpy.ops.render.render(write_still=True)

        # Open rendered image
        img = Image.open(scene.render.filepath)
        img.save(scene.render.filepath, optimize=True)


if __name__ == '__main__':
    bake()
