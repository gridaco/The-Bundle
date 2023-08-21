bl_info = {
    "name": "LSD",
    "author": "Grida, Inc.",
    "version": (1, 0),
    "blender": (3, 6, 0),
    "location": "View3D > Tool Shelf > LSD",
    "description": "LSD addon for template curation",
    "category": "Development",
}

import bpy
import json

class MainPanel(bpy.types.Panel):
    """Creates a Panel in the Object properties window"""
    bl_label = "LSD"
    bl_idname = "OBJECT_PT_1"
    bl_space_type = 'PROPERTIES'
    bl_region_type = 'WINDOW'
    bl_context = "object"

    def draw(self, context):
        layout = self.layout

        obj = context.object

        row = layout.row()
        row.label(text="LSD", icon='WORLD_DATA')

        row = layout.row()
        row.label(text="Active object is: " + obj.name)
        row = layout.row()
        row.prop(obj, "name")

        # export button
        row = layout.row()
        row.operator("object.export_json", text="Export")


    def export_json():
        data = {}

        for obj in bpy.context.scene.objects:
            data[obj.name] = {
                'location': tuple(obj.location),
                'rotation': tuple(obj.rotation_euler),
                'scale': tuple(obj.scale),
            }

        json_data = json.dumps(data, indent=4)

        with open('scene_data.json', 'w') as f:
            f.write(json_data)

def register():
    bpy.utils.register_class(MainPanel)

def unregister():
    bpy.utils.unregister_class(MainPanel)

if __name__ == "__main__":
    register()
