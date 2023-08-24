import bpy
import math


def create_hemihelix(name, length, radius, turns, resolution, height=None):
    # Clear existing mesh with the name
    if name in bpy.data.meshes:
        bpy.data.meshes.remove(bpy.data.meshes[name])

    # Calculate number of vertices needed
    num_verts = resolution * turns

    verts = []
    edges = []

    # Generate vertices and edges based on the height value
    if height and height != 0:
        for i in range(num_verts):
            t = i / resolution
            x = radius * math.cos(t)
            y = radius * math.sin(t)
            z_bottom = length * t / turns
            z_top = z_bottom + height
            verts.append((x, y, z_bottom))
            verts.append((x, y, z_top))

        edges = [(i, i+1)
                 for i in range(0, 2*num_verts-2, 2)]  # Vertical edges
        # Bottom horizontal edges
        edges += [(i, i+2) for i in range(0, 2*num_verts-2, 2)]
        edges += [(i+1, i+3)
                  for i in range(0, 2*num_verts-2, 2)]  # Top horizontal edges
    else:
        for i in range(num_verts):
            t = i / resolution
            x = radius * math.cos(t)
            y = radius * math.sin(t)
            z = length * t / turns
            verts.append((x, y, z))

        edges = [(i, i+1) for i in range(num_verts-1)]

    # Create new mesh and link it to the scene
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, edges, [])
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)


if __name__ == "__main__":
    # Clear mesh objects in the scene
    bpy.ops.object.select_all(action='DESELECT')
    bpy.ops.object.select_by_type(type='MESH')
    bpy.ops.object.delete()

    # Examples
    create_hemihelix("Hemihelix_Surface", 5, 1, 10, 100, 0.2)
    create_hemihelix("Hemihelix_Line", 5, 1, 10, 100)
