import bpy
from ..type import RGBA


class LightModifier:
    """
    Light object modifier.
    Applicaple to all light types, including:
    - Point
    - Sun
    - Spot
    - Area
    """
    light: bpy.types.Light

    def __init__(self, light: bpy.types.Light):
        self.light = light

    def apply(self, data: dict):
        ...

    def apply_color(self, color: RGBA):
        self.light.color = color

    def apply_energy(self, strength: float):
        self.light.energy = strength
