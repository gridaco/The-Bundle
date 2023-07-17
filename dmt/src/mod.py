import logging
import bpy
import os
import json
from pathlib import Path

HOME_DIR = Path.home()


def _d_render_mesh_property(obj, **_):
    ...


def _d_render_global_property(obj, **_):
    ...


def _d_render_font_property(obj: bpy.types.Object, **_):
    data = _.get('data')

    # text
    data_body = data.get('body', obj.data.body)
    obj.data.body = data_body

    # font
    data_font = data.get('font', None)
    # Local fonts directory -
    # TODO: - resolve font path by name or id
    # TODO: Add google font support
    if data_font:
        try:
            font_file = HOME_DIR / './Library/Fonts' / (data_font + '.ttf')
            font = bpy.data.fonts.load(font_file)
            obj.data.font = font
        except:
            logging.log(logging.ERROR, 'Font not found: ' + data_font)
            ...

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


def _d_render_material_property(obj, **_):
    ...


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
        Render the template with the given data (not a real rendering, but file modification)
        """
        ...
        keys = data.keys()

        for key in keys:
            obj = bpy.data.objects.get(key)
            if obj is None:
                continue
            obj_data = data.get(key)
            _d_render_global_property(obj, **obj_data)
            if obj.type == 'FONT':
                _d_render_font_property(obj, **obj_data)
            elif obj.type == 'MESH':
                _d_render_global_property(obj, **obj_data)
            else:
                print("Unsupported object type: {}".format(obj.type))

    def optimize(self):
        # If animation, limit the frames up to 60
        self.config(
            frame_end=min(60, bpy.context.scene.frame_end),
            samples=128,
            resolution_x=500,
            resolution_y=500
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

        # def write_image(rend_result):
        #     # Here you can do whatever you want with the rend_result
        #     # For instance, you can save it to a file
        #     rend_result.save_render(filepath="/path/to/output.png")
        # # callback per each sample
        # bpy.app.handlers.render_write.append(write_image)
        bpy.ops.render.render(write_still=True)

    def render(self, format='PNG', engine='CYCLES'):
        if self.has_anim:
            # Renter the animation
            self.render_animation(format=format, engine=engine)
        else:
            # Render the scene
            self.render_still(format=format, engine=engine)


if __name__ == "__main__":
    file = os.getenv('BLENDER_FILE')
    meta_file = os.getenv('META_FILE')
    config = os.getenv('CONFIG')
    data_file = os.getenv('DATA_FILE')
    out = os.getenv('OUTPUT_PATH')

    # try to parse config json string
    if config is not None:
        try:
            config = json.loads(config)
        except:
            config = None

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
    # processor.render()
    processor.render_still(
        # engine='BLENDER_EEVEE'
    )
