# SPDX-License-Identifier: GPL-3.0-or-later
# <pep8 compliant>

from pathlib import Path

import bpy

from . import projects


def discard_flamenco_client(context):
    """Discard any cached Flamenco client after the Manager URL changes."""
    from . import comms

    comms.discard_flamenco_data()
    context.window_manager.flamenco_status_ping = ""


def _refresh_the_planet(
    prefs: "FlamencoPreferences", context: bpy.types.Context
) -> None:
    """Refresh all GUI areas."""
    for win in context.window_manager.windows:
        for area in win.screen.areas:
            for region in area.regions:
                region.tag_redraw()


def _manager_url_updated(prefs, context):
    discard_flamenco_client(context)

    from . import comms

    api_client = comms.flamenco_api_client(prefs.manager_url)

    # Warning, be careful what of the context to access here. Accessing /
    # changing too much can cause crashes, infinite loops, etc.
    comms.ping_manager_with_report(context.window_manager, api_client, prefs)


_project_finder_enum_items = [
    (key, info.label, info.description) for key, info in projects.finders.items()
]


class WorkerTag(bpy.types.PropertyGroup):
    id: bpy.props.StringProperty(name="id")  # type: ignore
    name: bpy.props.StringProperty(name="Name")  # type: ignore
    description: bpy.props.StringProperty(name="Description")  # type: ignore


class FlamencoPreferences(bpy.types.AddonPreferences):
    bl_idname = "flamenco"

    manager_url: bpy.props.StringProperty(  # type: ignore
        name="Manager URL",
        description="Location of the Manager",
        default="http://localhost:8080/",
        update=_manager_url_updated,
    )

    project_finder: bpy.props.EnumProperty(  # type: ignore
        name="Project Finder",
        description="Strategy for Flamenco to find the top level directory of your project",
        default=_project_finder_enum_items[0][0],
        items=_project_finder_enum_items,
    )

    is_shaman_enabled: bpy.props.BoolProperty(  # type: ignore
        name="Shaman Enabled",
        description="Whether this Manager has the Shaman protocol enabled",
        default=False,
        update=_refresh_the_planet,
    )

    # Property that should be editable from Python. It's not exposed to the GUI.
    job_storage: bpy.props.StringProperty(  # type: ignore
        name="Job Storage Directory",
        subtype="DIR_PATH",
        default="",
        options={"HIDDEN"},
        description="Directory where blend files are stored when submitting them to Flamenco. This value is determined by Flamenco Manager",
    )

    # Property that gets its value from the above _job_storage, and cannot be
    # set. This makes it read-only in the GUI.
    job_storage_for_gui: bpy.props.StringProperty(  # type: ignore
        name="Job Storage Directory",
        subtype="DIR_PATH",
        default="",
        options={"SKIP_SAVE"},
        description="Directory where blend files are stored when submitting them to Flamenco. This value is determined by Flamenco Manager",
        get=lambda prefs: prefs.job_storage,
    )

    worker_tags: bpy.props.CollectionProperty(  # type: ignore
        type=WorkerTag,
        name="Worker Tags",
        description="Cache for the worker tags available on the configured Manager",
        options={"HIDDEN"},
    )

    def draw(self, context: bpy.types.Context) -> None:
        layout = self.layout
        layout.use_property_decorate = False
        layout.use_property_split = True

        col = layout.column()

        row = col.row(align=True)
        row.prop(self, "manager_url")
        row.operator("flamenco.ping_manager", text="", icon="FILE_REFRESH")

        def text_row(parent, label):
            split = parent.split(factor=0.4)
            split.label(text="")
            split.label(text=label)

        if not self.job_storage:
            text_row(col, "Press the refresh button before using Flamenco")

        if context.window_manager.flamenco_status_ping:
            text_row(col, context.window_manager.flamenco_status_ping)
        else:
            aligned = col.column(align=True)
            text_row(aligned, "Press the refresh button to check the connection")
            text_row(aligned, "and update the job storage location")

        if self.is_shaman_enabled:
            text_row(col, "Shaman enabled")
        col.prop(self, "job_storage_for_gui", text="Job Storage")

        # Project Root
        col = layout.column(align=True)
        col.prop(self, "project_finder")
        try:
            project_root = self.project_root()
        except ValueError:
            pass
        else:
            text_row(col, str(project_root))

    def project_root(self) -> Path:
        """Use the configured project finder to find the project root directory."""

        if not self.project_finder:
            # Just a sanity fallback for missing preferences. It should be
            # covered by the 'default=...' of the property, but just to be sure.
            self.project_finder = "BLENDER_PROJECT"

        # It is assumed that the blendfile is saved.
        blendfile = Path(bpy.data.filepath)
        return projects.for_blendfile(blendfile, self.project_finder)


def get(context: bpy.types.Context) -> FlamencoPreferences:
    """Return the add-on preferences."""
    prefs = context.preferences.addons["flamenco"].preferences
    assert isinstance(
        prefs, FlamencoPreferences
    ), "Expected FlamencoPreferences, got %s instead" % (type(prefs))
    return prefs


def manager_url(context: bpy.types.Context) -> str:
    """Returns the configured Manager URL."""
    prefs = get(context)
    return str(prefs.manager_url)


classes = (
    WorkerTag,
    FlamencoPreferences,
)
_register, _unregister = bpy.utils.register_classes_factory(classes)


def register():
    _register()
    bpy.context.window_manager.flamenco_status_ping = ""


def unregister():
    _unregister()
