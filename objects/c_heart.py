import bpy
import math


def create_heart(name):
    verts = []
    faces = []

    # Loop through values of t to create the heart vertices
    for t in [i * math.pi / 180 for i in range(0, 360, 2)]:
        x = 16 * math.pow(math.sin(t), 3)
        y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * \
            math.cos(3 * t) - math.cos(4 * t)
        z = x / 4  # Giving it depth according to its width, adjust as necessary
        verts.append((x, y, z))

    # Create faces using the vertices
    for i in range(len(verts) - 1):
        faces.append((i, i + 1, len(verts) - 1))

    # Create new mesh and object
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)

    # Link the object to the scene
    bpy.context.collection.objects.link(obj)

    # Set the object's vertices and faces
    mesh.from_pydata(verts, [], faces)
    mesh.update()

    return obj


# Remove existing mesh with the name "Heart" to avoid conflicts
if "Heart" in bpy.data.objects:
    bpy.data.objects.remove(bpy.data.objects["Heart"])

# Call the function to create the heart
create_heart("Heart")
