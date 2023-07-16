import bpy
import os
import json

def _d_render_mesh_property(obj, **_):
    ...

def _d_render_global_property(obj, **_):
    ...

def _d_render_font_property(obj: bpy.types.Object, **_):
    data = _.get('data')
    data_body = data.get('body')
    # text
    obj.data.body = data_body
    ...

def _d_render_material_property(obj, **_):
    ...

class TemplateProcessor:
    def __init__(self, file, meta, output_dir):
        self.file = file
        self.output_dir = output_dir


        self.__open()

        self.animated_objects = [obj for obj in bpy.context.scene.objects if obj.animation_data is not None]
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

    def config(self,**preferences):
        bpy.context.scene.frame_end = preferences.get('frame_end', bpy.context.scene.frame_end)
        bpy.context.scene.cycles.samples = preferences.get('samples', bpy.context.scene.cycles.samples)
        bpy.context.scene.render.resolution_x = preferences.get('resolution_x', bpy.context.scene.render.resolution_x)
        bpy.context.scene.render.resolution_y = preferences.get('resolution_y', bpy.context.scene.render.resolution_y)

    def render_animation(self, format='PNG'):
        bpy.context.scene.render.image_settings.file_format = 'PNG'
        bpy.ops.render.render(animation=True)
    
    def render_still(self, format='PNG'):
        bpy.context.scene.render.image_settings.file_format = 'PNG'
        bpy.ops.render.render(write_still=True)

    def render(self, format='PNG'):
        if self.has_anim:
            # Renter the animation
            self.render_animation(format=format)
        else:
            # Render the scene
            self.render_still(format=format)



if __name__ == "__main__":
    file = os.getenv('BLENDER_FILE')
    # meta_file = os.getenv('META_FILE')
    data_file = os.getenv('DATA_FILE')
    out = os.getenv('OUTPUT_PATH')

    # with open(meta_file, 'r') as json_file:
    #     meta = json.load(json_file)

    with open(data_file, 'r') as json_file:
        data = json.load(json_file)


    if not all([file, data, out]):
        raise Exception("Required environment variables not set")
    
    processor = TemplateProcessor(file, {}, out)
    processor.optimize()
    processor.data(**data)
    processor.render()
