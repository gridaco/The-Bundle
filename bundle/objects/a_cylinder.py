import bpy


def cylinder(verticies=128, radius=1, depth=2, name='cylinder'):
    """
    Create a cylinder with the specified parameters.
    :param verticies: number of verticies
    :param radius: radius of the cylinder
    :param depth: height of the cylinder
    :param name: name of the cylinder
    :return: cylinder
    """
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=verticies,
        radius=radius,
        depth=depth,
        enter_editmode=False,
        align='WORLD',
        location=(0, 0, 0),
        rotation=(0, 0, 0),
        scale=(1, 1, 1)
    )

    bpy.context.object.name = name

    return bpy.data.objects[bpy.context.object.name]


def populate():
    ...
