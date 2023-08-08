import bpy


class ShaderNodeModifier:
    node: bpy.types.ShaderNode

    def __init__(self, node: bpy.types.ShaderNode):
        self.node = node
