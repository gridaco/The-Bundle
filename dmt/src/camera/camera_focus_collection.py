import bpy
from math import atan
from mathutils import Vector


def collection_bounding_box(collection):
    bbox_corners = []

    for obj in collection.objects:
        # Get the bounding box corners in world space
        obj_bbox = [obj.matrix_world @
                    Vector(corner) for corner in obj.bound_box]
        bbox_corners.extend(obj_bbox)

    return bbox_corners


def fit_camera_to_collection(camera, target_collection, margin: float = 0.0, zoom_in: bool = False, zoom_out: bool = True):
    # Calculate the bounding box of the collection
    bbox_corners = collection_bounding_box(target_collection)

    if camera.data.type == 'ORTHO':
        initial = camera.data.ortho_scale
        scale = calc_ortho_camera_bbox_fit_scale(camera, bbox_corners, margin)
        if (zoom_in and scale < initial) or (zoom_out and scale > initial):
            camera.data.ortho_scale = scale

    elif camera.data.type == 'PERSP':
        initial = camera.data.angle
        fov = calc_persp_camera_bbox_fit_fov(camera, bbox_corners, margin)
        if (zoom_in and fov < initial) or (zoom_out and fov > initial):
            camera.data.angle = fov

    elif camera.data.type == 'PANO':
        # Handle panorama camera type, if needed
        pass
    else:
        raise ValueError("Camera must be orthographic or perspective")


def calc_persp_camera_bbox_fit_fov(camera, bbox_corners, margin=0.0):
    # Find the center of the bounding box
    center = sum(bbox_corners, Vector()) / 8
    cam_location = camera.matrix_world.translation
    distance = (cam_location - center).length

    # Get the bbox dimensions
    xs = [coord.x for coord in bbox_corners]
    ys = [coord.y for coord in bbox_corners]
    zs = [coord.z for coord in bbox_corners]
    width = max(xs) - min(xs)
    height = max(ys) - min(ys)
    depth = max(zs) - min(zs)
    distance -= depth / 2  # Account for the depth

    width_with_margin = width * (1 + margin)
    height_with_margin = height * (1 + margin)
    fov_height = 2 * atan((height_with_margin / 2) / distance)
    fov_width = 2 * atan((width_with_margin / 2) / (distance *
                         bpy.context.scene.render.resolution_x / bpy.context.scene.render.resolution_y))
    fov = max(fov_height, fov_width)

    return fov


def calc_ortho_camera_bbox_fit_scale(camera, bbox_corners, margin=0.0):
    xs = [coord.x for coord in bbox_corners]
    ys = [coord.y for coord in bbox_corners]
    width = max(xs) - min(xs)
    height = max(ys) - min(ys)

    aspect_ratio = bpy.context.scene.render.resolution_x / \
        bpy.context.scene.render.resolution_y
    if aspect_ratio >= 1:
        scale_value = max(width * aspect_ratio, height)
    else:
        scale_value = max(width, height / aspect_ratio)

    return scale_value * (1 + margin)
