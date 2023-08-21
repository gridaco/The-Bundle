# SPDX-License-Identifier: GPL-3.0-or-later
# <pep8 compliant>

from typing import Optional, TYPE_CHECKING

from . import preferences, job_types
from .job_types_propgroup import JobTypePropertyGroup

import bpy

if TYPE_CHECKING:
    from flamenco.manager.models import (
        AvailableJobSetting as _AvailableJobSetting,
        SubmittedJob as _SubmittedJob,
    )
else:
    _AvailableJobSetting = object
    _SubmittedJob = object


class FLAMENCO_PT_job_submission(bpy.types.Panel):
    bl_space_type = "PROPERTIES"
    bl_region_type = "WINDOW"
    bl_context = "output"
    bl_label = "Flamenco 3"

    # A temporary job can be constructed so that dynamic, read-only properties can be evaluated.
    # This is only scoped to a single draw() call.
    job: Optional[_SubmittedJob] = None

    def draw(self, context: bpy.types.Context) -> None:
        from . import job_types

        prefs = preferences.get(context)

        layout = self.layout
        layout.use_property_decorate = False
        layout.use_property_split = True

        layout.separator()

        col = layout.column(align=True)
        col.prop(context.scene, "flamenco_job_name", text="Job Name")
        col.prop(context.scene, "flamenco_job_priority", text="Priority")

        # Worker tag:
        row = col.row(align=True)
        row.prop(context.scene, "flamenco_worker_tag", text="Tag")
        row.operator("flamenco.fetch_worker_tags", text="", icon="FILE_REFRESH")

        layout.separator()

        col = layout.column()
        if not job_types.are_job_types_available():
            col.operator("flamenco.fetch_job_types", icon="FILE_REFRESH")
            return

        row = col.row(align=True)
        row.prop(context.scene, "flamenco_job_type", text="")
        row.operator("flamenco.fetch_job_types", text="", icon="FILE_REFRESH")

        self.draw_job_settings(context, layout.column(align=True))

        layout.separator()

        self.draw_flamenco_status(context, layout)

        self.job = None

    def draw_job_settings(
        self, context: bpy.types.Context, layout: bpy.types.UILayout
    ) -> None:
        from . import job_types

        job_type = job_types.active_job_type(context.scene)
        if job_type is None:
            return

        propgroup = getattr(context.scene, "flamenco_job_settings", None)
        if propgroup is None:
            return

        layout.use_property_split = True
        for setting in job_type.settings:
            self.draw_setting(context, layout, propgroup, setting)

    def draw_setting(
        self,
        context: bpy.types.Context,
        layout: bpy.types.UILayout,
        propgroup: JobTypePropertyGroup,
        setting: _AvailableJobSetting,
    ) -> None:
        if not job_types.setting_is_visible(setting):
            return

        row = layout.row(align=True)

        if setting.get("editable", True):
            if job_types.show_eval_on_submit_button(setting):
                self.draw_setting_autoeval(row, propgroup, setting)
            else:
                self.draw_setting_editable(row, propgroup, setting)
        else:
            self.draw_setting_readonly(context, row, propgroup, setting)

        if str(setting.type) == "string" and str(setting.get("subtype", "")) in {
            "dir_path",
            "file_path",
            "hashed_file_path",
        }:
            op = row.operator("flamenco3.explore_file_path", text="", icon="WINDOW")
            op.path = getattr(propgroup, setting.key)

    def draw_setting_editable(
        self,
        layout: bpy.types.UILayout,
        propgroup: JobTypePropertyGroup,
        setting: _AvailableJobSetting,
    ) -> None:
        layout.prop(propgroup, setting.key)
        setting_eval = setting.get("eval", "")
        if not setting_eval:
            return

        props = layout.operator("flamenco.eval_setting", text="", icon="SCRIPTPLUGINS")
        props.setting_key = setting.key
        props.setting_eval = setting_eval
        props.eval_description = job_types.eval_description(setting)

    def draw_setting_readonly(
        self,
        context: bpy.types.Context,
        layout: bpy.types.UILayout,
        propgroup: JobTypePropertyGroup,
        setting: _AvailableJobSetting,
    ) -> None:
        layout.prop(propgroup, setting.key)

    def draw_setting_autoeval(
        self,
        layout: bpy.types.UILayout,
        propgroup: JobTypePropertyGroup,
        setting: _AvailableJobSetting,
    ) -> None:
        autoeval_enabled = job_types.setting_should_autoeval(propgroup, setting)
        if autoeval_enabled:
            # Mypy doesn't know the bl_rna attribute exists.
            label = propgroup.bl_rna.properties[setting.key].name  # type: ignore

            split = layout.split(factor=0.4, align=True)
            split.alignment = "RIGHT"
            split.label(text=label)

            row = split.row(align=True)
            row.label(text=getattr(setting.eval_info, "description") or "")
            row.prop(
                propgroup,
                job_types.setting_autoeval_propname(setting),
                text="",
                icon="LINKED",
            )
        else:
            self.draw_setting_editable(layout, propgroup, setting)
            layout.prop(
                propgroup,
                job_types.setting_autoeval_propname(setting),
                text="",
                icon="UNLINKED",
            )

    def draw_flamenco_status(
        self, context: bpy.types.Context, layout: bpy.types.UILayout
    ) -> None:
        # Show current status of Flamenco.
        flamenco_status = context.window_manager.flamenco_bat_status
        if flamenco_status in {"IDLE", "ABORTED", "DONE"}:
            self.draw_submit_button(context, layout)
        elif flamenco_status == "INVESTIGATING":
            row = layout.row(align=True)
            row.label(text="Investigating your files")
            # row.operator(FLAMENCO_OT_abort.bl_idname, text="", icon="CANCEL")
        elif flamenco_status == "COMMUNICATING":
            layout.label(text="Communicating with Flamenco Server")
        elif flamenco_status == "ABORTING":
            row = layout.row(align=True)
            row.label(text="Aborting, please wait.")
            # row.operator(FLAMENCO_OT_abort.bl_idname, text="", icon="CANCEL")
        if flamenco_status == "TRANSFERRING":
            row = layout.row(align=True)
            row.prop(
                context.window_manager,
                "flamenco_bat_progress",
                text=context.window_manager.flamenco_bat_status_txt,
            )
            # row.operator(FLAMENCO_OT_abort.bl_idname, text="", icon="CANCEL")
        elif (
            flamenco_status != "IDLE" and context.window_manager.flamenco_bat_status_txt
        ):
            layout.label(text=context.window_manager.flamenco_bat_status_txt)

    def draw_submit_button(
        self, context: bpy.types.Context, layout: bpy.types.UILayout
    ) -> None:
        row = layout.row(align=True)

        props = row.operator(
            "flamenco.submit_job",
            text="Submit to Flamenco",
            icon="RENDER_ANIMATION",
        )
        props.job_name = context.scene.flamenco_job_name
        props.ignore_version_mismatch = False

        if context.window_manager.flamenco_version_mismatch:
            props = row.operator(
                "flamenco.submit_job",
                text="Force Submit",
                icon="NONE",
            )
            props.job_name = context.scene.flamenco_job_name
            props.ignore_version_mismatch = True


classes = (FLAMENCO_PT_job_submission,)
register, unregister = bpy.utils.register_classes_factory(classes)
