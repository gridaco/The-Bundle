import bpy


class PrincipledBSDFNodeModifier:
    node: bpy.types.ShaderNode
    ...

    def apply(self, data: dict):
        """
        Applies the changes to the node.
        E.g.
        ```
        {
          "base_color": (r, g, b, a)
        }
        ```
        """
        keys = [
            "Base Color",
            "Subsurface",
            "Subsurface Radius",
            "Subsurface Color",
            "Metallic",
            "Specular",
            "Specular Tint",
            "Roughness",
            "Anisotropic",
            "Anisotropic Rotation",
            "Sheen",
            "Sheen Tint",
            "Clearcoat",
            "Clearcoat Roughness",
            "IOR",
            "Transmission",
            "Transmission Roughness",
            "Emission",
            "Alpha",
            "Normal"
        ]

        for k in keys:
            v = data.get(k, None)
            if v:
                try:
                    self.node.inputs[k].default_value = v
                except KeyError:
                    print(f"WARNING: {k} is not found in the node inputs.")
                    continue
                except Exception as e:
                    print(f"ERROR: {e}")
                    continue
