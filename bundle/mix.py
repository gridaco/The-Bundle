import glob
import sys
import json
import bpy
from math import radians
import os
from pathlib import Path
import logging
from tqdm import tqdm
import click
import fnmatch

__DIR = Path(os.path.dirname(bpy.data.filepath))
OBJECTS_DIR = __DIR / "objects"
MATERIALS_DIR = __DIR / "materials"
RENDER_SCENE_NAME = "render"
material_classes: dict = json.load(open(MATERIALS_DIR / 'config.json'))

# config logging
logging.basicConfig(
    format='%(asctime)s %(levelname)s %(message)s',
    level=logging.DEBUG,
    handlers=[
        logging.FileHandler(__DIR / 'bundle.log'),
        # logging.StreamHandler()
    ]
)


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
# MATERIALS_RENDER_QUEUE_PRIORITY = config.get('materials_priority')
# MATERIAL_FILES = sorted(
#     MATERIAL_FILES,
#     key=lambda p:
#     MATERIALS_RENDER_QUEUE_PRIORITY.index(matname(p))
#     if matname(p) in MATERIALS_RENDER_QUEUE_PRIORITY
#     else 999
# )


class TaskConfig:
    IS_DEBUG: bool

    type: str
    target_quality_key: str
    target_rotation_key: str
    objects: {
        "packages": list[str],
        "exclude": list[str]
    }
    materials: {
        "packages": list[str],
        "exclude": list[str]
    }

    rotations: list[(int, int, int)]
    samples: int
    resolution_percentage: int
    resolution: int

    priority: list[str]
    dist: Path
    job_file_path: str

    def __init__(self, task: Path, profiles: dict, dist: str) -> None:
        assert task.exists(), f"Invalid task: {task}"

        __data = json.load(open(task))

        self.type = __data.get('type')
        self.objects = __data.get('objects')
        self.materials = __data.get('materials')

        self.target_quality_key = (__data.get('target_quality')
                                   if task else None) or 'PREVIEW'

        assert self.target_quality_key in profiles.get(
            "quality").keys(), f"Invalid target: {self.target_quality_key}"

        self.IS_DEBUG = self.target_quality_key == 'DEBUG'

        self.target_rotation_key = 'DEBUG' if self.IS_DEBUG else (__data.get(
            'target_rotation') if task else None) or 'DEFAULT'

        self.quality_profile: dict = profiles.get(
            "quality").get(self.target_quality_key)

        self.resolution_percentage = self.quality_profile.get(
            'resolution_percentage', 100)

        self.resolution = self.quality_profile['res']

        self.samples = self.quality_profile['samples']

        self.rotations = profiles.get("rotation").get(self.target_rotation_key)

        self.objects = {
            **self.objects,
            'exclude': [] if self.IS_DEBUG else __data.get('objects').get('exclude', [])
        }

        # region resolve dist path
        __task_defined_dist = __data.get('dist')
        __user_override_dist = dist

        if __task_defined_dist and __user_override_dist and not __task_defined_dist == __user_override_dist:
            click.confirm(
                f"Task defined dist: '{__task_defined_dist}' is different from the user override dist: '{__user_override_dist}'. Continue?", abort=True
            )
            self.dist = Path(__user_override_dist).resolve()
        else:
            self.dist = Path(__user_override_dist).resolve() \
                if __task_defined_dist is None \
                else Path(__task_defined_dist).resolve()
        # endregion

        # ensure the dist directory exists before proceeding
        assert self.dist.exists(), f"Invalid dist: {self.dist}"


def resolve_files(base_dir: Path, patterns: list[str]):
    files = []
    for file_path in patterns:
        resolved_paths = glob.glob(str(base_dir / file_path))
        files.extend([Path(p) for p in resolved_paths])
    return files
    ...


