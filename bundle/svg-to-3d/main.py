import bpy
from pathlib import Path


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


def import_svg(filepath: Path, join=True, scale_factor=1.0):
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

    # After this, normalize the dimensions of the active object
    normalize_object_dimensions(bpy.context.active_object)

    # Extrude the object by adding solidify modifier
    bpy.ops.object.modifier_add(type='SOLIDIFY')
    bpy.context.object.modifiers["Solidify"].thickness = 0.1
    bpy.context.object.modifiers["Solidify"].offset = 0.0

    print("SVG imported, scaled, and normalized.")


def normalize_object_dimensions(obj):
    # Convert to mesh if it's a curve
    if obj.type == 'CURVE':
        bpy.ops.object.convert(target='MESH')

    # Set origin to center of the object volume
    bpy.ops.object.origin_set(type='ORIGIN_CENTER_OF_VOLUME', center='MEDIAN')

    # Reset
    obj.scale = (1, 1, 1)

    # Force update
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.object.mode_set(mode='OBJECT')

    # Calculate scale factor to fit within a (2, 2, 2) cube
    target_bounding_box = 2
    scale_factor = target_bounding_box / max(obj.dimensions)

    # Apply the scale
    obj.scale = (scale_factor, scale_factor, scale_factor)

    # Set object location to (0, 0, 0)
    obj.location = (0, 0, 0)

    # Apply transformations (rotation and scale)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)


def main():
    svgs = Path("data/radix-icons").glob("*.svg")
    for svg in svgs:
        name = svg.stem

        # Create a new scene
        new_scene = bpy.data.scenes.new(name)
        bpy.context.window.scene = new_scene

        import_svg(svg)

    # Save the main blender file with all scenes
    bpy.ops.wm.save_as_mainfile(filepath="scenes/radix-icons.blend")


if __name__ == "__main__":
    main()
