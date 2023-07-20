import bpy
from mathutils import Vector
from math import tan, radians


def adjust_camera_to_fit_object(obj_name, margin_pct=10):
    # Get the object
    obj = bpy.context.scene.objects[obj_name]

    # Calculate the bounding box dimensions
    bb = [Vector(b) for b in obj.bound_box]
    bb_size = Vector((max(b[i] for b in bb) - min(b[i]
                     for b in bb) for i in range(3)))
    bb_center = Vector((sum(b[i] for b in bb)/8 for i in range(3)))

    # Calculate the scale factor based on the margin percentage
    scale_factor = 1 + margin_pct / 100

    # Get the camera
    cam = bpy.context.scene.camera

    # Calculate the distance from the camera to the object
    distance = max(bb_size) * scale_factor

    # Adjust the camera position
    cam.location = bb_center + \
        cam.matrix_world.to_quaternion() @ Vector((0.0, 0.0, distance))

    # Point the camera at the object
    direction = bb_center - cam.location
    # reset rotation
    cam.rotation_euler[0] = 0.0
    cam.rotation_euler[1] = 0.0
    cam.rotation_euler[2] = 0.0
    # point the camera to the direction
    cam.rotation_euler.rotate(direction.to_track_quat('-Z', 'Y'))

    # Adjust the camera's zoom and resolution
    aspect_ratio = bb_size.x / bb_size.y
    bpy.context.scene.render.resolution_x = 1080
    bpy.context.scene.render.resolution_y = int(1080 / aspect_ratio)

    # Adjust the camera's field of view (FOV)
    fov = 2 * atan(bb_size.y / (2 * distance))
    cam.data.angle = radians(fov)