class MaterialPackage:
    """
    Material Package directory and files.
    """

    # materials by name: file, material name -> E.g. { 'm.al.oxidized.001': { 'file': 'm.al.blend', 'name': 'm.al.oxidized.001' } }
    name = None
    files = []
    base_dir = None
    materials = {}
    scenes = {}
    render_scene_file: None | Path = None
    render_scene_name: str = RENDER_SCENE_NAME

    def __init__(self, package: Path | str) -> None:
        package = Path(package)
        assert package.exists(
        ), f"Invalid package: {package}"

        package_data = json.load(open(package))
        self.name = package_data['name']
        self.base_dir = package.parent
        # Resolve files relative to base_dir
        self.files = resolve_files(self.base_dir, package_data['files'])

        __is_single_file = len(self.files) == 1

        materials_data = package_data['materials']

        # resolve scenes
        self.scenes = package_data['scenes']
        # resolve render scene
        if self.scenes.get('render'):
            self.render_scene_name = self.scenes.get('render').get('name')
            self.render_scene_file = self.base_dir / \
                self.scenes.get('render').get('file')
            self.render_scene_file = self.render_scene_file.resolve()
            assert self.render_scene_file.exists(
            ), f"Invalid render scene file: {self.render_scene_file}"

        for k, v in materials_data.items():
            file = v.get('file', self.files[0] if __is_single_file else None)
            assert file, f"Invalid material file: {file}"
            material_file = self.base_dir / file
            assert material_file.exists(
            ), f"Invalid material file: {material_file}"

            # inspect material files without loading them into the current blend file
            with bpy.data.libraries.load(str(material_file), link=False) as (data_from, _):
                if v['name'] in data_from.materials:
                    self.materials[k] = {
                        'file': material_file,
                        'name': v['name']
                    }

    def load(self, material_key: str) -> bpy.types.Material | None:
        """
        Loads the material to the current blend file.
        """
        material = self.materials.get(material_key)

        if material:
            material_name = material.get('name')
            with bpy.data.libraries.load(str(material['file'])) as (data_from, data_to):
                data_to.materials = [material_name]

            return bpy.data.materials.get(material_name)

        return None


class ObjectPackage:

    name = None
    # list of names of the scenes that contain the objects
    object_keys: [str] = []
    # dict of objects by scene name, following the format of { 'key': { 'file': <file path>,  'scene': <scene name>, 'name': <object name>, 'object': <bpy.types.Object | None> } }
    objects: dict[str, dict] = {}
    exclude_patterns: list[str] = []
    base_dir = None
    files = []
    # file = None

    _whole_synced = False

    def __init__(self, package: Path | str, exclude_patterns: list[str] = []) -> None:
        package = Path(package)
        assert package.exists(
        ), f"Invalid package: {package}"
        self.base_dir = package.parent

        package_data = json.load(open(package))

        self.name = package_data.get('name')

        self.files = resolve_files(self.base_dir, package_data['files'])
        # assert len(self.files) == 1, f"Invalid files: {self.files}"
        # self.file = self.base_dir / self.files[0]

        self.exclude_patterns = exclude_patterns

        __objects_data = package_data.get('objects')
        if __objects_data is None:
            # if no objects are specified, this is only valid if the package is single-file pack and each objects are in their own scene
            ...
            assert len(self.files) == 1, f"Invalid files: {self.files}"
            self.__index_main_file()
        elif type(__objects_data) == list:
            if len(__objects_data) == 0:
                return
            elif len(__objects_data) == 1:
                self.__index_main_file()
            else:
                raise NotImplementedError(
                    "Multiple file object packages not supported with array configuration yet.")
        elif type(__objects_data) == dict:
            for k, v in __objects_data.items():
                self.objects[k] = {
                    # 'name': v['name'],
                    'file': self.base_dir / v['file'],
                }
                print(k, v)
            # raise NotImplementedError(
            #     "Object packages with dict configuration not supported yet."
            # )
            ...
        else:
            raise Exception(
                f"Invalid objects data type: {type(__objects_data)}")

    def __index_main_file(self):
        assert len(self.files) == 1, f"Invalid files: {self.files}"
        # Index objects
        # first, sync the objects to the current blend file, after indexing is done, delete the scenes and objects
        # so that the current blend file is clean
        __file = self.files[0]
        __objects = self.__index_with_sync(__file)
        self.object_keys = __objects.keys()
        # create empty scene for to be the last scene
        bpy.ops.scene.new(type='EMPTY')
        # clean
        for key, obj in __objects.items():
            self.objects[key] = {
                **obj,
                'object': None,
            }
            # remove
            bpy.data.objects.remove(obj['object'])
            bpy.data.scenes.remove(bpy.data.scenes.get(key))
        self._whole_synced = False

    def load(self, key: str) -> bpy.types.Object | None:
        assert key in self.objects.keys(), f"Invalid key: {key}"
        objdata = self.objects.get(key)
        objname = objdata.get('name')
        objfile = objdata.get('file')

        with bpy.data.libraries.load(str(objfile)) as (data_from, data_to):
            data_to.objects = [objname]

        return bpy.data.objects.get(objname)

    def __index_with_sync(self, file):
        """
        Indexing - sync all scenes and objects from the package to the current blend file.
        This is used when no object is specified, but instead when to use all objects as a input for a certain file.
        """
        if self._whole_synced:
            return self.objects

        # sync scenes
        with bpy.data.libraries.load(str(file)) as (data_from, data_to):
            scenes_to_link = []

            for scene in data_from.scenes:
                # Exclude objects if they contain any of the exclude patterns
                if not any(fnmatch.fnmatch(scene, pattern) for pattern in self.exclude_patterns):
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

        for key, obj in objects_to_render.items():
            self.objects[key] = {
                'file': file,
                'scene': key,
                'name': obj.name,
                'object': obj
            }

        return self.objects


