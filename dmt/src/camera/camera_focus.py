import bpy
from math import tan, radians, atan
from mathutils import Vector, Matrix


def ortho_fit(object: bpy.types.Object):
    """
    Calculate the orthographic scale to fit the object in the camera view.
    Takes margin (%) as argument, e.g. 0.1 will add a 10% margin.
    """
    # Ensure the camera is orthographic
    cam = bpy.context.scene.camera
    if cam.data.type != 'ORTHO':
        raise ValueError("Camera must be orthographic")

    # Transform the bounding box to the camera's space
    matrix = cam.matrix_world.inverted() @ object.matrix_world
    bbox = [matrix @ Vector(corner) for corner in object.bound_box]

    # Get width and height of bounding box in camera space
    xs = [coord.x for coord in bbox]
    ys = [coord.y for coord in bbox]
    width = max(xs) - min(xs)
    height = max(ys) - min(ys)

    # Get camera's aspect ratio
    aspect_ratio = bpy.context.scene.render.resolution_x / \
        bpy.context.scene.render.resolution_y

    # Calculate and return the orthographic scale based on the bounding box's size
    if aspect_ratio >= 1:  # width >= height
        scale_value = max(width * aspect_ratio, height)
    else:
        scale_value = max(width, height / aspect_ratio)

    return scale_value
