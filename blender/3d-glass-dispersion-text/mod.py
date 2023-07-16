import bpy
import os
import shutil


def change_text_and_render(file, text, out):
    # Duplicate the original file to avoid modifying it
    temp_file = f'{file}_temp.blend'
    shutil.copyfile(file, temp_file)

    # Load the temporary Blender file
    bpy.ops.wm.open_mainfile(filepath=temp_file)

    # Find the first text object and change its content
    text_objects = [obj for obj in bpy.data.objects if obj.type == 'FONT']
    if text_objects:
        text_objects[0].data.body = text
    else:
        print("No text object found in the scene")

    # Set the render output path
    bpy.context.scene.render.filepath = out

    # Optimize rendering
    bpy.context.scene.cycles.samples = 128 # 256 / 1024
    bpy.context.scene.render.resolution_x = 500
    bpy.context.scene.render.resolution_y = 500

    # Format to PNG
    bpy.context.scene.render.image_settings.file_format = 'PNG'

    # If animation, limit the frames up to 60
    if bpy.context.scene.frame_end > 60:
        bpy.context.scene.frame_end = 60

    animated_objects = [obj for obj in bpy.context.scene.objects if obj.animation_data is not None]
    has_anim = len(animated_objects) > 0
    print(f"Is animation: {has_anim}")
    # Check if scene contains any animation
    if has_anim:
        # Renter the animation
        bpy.ops.render.render(animation=True)
    else:
        # Render the scene
        bpy.ops.render.render(write_still=True)

    # Cleanup: remove the temporary file
    os.remove(temp_file)


if __name__ == "__main__":
    file = os.getenv('BLENDER_FILE')
    text = os.getenv('TEXT_CONTENT')
    out = os.getenv('OUTPUT_PATH')

    if all([file, text, out]):
        change_text_and_render(file, text, out)
    else:
        print("Required environment variables not set")