class RenderJobFile:
    """
    Job file - material:object paired file
    """
    scene: bpy.types.Scene
    boundingbox: bpy.types.Object
    material: bpy.types.Material
    model: bpy.types.Object
    object_key: str
    material_key: str
    rotations: list[(int, int, int)]
    render_out: Path | str
    # frame: rotation, E.g. { 1: '0°0°0°', 2: '0°0°15°', ... }
    rotation_frame_map: dict[int, str] = {}
    use_animation: bool = False
    use_transparent_background: bool = True

    scene_file: Path | str
    scene_name: str

    def __init__(
        self,
        material_pack: MaterialPackage,
        material_key: str,
        object_pack: ObjectPackage,
        object_key: str,
        rotations: list[(int, int, int)] = [(0, 0, 0)],
        use_animation: bool = False,
        use_transparent_background: bool = True,
        use_denoising=False,
        scene_file: Path | str = None,
        scene_name: str = RENDER_SCENE_NAME,
        render_out: Path | str = None,
    ):
        self.object_key = object_key
        self.material_key = material_key
        self.rotations = rotations
        self.use_animation = use_animation
        self.use_transparent_background = use_transparent_background
        self.render_out = Path(render_out)

        # render scene
        self.scene_file = scene_file
        assert self.scene_file, f"Invalid scene file: {self.scene_file}"
        self.scene_name = scene_name
        assert self.scene_name, f"Invalid scene name: {self.scene_name}"

        # reset the vm to work with a clean slate
        bpy.ops.wm.read_homefile(use_empty=True)

        if scene_name not in bpy.data.scenes:
            try:
                # load the render scene
                with bpy.data.libraries.load(str(scene_file)) as (data_from, data_to):
                    data_to.scenes = [scene_name]
            except KeyError as e:
                logging.error(
                    f"Error: Could not load scene '{scene_name}' from '{scene_file}': {e}")

                # Assuming you want to do the work in the current blend file.
                # Check if the "render" scene exists, if not, link it from the material_file
                # fallback
                material_file = material_pack.materials.get(material_key)[
                    'file']
                with bpy.data.libraries.load(str(material_file)) as (data_from, data_to):
                    data_to.scenes = data_from.scenes

        scene = bpy.data.scenes[scene_name]
        bpy.context.window.scene = scene  # Set current scene
        self.scene = scene

        # get the bounding box
        self.boundingbox = self.__get_bounding_box()
        assert self.boundingbox, f"Invalid bounding box: {self.boundingbox}"

        # load the material
        self.material = material_pack.load(material_key)
        assert self.material, f"Invalid material: {material_key}"

        # load the object (model)
        self.model = object_pack.load(object_key)
        assert self.model, f"Invalid model: {object_key}"

        # link the model to the scene
        self.scene.collection.objects.link(self.model)

        # Convert the object to mesh if not. (E.g. matball, etc.)
        convert_to_mesh(self.model)

        # Assign the material to the object
        assign_material(self.model, self.material)

        # Scale and position the object to fit within bounding_box
        place_object(self.model, self.boundingbox)

        # Insert keyframes for the rotations
        if self.use_animation:
            self.__insert_keyframes()

        # Set the background to transparent
        if self.use_transparent_background:
            bpy.context.scene.render.film_transparent = True
            # output format as PNG, color as RGBA
            bpy.context.scene.render.image_settings.file_format = 'PNG'
            bpy.context.scene.render.image_settings.color_mode = 'RGBA'

        # denoise setting
        scene.cycles.use_denoising = use_denoising

        # config the render engine
        bpy.context.scene.render.engine = 'CYCLES'
        bpy.context.scene.cycles.device = 'GPU'

        # clear the output path
        bpy.context.scene.render.filepath = ''

    def save(self, path, resolution_x, resolution_y, resolution_percentage=100, samples=128):
        """
        Saves the render scene file as a new blend file.
        """
        # === redirect output to log file
        logfile = 'blender_render.log'
        open(logfile, 'a').close()
        old = os.dup(sys.stdout.fileno())
        sys.stdout.flush()
        os.close(sys.stdout.fileno())
        fd = os.open(logfile, os.O_WRONLY)
        # ===

        # clean
        remove_unused_scenes(exclude=[self.scene_name])
        remove_unused_objects()
        remove_unused_materials()
        remove_unused_textures()

        # samples
        bpy.context.scene.cycles.samples = samples
        bpy.context.scene.cycles.preview_samples = samples
        # res
        bpy.context.scene.render.resolution_x = resolution_x
        bpy.context.scene.render.resolution_y = resolution_y
        bpy.context.scene.render.resolution_percentage = resolution_percentage

        # Save the current blend file to the specified path
        bpy.ops.wm.save_as_mainfile(filepath=path)

        # === disable output redirection
        os.close(fd)
        os.dup(old)
        os.close(old)
        # ===

    def __insert_keyframes(self):
        """
        Inserts keyframes for the provided rotations.
        """
        total_rotations = len(self.rotations)
        for idx, rotation in enumerate(self.rotations):
            # Set rotation
            self.rotate(rotation)

            # Insert keyframe for the rotation. We'll place each rotation at its own frame.
            self.model.keyframe_insert(
                data_path="rotation_euler", frame=idx)

            # Update the rotation_frame_map
            self.rotation_frame_map[idx]\
                = f"{rotation[0]}°{rotation[1]}°{rotation[2]}°"

        # Set the end frame to be equal to the total number of rotations
        self.scene.frame_end = total_rotations - 1
        # Set start frame to 0
        self.scene.frame_start = 0

    def render_all(
        self,
        rotation: (int, int, int),
        samples: int,
        resolution_x: int,
        resolution_y: int,
        resolution_percentage=100,
    ):
        """
        Renders the scene with all rotations.
        """
        if self.use_animation:
            raise NotImplementedError("Animation not supported yet.")

        for rotation in self.rotations:
            yield self.render_one(
                rotation,
                samples=samples,
                resolution_x=resolution_x,
                resolution_y=resolution_y,
                resolution_percentage=resolution_percentage
            )

    def render_one(
        self,
        rotation: (int, int, int),
        samples: int,
        resolution_x: int,
        resolution_y: int,
        resolution_percentage=100,
        skip_existing: bool = True
    ):
        """
        Renders the scene with one rotation.
        """
        if self.use_animation:
            raise NotImplementedError("Animation not supported yet.")

        m_samples = int(
            samples * optimzied_samples_scale_by_material(self.material_key)
        )
        self.rotate(rotation)

        id = outname(
            object_name=self.object_key,
            material_name=self.material_key,
            rotation=rotation,
            resolution_x=resolution_x,
            resolution_y=resolution_y,
            samples=m_samples,
            quality=resolution_percentage
        )

        filepath = str(self.render_out / f"{id}.png")

        if skip_existing and os.path.exists(filepath):
            logging.info(f"Skipping {filepath}")
            return

        render(
            filepath=filepath,
            samples=m_samples,
            resolution_x=resolution_x,
            resolution_y=resolution_y,
            resolution_percentage=resolution_percentage,
        )

    def rotate(self, rotation: (int, int, int), force: bool = False):
        """
        Rotates the model to the provided rotation.
        """
        obj = self.model

        if obj.rotation_mode == 'QUATERNION' and force:
            # Convert quaternion to euler - consider not changing the rotation mode.
            obj.rotation_mode = 'XYZ'
            logging.info(f"Converting quaternion to euler for {obj.name}")

        obj.lock_rotation = [False, False, False]
        obj.rotation_euler = [radians(angle) for angle in rotation]

        return self.model

    def __get_bounding_box(self):
        return self.scene.objects.get("boundingbox")


