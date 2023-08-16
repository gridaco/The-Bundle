import logging
import bpy
import os
import json

from dmt.src.camera import camera_focus, camera_focus_collection
from dmt.src.fonts.fonts import font
from dmt.src.light.light import LightModifier


def srgb_to_linear(srgb):
    """Converts an sRGB color to linear space."""
    if srgb <= 0.04045:
        return srgb / 12.92
    else:
        return ((srgb + 0.055) / 1.055) ** 2.4


def fmt_blender_rgb(rgb, alpha=True, linearize=True):
    """
    if rgb is hex string, convert to rgb tuple and normalize to 0-1
    the hex string should be in the format of #RRGGBB

    also, if (r, g, b) is provided, make it (r, g, b, 1)
    """
    if isinstance(rgb, str) and rgb.startswith("#"):
        # hex to rgb, and also, skip the first character (#)
        rgb = tuple(int(rgb[i:i+2], 16) for i in (1, 3, 5))
        # 255 to 1
        rgb = tuple([x / 255 for x in rgb])
        if linearize:
            # Convert the sRGB tuple to linear space
            rgb = tuple([srgb_to_linear(x) for x in rgb])

    if len(rgb) == 3:
        if alpha:
            return (rgb[0], rgb[1], rgb[2], 1)
        else:
            return rgb
    elif len(rgb) == 4:
        if alpha:
            return rgb
        else:
            return (rgb[0], rgb[1], rgb[2])
    else:
        if alpha:
            return (0, 0, 0, 1)
        else:
            return (0, 0, 0)


def _d_apply_data_to_object_material(obj, **_):
    try:
        material_slots = _.get('material_slots')
        if material_slots is None:
            return

        keys = material_slots.keys()
        for key in keys:
            material = bpy.data.materials.get(key)
            material_slot_data = material_slots.get(key)
            nodes = material_slot_data.get('node_tree').get('nodes')
            shader_node_keys = nodes.keys()
            for shader_node_key in shader_node_keys:
                shader_node = material.node_tree.nodes.get(shader_node_key)
                if shader_node.type == "GROUP":
                    group_node_data = nodes.get(
                        shader_node_key).get('node_tree').get('nodes')
                    for k, v in group_node_data.items():
                        shader_node_2 = shader_node.node_tree.nodes.get(k)
                        if shader_node_2.type == "RGB":
                            # update the color value with data.
                            color = fmt_blender_rgb(v)
                            shader_node_2.outputs[0].default_value = color

    except Exception as e:
        # this module is still under development, catch all exceptions
        logging.log(logging.ERROR, e)


def _d_aply_data_to_object_text(obj: bpy.types.TextCurve, **_):
    """
    Info: TextCurve is 3D text object
    """
    data = _.get('data')

    # text
    data_body = data.get('body', obj.data.body)
    obj.data.body = data_body

    # font
    data_font = data.get('font', None)
    if data_font:
        font_family = data_font.get('font-family')
        font_weight = data_font.get('font-weight')
        font_file = str(font(familly=font_family, weight=font_weight))
        if font_file:
            try:
                bfont = bpy.data.fonts.load(font_file)
                obj.data.font = bfont
                obj.data.font_bold = bfont
                obj.data.font_italic = bfont
                obj.data.font_bold_italic = bfont
                print(f'Applied font_file: {font_file}')
            except:
                logging.log(logging.ERROR,
                            f'Error while applying font: {font_file}')
        else:
            logging.log(logging.ERROR,
                        f'Font not found: {json.dumps(data_font)}')

    # == Paragraph ==
    # alignment
    data_align_x = data.get('align_x')
    if data_align_x:
        obj.data.align_x = data_align_x

    data_align_y = data.get('align_y')
    if data_align_y:
        obj.data.align_y = data_align_y

    # character spacing (nullable)
    data_space_character = data.get('space_character')
    if data_space_character:
        obj.data.space_character = data_space_character

    # word spacing (nullable)
    data_space_word = data.get('space_word')
    if data_space_word:
        obj.data.space_word = data_space_word

    # line spacing (nullable)
    data_space_line = data.get('space_line')
    if data_space_line:
        obj.data.space_line = data_space_line

    # == Geometry ==
    # extrude
    data_extrude = data.get('extrude')
    if data_extrude:
        obj.data.extrude = data_extrude

    # bevel
    data_bevel_depth = data.get('bevel_depth')
    if data_bevel_depth:
        obj.data.bevel_depth = data_bevel_depth

    # below steps are required to ensure the text object's geometry is updated as well
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.object.mode_set(mode='OBJECT')
    # this way, the text object's geometry is updated properly (known bug in blender)


def _d_apply_data_to_material(obj, **_):
    ...


def _d_apply_data_to_light(obj, **_):
    modifier = LightModifier(obj.data)
    light_data = _.get('data')

    if light_data is None:
        return

    # apply color
    color = light_data.get('color')
    color = fmt_blender_rgb(color, alpha=False)

    modifier.apply_color(color)


