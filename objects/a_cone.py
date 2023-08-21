import bpy


def cone(verticies=128, r1=1, r2=0, depth=2, name='cone'):
    """
    Create a cone with the specified parameters.
    :param r1: radius of the base
    :param r2: radius of the top
    :param depth: height of the cone
    :param verticies: number of verticies
    :param name: name of the cone
    :return: cone
    """
    bpy.ops.mesh.primitive_cone_add(
        vertices=verticies,
        radius1=r1,
        radius2=r2,
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
    # populate the scenes with cones
    # - fixed attributes = [r1]
    # - stepped attributes = [r2, depth, verticies]
    m = 2
    opt_r2 = [(0, None), (m / 100, f'r2={m / 100}', 'fillet')]
    opt_depth = [
        (m, f'z-r:{1}'),
        (m / 2, f'z-r:{2}')
        (m / 10, f'z-r:{10}')
    ]
    opt_verticies = [
        (32, '32-gon'),
        (128, '128-gon'),
        (1024, '1024-gon')
    ]
    ...


if __name__ == "__main__":
    pass