def outname(object_name, rotation, material_name=None, resolution_x=512, resolution_y=512, quality=100, samples=128):
    rot = "{rotation[0]}°{rotation[1]}°{rotation[2]}°"\
        .format(rotation=rotation)
    res = f'{resolution_x}x{resolution_y}'
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


def remove_unused_scenes(exclude=[RENDER_SCENE_NAME]):
    for scene in bpy.data.scenes:
        if scene.name not in exclude:
            bpy.data.scenes.remove(scene)


def remove_unused_objects():
    for obj in bpy.data.objects:
        # - if the object has no users in any scenes
        # - if the object does not impact the render (Disable in Renders)
        if not obj.users_scene or obj.hide_render:
            bpy.data.objects.remove(obj)


def remove_unused_materials():
    for mat in bpy.data.materials:
        if not mat.users:  # if the material has no users
            bpy.data.materials.remove(mat)


def remove_unused_textures():
    for tex in bpy.data.textures:
        if not tex.users:  # if the texture has no users
            bpy.data.textures.remove(tex)

    for img in bpy.data.images:
        if not img.users:  # if the image has no users
            bpy.data.images.remove(img)


def fit_scale(obj, box):
    obj_dimensions = obj.dimensions
    bb_x, bb_y, bb_z = boundingbox_dimension(box)
    scale_factor = min(
        bb_x / obj_dimensions.x if obj_dimensions.x > 0 else 1,
        bb_y / obj_dimensions.y if obj_dimensions.y > 0 else 1,
        bb_z / obj_dimensions.z if obj_dimensions.z > 0 else 1,
    )

    return scale_factor


