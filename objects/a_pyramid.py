from .a_cone import cone


def pyramid(verticies, r1=1, r2=0, depth=1, name='pyramid'):
    """
    Create a pyramid with the specified parameters.
    :param r1: radius of the base
    :param r2: radius of the top
    :param depth: height of the pyramid
    :param verticies: number of verticies
    :param name: name of the pyramid
    :return: pyramid
    """
    return cone(verticies=verticies, r1=r1, r2=r2, depth=depth, name=name)


def populate():
    # populate the scenes with pyramids
    # since pyramids are cones n vertices, we can reuse the cone function
    m = 2
    opt_r2 = [(0, None), (m / 100, f'r2={m / 100}', 'fillet')]
    opt_depth = [
        (m, f'z-r:{1}'),
        (m / 2, f'z-r:{2}')
    ]
    opt_verticies = [
        (3, 'triangular', 'tetrahedron'),
        (4, 'quadrilateral'),
        (5, 'pentagonal'),
        (5, 'pentagonal'),
    ]


if __name__ == "__main__":
    pass