class TemplateProcessor:
    def __init__(self, file, meta, output_dir):
        self.file = file
        self.output_dir = output_dir

        # always call open first in order to interact with bpy
        self.__open()

        self.animated_objects = [
            obj for obj in bpy.context.scene.objects if obj.animation_data is not None]
        self.has_anim = len(self.animated_objects) > 0

        # Set the render output path
        bpy.context.scene.render.filepath = output_dir

    def __open(self):
        bpy.ops.wm.open_mainfile(filepath=self.file)

    def data(self, **data):
        """
        apply the data to template objects and materials
        """
        keys = data.keys()

        for key in keys:
            obj = bpy.data.objects.get(key)
            if obj is None:
                continue
            obj_data = data.get(key)
            _d_apply_data_to_object_material(obj, **obj_data)
            if obj.type == 'FONT':
                _d_aply_data_to_object_text(obj, **obj_data)
            elif obj.type == 'MESH':
                ...
            elif obj.type == 'CURVE':
                ...
            elif obj.type == 'LIGHT':
                _d_apply_data_to_light(obj, **obj_data)
            elif obj.type == 'CAMERA':
                ...
            else:
                print("Unsupported object type: {}".format(obj.type))

    def optimize(self):
        # If animation, limit the frames up to 60
        self.config(
            frame_end=min(60, bpy.context.scene.frame_end),
            samples=128,
            resolution_x=512,
            resolution_y=512
        )

    def config(self, **preferences):
        bpy.context.scene.frame_end = preferences.get(
            'frame_end', bpy.context.scene.frame_end)

        # samples
        # - cycles
        bpy.context.scene.cycles.samples = preferences.get(
            'samples', bpy.context.scene.cycles.samples)
        # - eevee
        bpy.context.scene.eevee.taa_render_samples = preferences.get(
            'samples', bpy.context.scene.eevee.taa_render_samples)

        bpy.context.scene.render.resolution_x = preferences.get(
            'resolution_x', bpy.context.scene.render.resolution_x)
        bpy.context.scene.render.resolution_y = preferences.get(
            'resolution_y', bpy.context.scene.render.resolution_y)

    def render_animation(self, format='PNG', engine='CYCLES'):
        bpy.context.scene.render.engine = engine
        bpy.context.scene.render.image_settings.file_format = format
        bpy.ops.render.render(animation=True)

    def render_still(self, format='PNG', engine='CYCLES'):
        bpy.context.scene.render.engine = engine
        bpy.context.scene.render.image_settings.file_format = format

        # this will result ~/still.png
        bpy.context.scene.render.filepath = self.output_dir + '/still'

        # def write_image(rend_result):
        #     # Here you can do whatever you want with the rend_result
        #     # For instance, you can save it to a file
        #     rend_result.save_render(filepath="/path/to/output.png")
        # # callback per each sample
        # bpy.app.handlers.render_write.append(write_image)
        bpy.ops.render.render(write_still=True)

    def render(self, format='PNG', engine='CYCLES', still=True):
        if still or not self.has_anim:
            # Render the scene
            self.render_still(format=format, engine=engine)
        else:
            # Renter the animation
            self.render_animation(format=format, engine=engine)


if __name__ == "__main__":
    file = os.getenv('DMT_BLENDER_FILE')
    meta_file = os.getenv('DMT_META_FILE')
    config = os.getenv('DMT_CONFIG')
    request_file = os.getenv('DMT_REQUEST_FILE')
    data_file = os.getenv('DMT_DATA_FILE')
    out = os.getenv('DMT_OUTPUT_PATH')

    # try to parse config json string
    if config is not None:
        try:
            config = json.loads(config)
        except:
            config = None

    # try to parse request json string
    try:
        with open(request_file, 'r') as json_file:
            request = json.load(json_file)
    except:
        # default request
        request = {
            'format': 'PNG',
            'engine': 'CYCLES',
            'still': True,
            # TODO: consider moving this to another place
            'target_object': None,
            'target_collection': None,
        }

    try:
        with open(meta_file, 'r') as json_file:
            meta = json.load(json_file)
    except:
        meta = {}

    with open(data_file, 'r') as json_file:
        data = json.load(json_file)

    if not all([file, data, out]):
        raise Exception("Required environment variables not set")

    processor = TemplateProcessor(file, meta, out)

    processor.optimize()
    if config is not None:
        processor.config(**config)

    processor.data(**data)

    # if request:
    #     try:
    #         processor.render(**request)
    #     except:
    #         ...

    # focus
    camera = bpy.context.scene.camera
    target_object_name = request.get(
        'target_object', None)
    target_object = bpy.data.objects[target_object_name]if target_object_name else None
    target_collection_name = request.get('target_collection', None)
    target_collection = bpy.data.collections[target_collection_name] if target_collection_name else None

    if target_collection:
        try:
            camera_focus_collection.fit_camera_to_collection(
                camera=camera,
                target_collection=target_collection,
                margin=0.3,
                zoom_in=True,
                zoom_out=True
            )
        except ValueError:
            ...
    elif target_object:
        try:
            camera_focus.fit_camera_to_object(
                camera=camera,
                target_object=target_object,
                margin=0.3,
                zoom_in=True,
                zoom_out=True
            )
        except ValueError:
            ...
    else:
        print("No focus target provided, using default scene configurations")

    processor.render()