def place_object(obj, box):
    """
    Positions the object at the center of the bounding box.
    """
    # Scale and position the object to fit within bounding_box
    scale_factor = fit_scale(obj, box)
    obj.scale = (scale_factor, scale_factor, scale_factor)

    # Position the object at the center of the bounding box
    obj.location = box.location

    # Ensure the object is visible on render
    obj.hide_render = False


def assign_material(obj, material):
    if obj.data is None:
        logging.error(f"Error: {obj.name} has no mesh data")
        return
    if obj.data.materials:
        obj.data.materials[0] = material
    else:
        obj.data.materials.append(material)


def convert_to_mesh(obj):
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


def render(filepath, samples=128, resolution_x=512, resolution_y=512, resolution_percentage=100):
    assert filepath is not None, "filepath cannot be None"

    # Set the filepath
    bpy.context.scene.render.filepath = filepath

    # Optimize for rendering
    bpy.context.scene.render.engine = 'CYCLES'
    bpy.context.scene.cycles.device = 'GPU'
    bpy.context.scene.cycles.samples = samples
    # Resolution
    bpy.context.scene.render.resolution_x = resolution_x
    bpy.context.scene.render.resolution_y = resolution_y
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


def safepath(path: str):
    """
    Make the path acceptable for Linux, Mac, and Windows.
    """
    # Replace reserved characters with underscores
    invalid_chars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*']
    for char in invalid_chars:
        path = path.replace(char, '_')

    return path


