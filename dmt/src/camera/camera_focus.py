import bpy
from math import tan, radians, atan
from mathutils import Vector, Matrix


def fit_camera_to_object(camera, target_object: bpy.types.Object, margin: float = 0.0, zoom_in: bool = False, zoom_out: bool = True):
    if camera.data.type == 'ORTHO':
        initial = camera.data.ortho_scale
        scale = calc_ortho_camera_object_fit_scale(
            camera, target_object, margin)

        # scale larger = zoom out
        # scale smaller = zoom in
        if (zoom_in and scale < initial) or (zoom_out and scale > initial):
            camera.data.ortho_scale = scale

    elif camera.data.type == 'PERSP':
        initial = camera.data.angle
        fov = calc_persp_camera_object_fit_fov(
            camera, target_object, margin)

        # fov smaller = zoom in
        # fov larger = zoom out
        if (zoom_in and fov < initial) or (zoom_out and fov > initial):
            camera.data.angle = fov

    elif camera.data.type == 'PANO':
        ...
    else:
        raise ValueError("Camera must be orthographic or perspective")


def calc_persp_camera_object_fit_fov(camera: bpy.types.Camera, object: bpy.types.Object, margin: float = 0.0):
    # Get the distance from the camera to the object's center
    cam_location = camera.matrix_world.translation
    obj_center = object.location
    distance = (cam_location - obj_center).length - object.dimensions.z / 2

    # Consider the margin
    width_with_margin = object.dimensions.x * (1 + margin)
    height_with_margin = object.dimensions.y * (1 + margin)

    # Calculate required FOVs for both width and height of the object
    fov_height = 2 * atan((height_with_margin / 2) / distance)
    fov_width = 2 * atan((width_with_margin / 2) / (distance *
                         bpy.context.scene.render.resolution_x / bpy.context.scene.render.resolution_y))

    # Use the larger of the two FOVs to ensure the object fits
    fov = max(fov_height, fov_width)

    return fov


def calc_ortho_camera_object_fit_scale(camera: bpy.types.Camera, object: bpy.types.Object, margin: float = 0.0):
    """
    Calculate the orthographic scale to fit the object in the camera view.
    Takes margin (%) as argument, e.g. 0.1 will add a 10% margin.
    """
    # Ensure the camera is orthographic

    if camera.data.type != 'ORTHO':
        raise ValueError("Camera must be orthographic")

    # Transform the bounding box to the camera's space
    matrix = camera.matrix_world.inverted() @ object.matrix_world
    bbox = [matrix @ Vector(corner) for corner in object.bound_box]

    # Get width and height of bounding box in camera space
    xs = [coord.x for coord in bbox]
    ys = [coord.y for coord in bbox]
    width = max(xs) - min(xs)
    height = max(ys) - min(ys)

    # Get camera's aspect ratio
    aspect_ratio = bpy.context.scene.render.resolution_x / \
        bpy.context.scene.render.resolution_y

    # Calculate the orthographic scale based on the bounding box's size
    if aspect_ratio >= 1:  # width >= height
        scale_value = max(width * aspect_ratio, height)
    else:
        scale_value = max(width, height / aspect_ratio)

    # Apply the margin to the scale value
    return scale_value * (1 + margin)
