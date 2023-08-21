from .a_cylinder import cylinder


def prism(verticies, radius, depth, name='prism'):
    """
    Create a prism with the specified parameters.
    :param verticies: number of verticies
    :param radius: radius of the prism
    :param depth: height of the prism
    :param name: name of the prism
    :return: prism
    """
    return cylinder(verticies=verticies, radius=radius, depth=depth, name=name)


def populate():
    ...