@click.command()
@click.option('--task', '-t', default='./task.json', help='Task file', type=click.Path(exists=True),)
@click.option('--dist', default='./dist', help='Dist directory', type=click.Path(exists=True),)
@click.option('--dry-run', '-d', is_flag=True, help='Dry run')
@click.option('--max', default=None, help='Max number of jobs to handle (useful when testing)', type=int)
@click.option('--force', is_flag=True, help='Force')
def main(task, dist, dry_run, max, force):

    profiles: dict = json.load(open(__DIR / 'profiles.json'))
    task = Path(task).resolve()
    task = TaskConfig(task, profiles=profiles, dist=dist)

    print(f"- DIST: {task.dist}")
    print(f"- TARGET {task.target_quality_key}...")
    print(f"- PROFILE: {json.dumps(task.quality_profile, indent=2)}")
    print(f"- #ROTATIONS: {len(task.rotations)}")
    print(f"- Dry run: {dry_run}")

    RENDEROUTDIR = task.dist / task.target_quality_key

    # TODO: support multiple packages

    # matpacks = [
    #     MaterialPackage(
    #         __DIR / matpack / 'package.json'
    #     ) for matpack in __matpacks
    # ]

    # objpacks = [
    #     ObjectPackage(
    #         __DIR / objpack / 'package.json',
    #         exclude_patterns=task.objects['exclude']
    #     ) for objpack in __objpacks
    # ]

    __matpacks = task.materials['packages']
    __objpacks = task.objects['packages']
    matpack = MaterialPackage(
        __DIR / __matpacks[0] / 'package.json'
    )

    objpack = ObjectPackage(
        __DIR / __objpacks[0] / 'package.json',
        exclude_patterns=task.objects['exclude']
    )

    matpacks = [matpack]
    objpacks = [objpack]

    # # print(objpack.objects)
    # # key = list(objpack.objects.keys())[0]
    # # print(objpack.load(key))

    click.echo("\n\n")
    click.echo("=== START ===")
    click.echo(f"Note: Do not modify or change the name of the following files:\n")

    all_locked_files = set()
    for matpack in matpacks:
        all_locked_files.update(matpack.files)
    for objpack in objpacks:
        all_locked_files.update(objpack.files)

    for f in all_locked_files:
        click.echo(f"- '{f.resolve()}'")
    click.echo("\n\n")

    ___i_max = 0

    print(f"=== RENDERING {len(matpack.materials)} MATERIALS ===")
    for k, v in matpack.materials.items():
        file = v['file']
        logging.info(
            f"Rendering {file}... (scene: {matpack.render_scene_file})")

        # reset the vm to work with a clean slate
        bpy.ops.wm.read_homefile(use_empty=True)

        render_out = RENDEROUTDIR / k
        jobs = task.dist / 'jobs' / matpack.name / k / \
            objpack.name / task.target_rotation_key
        jobs.mkdir(parents=True, exist_ok=True)
        use_animation = True

        tasksize = len(objpack.object_keys) if use_animation else len(
            objpack.object_keys) * len(task.rotations)

        # Initialize the progress bar (tracks each render)
        pbar = tqdm(total=(tasksize), desc=k, leave=True)

        for object_key in objpack.object_keys:
            object_key = object_key.replace('/', ':')
            object_key = safepath(object_key)
            filepath = jobs / f"{object_key}.blend"
            if not force and filepath.exists():
                pbar.update(len(task.rotations))
                continue

            try:
                jobfile = RenderJobFile(
                    material_pack=matpack,
                    material_key=k,
                    object_pack=objpack,
                    object_key=object_key,
                    rotations=task.rotations,
                    use_animation=use_animation,
                    use_transparent_background=True,
                    render_out=render_out,
                    scene_file=matpack.render_scene_file,
                    scene_name=matpack.render_scene_name
                )

                if dry_run:
                    pbar.update()
                    continue

                jobfile.save(
                    str(filepath),
                    resolution_x=task.resolution,
                    resolution_y=task.resolution,
                    resolution_percentage=task.resolution_percentage,
                    samples=task.samples
                )
                pbar.update()
            except Exception as e:
                # raise e
                logging.error(
                    f"Error: Could not render {object_key} with {k}: {e}")

            ___i_max += 1
            if max and ___i_max >= max:
                return

        # clean up (TODO: NOT WORKING)
        for b1 in Path(jobs).glob('*.blend1'):
            b1.unlink()

        pbar.close()


if __name__ == "__main__":
    main()
