import bpy


def change_base_color_principled_bsdf(identifier, color):
    """
    Changes the base color property of a certain principled bsdf material.
    You can either pass the material name or the material object.
    """
    ...


class MaterialModifier:
    material: bpy.types.Material

    def __init__(self, identifier: str | bpy.types.Material):
        # locate the material via identifier
        # identifier can either be the name of the material or the material object itself

        if isinstance(identifier, str):
            self.material = bpy.data.materials[identifier]
        elif isinstance(identifier, bpy.types.Material):
            self.material = identifier

    def qnode(self, node_type=None, node_name=None, many=False):
        """
        Queries a (shader) node from the material. by name or type.
        Either node_type or node_name must be specified.

        Note: bpy does not ensure which node is returned if there are multiple nodes with the same name.

        To use this in the template, make sure that the material have each unique node names.
        """
        assert node_type or node_name, "Either node_type or node_name must be specified."
        assert many, "many=True is not yet implemented."

        if node_name:
            return self.material.node_tree.nodes.get(node_name)

        if node_type:
            for node in self.material.node_tree.nodes:
                if node.type == node_type:
                    return node

        return None
