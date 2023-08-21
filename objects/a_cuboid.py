import bpy


def cuboid(x, y, z, name='cuboid'):
    """
    Create a cuboid with the specified parameters.
    :param x: length along x-axis
    :param y: length along y-axis
    :param z: length along z-axis
    :return: cuboid
    """
    bpy.ops.mesh.primitive_cube_add(
        size=1,
        enter_editmode=False,
        align='WORLD',
        location=(0, 0, 0),
        rotation=(0, 0, 0),
        scale=(x, y, z)
    )

    bpy.context.object.name = name

    return bpy.data.objects[bpy.context.object.name]


def populate():
    # populate the scenes with cuboids
    # the cuboid with same x:y:z ratio is considered a same cuboid
    # while populating, we will remove the duplicates, that can be rendered identical with scale or rotation.
    ...
