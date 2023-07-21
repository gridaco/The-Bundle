import bpy


def is_transparent_render_enabled():
    """
    check if transparent render is enabled
    """
    return bpy.context.scene.render.film_transparent
