import bpy
from math import radians
import os

rotations = [
    [0, 0, 0],
    [0, 0, 15],
    [0, 0, 30],
    [0, 0, 45],
    # [0, 0, -45],
    # [45, 0, 0],
    # [0, 45, 0],
]

__dir = os.path.dirname(bpy.data.filepath)
objects_file = "//objects/objects.blend"
material_name = "006"  # Not the ID, the name used internally for our reference
material_file = "//materials/mat.006.blend"
render_scene_name = "render"

# Load objects
scenes_to_link = []

with bpy.data.libraries.load(objects_file) as (data_from, data_to):
    scenes_to_link = [scene for scene in data_from.scenes]
    data_to.scenes = scenes_to_link

linked_scene_names = [
    scene.name for scene in bpy.data.scenes if scene.library and scene.library.filepath.endswith(objects_file)]


# Now, go through each linked scene to identify the object you want
objects_to_render = {}

for scene in bpy.data.scenes:
    for obj in scene.objects:
        # If the object is visible (enabled)
        if obj.hide_viewport == False:
            objects_to_render[scene.name] = obj
            break  # Only take the first visible object per scene, then move on

# Load materials
with bpy.data.libraries.load(material_file) as (data_from, data_to):
    data_to.materials = ['material']

# Define the function to generate filenames


def outname(object_name, material_name, rotation, quality=100):
    rot = "{rotation[0]}°{rotation[1]}°{rotation[2]}°"\
        .format(rotation=rotation)
    qua = str(quality).zfill(3)
    return f"{object_name},{material_name},{rot},{qua}.png"


def boundingbox_dimension(obj):
    """
    Retrieves the dimension of the passed object. Acceptable objects are Empty (with Cube display type) and Mesh (specifically a cube).

    Parameters:
    - obj: bpy.types.Object, The Blender object

    Returns:
    - tuple or float, Returns a tuple representing dimensions (x, y, z) for a cube mesh, or a float for the size of an Empty cube.

    Raises:
    - ValueError if an unacceptable object is passed.
    """

    if obj.type == 'EMPTY' and obj.empty_display_type == 'CUBE':
        size = obj.empty_display_size
        return (
            size * obj.scale.x,
            size * obj.scale.y,
            size * obj.scale.z,
        )

    elif obj.type == 'MESH':
        x, y, z = obj.dimensions
        return (x, y, z)

    else:
        raise ValueError(
            "Object is neither an acceptable Empty nor a cube Mesh.")


def process_and_render():
    # Assuming you want to do the work in the current blend file.
    # Check if the "render" scene exists, if not, link it from the material_file
    if render_scene_name not in bpy.data.scenes:
        with bpy.data.libraries.load(material_file) as (data_from, data_to):
            data_to.scenes = [render_scene_name]

    scene = bpy.data.scenes[render_scene_name]
    bpy.context.window.scene = scene  # Set current scene

    # Fetch the bounding box
    bounding_box = scene.objects.get("boundingbox")
    if not bounding_box:
        print(f"Error: Could not find {bounding_box} in {render_scene_name}")
        return

    # Fetch the material
    material = bpy.data.materials.get("material")
    if not material:
        print("Error: Could not find 'material'")
        return

    for scene_name, obj in objects_to_render.items():
        # Link object to the scene
        scene.collection.objects.link(obj)

        # Assign the material to the object
        if obj.data is None:
            print(f"Error: {obj.name} has no mesh data")
            continue
        if obj.data.materials:
            obj.data.materials[0] = material
        else:
            obj.data.materials.append(material)

        # Scale and position the object to fit within bounding_box
        obj_dimensions = obj.dimensions
        bb_x, bb_y, bb_z = boundingbox_dimension(bounding_box)
        scale_factor = min(
            bb_x / obj_dimensions.x if obj_dimensions.x > 0 else 1,
            bb_y / obj_dimensions.y if obj_dimensions.y > 0 else 1,
            bb_z / obj_dimensions.z if obj_dimensions.z > 0 else 1,
        )
        obj.scale = (scale_factor, scale_factor, scale_factor)
        obj.location = bounding_box.location
        obj.hide_render = False

        print(f"Rendering {scene_name}...")

        # # ====
        # # Save the blend file
        # # Create directory if it doesn't exist
        # output_dir = os.path.join(__dir, "blends")
        # # Sanitize the scene name to remove problematic characters
        # safe_filename = "".join([c if c.isalnum() or c in (
        #     ' ', '.', '-', '_') else '_' for c in scene_name])
        # filepath = os.path.join(output_dir, f"{safe_filename}.blend")

        # # Save the blend file
        # bpy.ops.wm.save_as_mainfile(filepath=filepath)
        # # ====

        # Render with different rotations
        for rotation in rotations:
            obj.rotation_euler = [radians(angle) for angle in rotation]
            # Use the scene_name for filename instead of obj.name
            quality = 30
            id = outname(scene_name, material_name, rotation, quality=quality)
            scene.render.filepath = f'//pngs/{id}'

            # check if image exists
            if os.path.exists(os.path.join(__dir, "pngs", id)):
                print(f"Skipping {id}")
                continue

            # Optimize for rendering
            bpy.context.scene.render.engine = 'CYCLES'
            bpy.context.scene.cycles.device = 'GPU'
            bpy.context.scene.cycles.samples = 100
            # Resolution
            bpy.context.scene.render.resolution_x = 1024
            bpy.context.scene.render.resolution_y = 1024
            bpy.context.scene.render.resolution_percentage = quality

            bpy.ops.render.render(write_still=True)

        # Remove the object from the scene after rendering
        bpy.data.objects.remove(obj)


process_and_render()
