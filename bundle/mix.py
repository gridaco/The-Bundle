import sys
import json
import bpy
from math import radians
import os
from pathlib import Path
import logging
from tqdm import tqdm

__DIR = Path(os.path.dirname(bpy.data.filepath))

# read the config file if available
config_file = __DIR / 'config.json'
if config_file.exists():
    with open(config_file) as f:
        config = json.load(f)

# Update the target here
# - DEBUG
# - PREVIEW
# - 512
# - 1K
target = (config.get('target') if config else None) or 'PREVIEW'

profiles: dict = json.load(open(__DIR / 'profiles.json'))

assert target in profiles.keys(), f"Invalid target: {target}"

material_classes: dict = json.load(open(__DIR / 'materials' / 'config.json'))

rotation_profiles = {
    'DEBUG': [[0, 0, 0]],
    'xz45-3': [
        [0, 0, 0],
        [0, 0, 15],
        [0, 0, 30],
        [0, 0, 45],
        [15, 0, 0],
        [30, 0, 0],
        [45, 0, 0],
    ]
}

IS_DEBUG = target == 'DEBUG'
profile: dict = profiles[target]
resolution_percentage = profile.get('resolution_percentage', 100)
res = profile['res']
samples = profile['samples']
rotations = rotation_profiles['DEBUG' if IS_DEBUG else 'xz45-3']

print(f"- TARGET {target}...")
print(f"- PROFILE: {json.dumps(profile, indent=2)}")
print(f"- #ROTATIONS: {len(rotations)}")


RENDER_SCENE_NAME = "render"
OBJECTS_FILE = "//objects/objects.blend"
OBJECT_SCENE_EXCLUDE_PATTERNS = [] if IS_DEBUG else ['0.demo', '(wd)', 'z999']
MATERIAL_FILES = sorted((__DIR / 'materials').glob('*.blend'))
MATERIAL_NAME = 'material'
OUTDIR = __DIR / f'pngs.{target}'

# config logging
logging.basicConfig(
    format='%(asctime)s %(levelname)s %(message)s',
    level=logging.DEBUG,
    handlers=[
        logging.FileHandler(__DIR / 'bundle.log'),
        # logging.StreamHandler()
    ]
)


def sync_objects():
    # Load objects
    scenes_to_link = []

    with bpy.data.libraries.load(OBJECTS_FILE) as (data_from, data_to):
        scenes_to_link = [scene for scene in data_from.scenes]
        data_to.scenes = scenes_to_link

    # Now, go through each linked scene to identify the object you want
    objects_to_render = {}

    for scene in bpy.data.scenes:
        for obj in scene.objects:
            # Exclude objects if they contain any of the exclude patterns
            if any([pattern in scene.name for pattern in OBJECT_SCENE_EXCLUDE_PATTERNS]):
                continue
            # If the object is visible (enabled)
            if obj.hide_viewport == False:
                objects_to_render[scene.name] = obj
                break  # Only take the first visible object per scene, then move on

    return objects_to_render


def outname(object_name, rotation, material_name=None, res=512, quality=100, samples=128):
    rot = "{rotation[0]}°{rotation[1]}°{rotation[2]}°"\
        .format(rotation=rotation)
    res = f'{res}x{res}'
    qua = f'{quality}%'
    samples = f'#{samples}'
    seq = [object_name, material_name, rot, samples, res, qua]
    # filter out empty strings, None, etc.
    seq = [s for s in seq if s]

    id = ",".join(seq)
    return f'{id.replace("/", ":")}'


def optimzied_samples_scale_by_material(material_name):
    m_class = material_name.split('.')[0]
    m_class_config = material_classes.get(m_class)
    if m_class_config:
        return m_class_config.get('samples', 1)
    return 1


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


def save_blend(name):
    """
    Save the current in-mem working file as .blend file in the ./blends directory.
    """
    # Create directory if it doesn't exist
    output_dir = os.path.join(__DIR, "blends")
    # Sanitize the scene name to remove problematic characters
    safe_filename = "".join([c if c.isalnum() or c in (
        ' ', '.', '-', '_') else '_' for c in name])
    filepath = os.path.join(output_dir, f"{safe_filename}.blend")

    # Save the blend file
    bpy.ops.wm.save_as_mainfile(filepath=filepath)


def fit_scale(obj, box):
    obj_dimensions = obj.dimensions
    bb_x, bb_y, bb_z = boundingbox_dimension(box)
    scale_factor = min(
        bb_x / obj_dimensions.x if obj_dimensions.x > 0 else 1,
        bb_y / obj_dimensions.y if obj_dimensions.y > 0 else 1,
        bb_z / obj_dimensions.z if obj_dimensions.z > 0 else 1,
    )

    return scale_factor


