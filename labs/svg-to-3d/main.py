import bpy
import json
from pathlib import Path
import os


def scale_collection(collection_name, scale_factor):
    # Deselect all objects
    bpy.ops.object.select_all(action='DESELECT')

    # Select objects in the collection
    collection = bpy.data.collections.get(collection_name)
    if not collection:
        return

    for obj in collection.objects:
        obj.select_set(True)

    # Set one of the objects in the collection as the active object
    bpy.context.view_layer.objects.active = collection.objects[0]

    # Scale the selected objects
    bpy.ops.transform.resize(value=(scale_factor, scale_factor, scale_factor))


def import_svg_and_extrude(filepath: Path, extrude_amount=0.1, join=True, scale_factor=1.0):
    # Ensure the SVG importer is enabled
    if "io_curve_svg" not in bpy.context.preferences.addons:
        bpy.ops.wm.addon_enable(module="io_curve_svg")

    # Import SVG
    bpy.ops.import_curve.svg(filepath=str(filepath))

    # Store the objects imported for later joining
    imported_objs = bpy.context.selected_objects

    # Go through each imported curve and extrude
    for obj in imported_objs:
        if obj.type == 'CURVE':
            # Set curve to 3D
            obj.data.dimensions = '3D'
            obj.data.extrude = extrude_amount
            # Ensure fill mode is set to both
            obj.data.fill_mode = 'BOTH'

    # Optionally join all curves into one
    if join and len(imported_objs) > 1:
        bpy.ops.object.select_all(action='DESELECT')
        for obj in imported_objs:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = imported_objs[0]
        bpy.ops.object.join()

    name = filepath.name
    # Scale the collection
    scale_collection(name, scale_factor)

    print("SVG imported, extruded, and scaled.")
# Example usage:
# import_svg_and_extrude("/path/to/your/file.svg", extrude_amount=0.1, scale_factor=0.01)


def main():
    svgs = Path("data/radix-icons").glob("*.svg")
    for svg in svgs:
        name = svg.stem
        blenderfile = f"scenes/radix-icons/{name}.blend"

        # create new blender file
        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.ops.wm.save_as_mainfile(filepath=blenderfile)

        import_svg_and_extrude(svg, extrude_amount=100, scale_factor=500)

        # save blender file
        bpy.ops.wm.save_as_mainfile(filepath=blenderfile)


if __name__ == "__main__":
    main()
