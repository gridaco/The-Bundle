import bpy


class PrincipledBSDFNodeModifier:
    node: bpy.types.ShaderNode
    ...

    def apply(self, base_color):
        """
        Applies the changes to the node.
        base_color: (r, g, b, a)
        """
        self.node.inputs['Base Color'].default_value = base_color
