# SPDX-License-Identifier: GPL-3.0-or-later

# <pep8 compliant>

bl_info = {
    "name": "Flamenco 3",
    "author": "Sybren A. Stüvel",
    "version": (3, 3),
    "blender": (3, 1, 0),
    "description": "Flamenco client for Blender.",
    "location": "Output Properties > Flamenco",
    "doc_url": "https://flamenco.blender.org/",
    "category": "System",
    "support": "COMMUNITY",
    "warning": "This is version 3.3-alpha0 of the add-on, which is not a stable release",
}

from pathlib import Path

__is_first_load = "operators" not in locals()
if __is_first_load:
    from . import (
        operators,
        gui,
        job_types,
        comms,
        preferences,
        projects,
        worker_tags,
    )
else:
    import importlib

    operators = importlib.reload(operators)
    gui = importlib.reload(gui)
    job_types = importlib.reload(job_types)
    comms = importlib.reload(comms)
    preferences = importlib.reload(preferences)
    projects = importlib.reload(projects)
    worker_tags = importlib.reload(worker_tags)

import bpy


@bpy.app.handlers.persistent
def discard_global_flamenco_data(_):
    job_types.discard_flamenco_data()
    comms.discard_flamenco_data()

    bpy.context.window_manager.flamenco_version_mismatch = False


def redraw(self, context):
    if context.area is None:
        return
    context.area.tag_redraw()


def _redraw_the_world(context):
    for window in context.window_manager.windows:
        for area in window.screen.areas:
            area.tag_redraw()


def _default_job_name() -> str:
    if not bpy.data.filepath:
        return ""
    return Path(bpy.data.filepath).stem


@bpy.app.handlers.persistent
def _set_flamenco_job_name(a, b):
    scene = bpy.context.scene
    if scene.flamenco_job_name:
        return
    scene.flamenco_job_name = _default_job_name()
    _redraw_the_world(bpy.context)


@bpy.app.handlers.persistent
def _unset_flamenco_job_name(a, b):
    scene = bpy.context.scene
    if scene.flamenco_job_name != _default_job_name():
        return
    scene.flamenco_job_name = ""


def register() -> None:
    from . import dependencies

    dependencies.preload_modules()

    bpy.app.handlers.load_pre.append(discard_global_flamenco_data)
    bpy.app.handlers.load_factory_preferences_post.append(discard_global_flamenco_data)

    bpy.app.handlers.load_post.append(_set_flamenco_job_name)
    bpy.app.handlers.save_pre.append(_unset_flamenco_job_name)
    bpy.app.handlers.save_post.append(_set_flamenco_job_name)

    bpy.types.WindowManager.flamenco_bat_status = bpy.props.EnumProperty(
        items=[
            ("IDLE", "IDLE", "Not doing anything."),
            ("SAVING", "SAVING", "Saving your file."),
            ("INVESTIGATING", "INVESTIGATING", "Finding all dependencies."),
            ("TRANSFERRING", "TRANSFERRING", "Transferring all dependencies."),
            ("COMMUNICATING", "COMMUNICATING", "Communicating with Flamenco Server."),
            ("DONE", "DONE", "Not doing anything, but doing something earlier."),
            ("ABORTING", "ABORTING", "User requested we stop doing something."),
            ("ABORTED", "ABORTED", "We stopped doing something."),
        ],
        name="flamenco_status",
        default="IDLE",
        description="Current status of the Flamenco add-on",
        update=redraw,
    )

    bpy.types.WindowManager.flamenco_bat_status_txt = bpy.props.StringProperty(
        name="Flamenco Status",
        default="",
        description="Textual description of what Flamenco is doing",
        update=redraw,
    )

    bpy.types.WindowManager.flamenco_bat_progress = bpy.props.IntProperty(
        name="Flamenco Progress",
        default=0,
        description="File transfer progress",
        subtype="PERCENTAGE",
        min=0,
        max=100,
        update=redraw,
    )
    bpy.types.WindowManager.flamenco_version_mismatch = bpy.props.BoolProperty(
        name="Flamenco Ignore Version Mismatch",
        default=False,
        description="Ignore version mismatch between add-on and Manager when submitting a job",
    )

    # Placeholder to contain the result of a 'ping' to Flamenco Manager,
    # so that it can be shown in the preferences panel.
    bpy.types.WindowManager.flamenco_status_ping = bpy.props.StringProperty()

    bpy.types.Scene.flamenco_job_name = bpy.props.StringProperty(
        name="Flamenco Job Name",
        default="",
        description="Name of the Flamenco job; an empty name will use the blend file name as job name",
    )

    bpy.types.Scene.flamenco_job_priority = bpy.props.IntProperty(
        name="Flamenco Job Priority",
        description="Priority of the render jobs; higher numbers will get higher priority",
        default=50,
        min=0,
        max=100,
    )

    preferences.register()
    worker_tags.register()
    operators.register()
    gui.register()
    job_types.register()


def unregister() -> None:
    discard_global_flamenco_data(None)
    bpy.app.handlers.load_pre.remove(discard_global_flamenco_data)
    bpy.app.handlers.load_factory_preferences_post.remove(discard_global_flamenco_data)

    bpy.app.handlers.load_post.remove(_set_flamenco_job_name)
    bpy.app.handlers.save_pre.remove(_unset_flamenco_job_name)
    bpy.app.handlers.save_post.remove(_set_flamenco_job_name)

    job_types.unregister()
    gui.unregister()
    operators.unregister()
    worker_tags.unregister()
    preferences.unregister()