def render(filepath, samples=128, res=512, resolution_percentage=100):
    assert filepath is not None, "filepath cannot be None"

    # Set the filepath
    bpy.context.scene.render.filepath = filepath

    # Optimize for rendering
    bpy.context.scene.render.engine = 'CYCLES'
    bpy.context.scene.cycles.device = 'GPU'
    bpy.context.scene.cycles.samples = samples
    # Resolution
    bpy.context.scene.render.resolution_x = res
    bpy.context.scene.render.resolution_y = res
    bpy.context.scene.render.resolution_percentage = resolution_percentage

    # === redirect output to log file
    logfile = 'blender_render.log'
    open(logfile, 'a').close()
    old = os.dup(sys.stdout.fileno())
    sys.stdout.flush()
    os.close(sys.stdout.fileno())
    fd = os.open(logfile, os.O_WRONLY)
    # ===

    bpy.ops.render.render(write_still=True)

    # === disable output redirection
    os.close(fd)
    os.dup(old)
    os.close(old)
    # ===

    ...


def render_by_material(material_file, material_name):

    m_samples = int(
        samples * optimzied_samples_scale_by_material(material_name)
    )

    out = OUTDIR / material_name

    objects_to_render = sync_objects()

    # Initialize the progress bar (tracks each render)
    pbar = tqdm(
        total=(len(objects_to_render.items()) * len(rotations)), desc=material_name, leave=True
    )

    # Assuming you want to do the work in the current blend file.
    # Check if the "render" scene exists, if not, link it from the material_file
    if RENDER_SCENE_NAME not in bpy.data.scenes:
        with bpy.data.libraries.load(str(material_file)) as (data_from, data_to):
            data_to.scenes = [RENDER_SCENE_NAME]

    scene = bpy.data.scenes[RENDER_SCENE_NAME]
    bpy.context.window.scene = scene  # Set current scene

    # Fetch the bounding box
    bounding_box = scene.objects.get("boundingbox")
    if not bounding_box:
        logging.error(
            f"Error: Could not find boundingbox in {RENDER_SCENE_NAME}"
        )

        return

    # Fetch the material
    material = bpy.data.materials.get(MATERIAL_NAME)
    if not material:
        logging.error(f"Error: Could not find '{MATERIAL_NAME}'")
        return

    for scene_name, obj in objects_to_render.items():
        # Link object to the scene
        scene.collection.objects.link(obj)
        # Assign the material to the object
        if obj.data is None:
            logging.error(f"Error: {obj.name} has no mesh data")
            continue
        if obj.data.materials:
            obj.data.materials[0] = material
        else:
            obj.data.materials.append(material)

        # Scale and position the object to fit within bounding_box
        scale_factor = fit_scale(obj, bounding_box)
        obj.scale = (scale_factor, scale_factor, scale_factor)

        # Position the object at the center of the bounding box
        obj.location = bounding_box.location

        # Ensure the object is visible on render
        obj.hide_render = False

        logging.info(f"Rendering {scene_name} in {material_name}...")

        # Render with different rotations
        for rotation in rotations:
            # Use the scene_name for filename instead of obj.name
            id = outname(
                object_name=scene_name,
                material_name=material_name,
                rotation=rotation,
                res=res,
                samples=m_samples,
                quality=resolution_percentage
            )

            # Update the progress bar description
            pbar.set_description(f"{material_name} → <{id}>")

            filepath = str(out / f"{id}.png")

            # Rotate the object
            obj.rotation_euler = [radians(angle) for angle in rotation]

            # check if image exists
            if os.path.exists(filepath):
                logging.info(f"Skipping {filepath}")
                pbar.update(1)
                continue

            # Render
            render(
                filepath=filepath,
                samples=m_samples,
                res=res,
                resolution_percentage=resolution_percentage,
            )

            # Update the progress bar
            pbar.update(1)

        # After rendering, unlink the object from the scene
        scene.collection.objects.unlink(obj)

    # clean up
    pbar.desc = material_name
    pbar.close()


def main():
    for material_file in MATERIAL_FILES:
        logging.info(f"Rendering {material_file}...")

        # reset the vm to work with a clean slate
        bpy.ops.wm.read_homefile(use_empty=True)

        render_by_material(material_file=material_file,
                           material_name=material_file.stem)

        # Remove the "render" scene
        bpy.data.scenes.remove(bpy.data.scenes.get(RENDER_SCENE_NAME))

        # Clear the material
        bpy.data.materials.remove(bpy.data.materials.get(MATERIAL_NAME))


if __name__ == "__main__":

    main()
