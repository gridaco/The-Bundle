import sys
import json
import bpy
from math import radians
import os
from pathlib import Path
import logging
from tqdm import tqdm
from functools import reduce


__DIR = Path(os.path.dirname(bpy.data.filepath))


# config logging
logging.basicConfig(
    format='%(asctime)s %(levelname)s %(message)s',
    level=logging.DEBUG,
    handlers=[
        logging.FileHandler(__DIR / 'bundle.log'),
        # logging.StreamHandler()
    ]
)


# read the config file if available
task_file = __DIR / 'task.json'
if task_file.exists():
    with open(task_file) as f:
        task = json.load(f)

# Update the target here
# - DEBUG
# - PREVIEW
# - 512
# - 1K
target = (task.get('target') if task else None) or 'PREVIEW'

profiles: dict = json.load(open(__DIR / 'profiles.json'))

assert target in profiles.keys(), f"Invalid target: {target}"

material_classes: dict = json.load(open(__DIR / 'materials' / 'config.json'))

rotation_profiles = {
    'DEBUG': [[0, 0, 0]],
    'xz45-3': [
        [0, 30, 0],
        [0, 30, 15],
        [0, 30, 30],
        [0, 30, 45],
        [15, 30, 0],
        [30, 30, 0],
        [45, 30, 0],
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
OBJECTS_FILE = __DIR / "objects" / "objects.blend"
OBJECT_SCENE_EXCLUDE_PATTERNS = [] if IS_DEBUG else ['0.demo', '(wd)', 'z999']
DEFAULT_MATERIAL_NAME = 'material'
DIST = __DIR / 'dist' \
    if task.get('dist') is None \
    else Path(task.get('dist'))
OUTDIR = DIST / target


def matname(filepath: Path):
    """
    Extract the material name from the filepath.
    remove the `--stage` suffix if present. (e.g. `m.al.oxidized.001.--staging.blend` => `m.al.oxidized.001`)
    """
    fname = filepath.stem
    splits = fname.split('.')
    segs = []
    for seg in splits:
        if seg.startswith('--'):
            break
        segs.append(seg)

    return '.'.join(segs)


# # resolve all material files
# MATERIAL_FILES = list(set(
#     reduce(
#         lambda x, y: x + list(y),
#         [__DIR.glob(pattern) for pattern in config.get('materials')],
#         []
#     )
# ))

# # sort by config.materials_priority
# MATERIALS_RENDER_QUEUE_PRIORITY = config.get('materials_render_queue_priority')
# MATERIAL_FILES = sorted(
#     MATERIAL_FILES,
#     key=lambda p:
#     MATERIALS_RENDER_QUEUE_PRIORITY.index(matname(p))
#     if matname(p) in MATERIALS_RENDER_QUEUE_PRIORITY
#     else 999
# )


class MaterialPackage:
    """
    Material Package directory and files.
    """

    # materials by name: file, material name -> E.g. { 'm.al.oxidized.001': { 'file': 'm.al.blend', 'name': 'm.al.oxidized.001' } }
    base_dir = None
    materials = {}

    def __init__(self, package_dot_json: Path | str) -> None:
        package_dot_json = Path(package_dot_json)
        assert package_dot_json.exists(
        ), f"Invalid package: {package_dot_json}"

        package_data = json.load(open(package_dot_json))

        self.base_dir = package_dot_json.parent

        materials = package_data['materials']
        files = package_data['files']

        is_multiple_files = len(files) > 1

        if is_multiple_files:
            # resolve files
            raise NotImplementedError(
                'multiple material files package not supported atm.')
        else:
            # map materials by reading the material file
            material_file = self.base_dir / files[0]
            assert material_file.exists(
            ), f"Invalid material file: {material_file}"

            # inspect material files without loading them into the current blend file
            with bpy.data.libraries.load(str(material_file), link=False) as (data_from, _):
                for m in data_from.materials:
                    if m in materials:
                        self.materials[m] = {
                            'file': material_file,
                            'name': m
                        }

            ...

    def load(self, material_name: str) -> bpy.types.Material | None:
        """
        Loads the material to the current blend file.
        """
        material = self.materials.get(material_name)
        if material:
            with bpy.data.libraries.load(str(material['file'])) as (data_from, data_to):
                data_to.materials = [material_name]

            return bpy.data.materials.get(material_name)

        return None


class ObjectPackage:

    # list of names of the scenes that contain the objects
    object_scenes: [str] = []
    # dict of objects by scene name, following the format of { 'key': { 'file': <file path>,  'scene': <scene name>, 'name': <object name> } }
    objects: dict[str, dict] = {}
    exclude_patterns: list[str] = []

    _whole_synced = False

    def __init__(self, file: Path | str, exclude_patterns: list[str] = []) -> None:
        ...
        self.file = Path(file)
        self.exclude_patterns = exclude_patterns

        # Index objects
        # first, sync the objects to the current blend file, after indexing is done, delete the scenes and objects
        # so that the current blend file is clean
        self.object_scenes = []
        __objects = self.sync()
        # create empty scene for to be the last scene
        bpy.ops.scene.new(type='EMPTY')
        # clean
        for key, obj in __objects.items():
            self.object_scenes.append(key)
            self.objects[key] = {
                'file': self.file,
                'scene': key,
                'name': obj.name
            }
            # remove
            bpy.data.objects.remove(obj)
            bpy.data.scenes.remove(bpy.data.scenes.get(key))
        self._whole_synced = False

    def load(self, key: str):
        assert key in self.objects.keys(), f"Invalid key: {key}"
        objdata = self.objects.get(key)
        objname = objdata.get('name')

        with bpy.data.libraries.load(str(self.file)) as (data_from, data_to):
            data_to.objects = [objname]

        return bpy.data.objects.get(objname)

    def sync(self):
        """
        sync all scenes and objects from the package to the current blend file.
        """
        if self._whole_synced:
            return self.objects

        # sync scenes
        with bpy.data.libraries.load(str(self.file)) as (data_from, data_to):
            scenes_to_link = []

            for scene in data_from.scenes:
                # Exclude objects if they contain any of the exclude patterns
                if any([pattern in scene for pattern in self.exclude_patterns]):
                    continue

                scenes_to_link.append(scene)

            data_to.scenes = scenes_to_link

        # Now, go through each linked scene to identify the object you want
        objects_to_render = {}

        for scene in bpy.data.scenes:
            for obj in scene.objects:
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


def render_by_material(name, material_file, material_name, objpack: ObjectPackage):

    m_samples = int(
        samples * optimzied_samples_scale_by_material(name)
    )

    out = OUTDIR / name

    objects_to_render = objpack.sync()

    # Initialize the progress bar (tracks each render)
    pbar = tqdm(
        total=(len(objects_to_render.items()) * len(rotations)), desc=name, leave=True
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
    material = bpy.data.materials.get(material_name)
    if not material:
        logging.error(f"Error: Could not find '{material_name}'")
        return

    for scene_name, obj in objects_to_render.items():
        # Link object to the scene
        scene.collection.objects.link(obj)

        # Convert the object to mesh if not. (E.g. matball, etc.)
        if obj.type != 'MESH':
            try:
                bpy.ops.object.select_all(
                    action='DESELECT')  # Deselect all objects
                obj.select_set(True)  # Assuming meta_obj is your Meta object
                bpy.context.view_layer.objects.active = obj
                bpy.ops.object.convert(target='MESH')
            except Exception as e:
                logging.error(
                    f"Error: Could not convert {obj.name} to mesh: {e}")
                continue

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

        logging.info(f"Rendering {scene_name} in {name}...")

        # Render with different rotations
        for rotation in rotations:
            # Use the scene_name for filename instead of obj.name
            id = outname(
                object_name=scene_name,
                material_name=name,
                rotation=rotation,
                res=res,
                samples=m_samples,
                quality=resolution_percentage
            )

            # Update the progress bar description
            pbar.set_description(f"{name} → <{id}>")

            filepath = str(out / f"{id}.png")

            # check if image exists
            if os.path.exists(filepath):
                logging.info(f"Skipping {filepath}")
                pbar.update(1)
                continue

            # Rotate the object
            if obj.rotation_mode == 'QUATERNION':
                # Convert quaternion to euler - consider not changing the rotation mode.
                obj.rotation_mode = 'XYZ'
                logging.info(f"Converting quaternion to euler for {obj.name}")

            obj.lock_rotation = [False, False, False]
            obj.rotation_euler = [radians(angle) for angle in rotation]

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
        try:
            scene.collection.objects.unlink(obj)
        except Exception as e:
            logging.error(f"Error: {e}")

    # clean up
    pbar.desc = name
    pbar.close()


def main():
    # ensure the dist directory exists before proceeding
    assert DIST.exists(), f"Invalid dist: {DIST}"

    matpack = MaterialPackage(__DIR / 'materials' /
                              'community-material-pack' / 'package.json')
    objpack = ObjectPackage(
        OBJECTS_FILE, exclude_patterns=OBJECT_SCENE_EXCLUDE_PATTERNS)

    # # print(objpack.objects)
    # # key = list(objpack.objects.keys())[0]
    # # print(objpack.load(key))

    print("\n\n")
    print("=== START ===")
    print(f"Note: Do not modify or change the name of the following files:\n")

    print(f"- {OBJECTS_FILE}")
    for k, v in matpack.materials.items():
        print(f"- {k}")
    # for mf in MATERIAL_FILES:
    #     print(f"- materials/{mf.name}")
    print("\n\n")

    for k, v in matpack.materials.items():
        file = v['file']
        name = v['name']
        logging.info(f"Rendering {file}...")

        # reset the vm to work with a clean slate
        bpy.ops.wm.read_homefile(use_empty=True)

        # load the material
        matpack.load(name)

        render_by_material(name=name, material_file=file,
                           material_name=name,
                           objpack=objpack
                           )

        # material_name = matname(material_file)
        # render_by_material(name=material_name, material_file=material_file,
        #                    material_name=DEFAULT_MATERIAL_NAME)

        # Remove the "render" scene
        bpy.data.scenes.remove(bpy.data.scenes.get(RENDER_SCENE_NAME))

        # # Clear the material
        # bpy.data.materials.remove(
        #     bpy.data.materials.get(DEFAULT_MATERIAL_NAME))


if __name__ == "__main__":

    main()
