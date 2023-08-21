# SPDX-License-Identifier: GPL-3.0-or-later

import json
import logging
from typing import TYPE_CHECKING, Optional, Union

import bpy

from . import job_types_propgroup

_log = logging.getLogger(__name__)

if TYPE_CHECKING:
    from flamenco.manager import ApiClient as _ApiClient
    from flamenco.manager.models import (
        AvailableJobSetting as _AvailableJobSetting,
        AvailableJobType as _AvailableJobType,
        AvailableJobTypes as _AvailableJobTypes,
        SubmittedJob as _SubmittedJob,
        JobSettings as _JobSettings,
    )
else:
    _ApiClient = object
    _AvailableJobSetting = object
    _AvailableJobType = object
    _AvailableJobTypes = object
    _JobSettings = object
    _SubmittedJob = object

_available_job_types: Optional[list[_AvailableJobType]] = None

# Items for a bpy.props.EnumProperty()
_job_type_enum_items: list[
    Union[tuple[str, str, str], tuple[str, str, str, int, int]]
] = []

_selected_job_type_propgroup: Optional[
    type[job_types_propgroup.JobTypePropertyGroup]
] = None


def fetch_available_job_types(api_client: _ApiClient, scene: bpy.types.Scene) -> None:
    from flamenco.manager import ApiClient
    from flamenco.manager.api import jobs_api
    from flamenco.manager.model.available_job_types import AvailableJobTypes

    assert isinstance(api_client, ApiClient)

    job_api_instance = jobs_api.JobsApi(api_client)
    response: AvailableJobTypes = job_api_instance.get_job_types()

    _clear_available_job_types(scene)

    # Store the response JSON on the scene. This is used when the blend file is
    # loaded (and thus the _available_job_types global variable is still empty)
    # to generate the PropertyGroup of the selected job type.
    scene.flamenco_available_job_types_json = json.dumps(response.to_dict())

    _store_available_job_types(response)


def setting_is_visible(setting: _AvailableJobSetting) -> bool:
    try:
        visibility = setting.visible
    except AttributeError:
        # The default is 'visible'.
        return True
    return str(visibility) in {"visible", "submission"}


def setting_should_autoeval(
    propgroup: job_types_propgroup.JobTypePropertyGroup,
    setting: _AvailableJobSetting,
) -> bool:
    if not setting_is_visible(setting):
        # Invisible settings are there purely to be auto-evaluated.
        return True

    propname = setting_autoeval_propname(setting)
    return getattr(propgroup, propname, False)


def show_eval_on_submit_button(setting: _AvailableJobSetting) -> bool:
    """Return whether this setting should show the 'eval on submit' toggle button."""

    eval_info = setting.get("eval_info", None)
    if not eval_info:
        return False

    show_button: bool = eval_info.get("show_link_button", False)
    return show_button


def eval_description(setting: _AvailableJobSetting) -> str:
    """Return the 'eval description' of this setting, or an empty string if not found."""

    eval_info = setting.get("eval_info", None)
    if not eval_info:
        return ""

    description: str = eval_info.get("description", "")
    return description


def setting_autoeval_propname(setting: _AvailableJobSetting) -> str:
    """Return the property name of the 'auto-eval' state for this setting."""
    return f"autoeval_{setting.key}"


def _store_available_job_types(available_job_types: _AvailableJobTypes) -> None:
    global _available_job_types
    global _job_type_enum_items

    job_types = available_job_types.job_types

    # Remember the available job types.
    _available_job_types = job_types
    if _available_job_types is None:
        _job_type_enum_items = []
    else:
        # Convert from API response type to list suitable for an EnumProperty.
        _job_type_enum_items = [
            (job_type.name, job_type.label, "") for job_type in job_types
        ]
    _job_type_enum_items.insert(0, ("", "Select a Job Type", "", 0, 0))


def _available_job_types_from_json(job_types_json: str) -> None:
    """Convert JSON to AvailableJobTypes object, and update global variables for it."""
    from flamenco.manager.models import AvailableJobTypes
    from flamenco.manager.configuration import Configuration
    from flamenco.manager.model_utils import validate_and_convert_types

    json_dict = json.loads(job_types_json)

    dummy_cfg = Configuration()

    try:
        job_types = validate_and_convert_types(
            json_dict, (AvailableJobTypes,), ["job_types"], True, True, dummy_cfg
        )
    except TypeError:
        _log.warn(
            "Flamenco: could not restore cached job types, refresh them from Flamenco Manager"
        )
        _store_available_job_types(AvailableJobTypes(job_types=[]))
        return

    assert isinstance(
        job_types, AvailableJobTypes
    ), "expected AvailableJobTypes, got %s" % type(job_types)
    _store_available_job_types(job_types)


def are_job_types_available() -> bool:
    """Returns whether job types have been fetched and are available."""
    return bool(_job_type_enum_items)


def _update_job_type(scene: bpy.types.Scene, context: bpy.types.Context) -> None:
    """Called whenever the selected job type changes."""
    update_job_type_properties(scene)


def update_job_type_properties(scene: bpy.types.Scene) -> None:
    """(Re)construct the PropertyGroup for the currently selected job type."""

    global _selected_job_type_propgroup

    from flamenco.manager.model.available_job_type import AvailableJobType

    job_type = active_job_type(scene)
    _clear_job_type_propgroup()

    if job_type is None:
        return

    assert isinstance(job_type, AvailableJobType), "did not expect type %r" % type(
        job_type
    )

    pg = job_types_propgroup.generate(job_type)
    pg.register_property_group()
    _selected_job_type_propgroup = pg

    bpy.types.Scene.flamenco_job_settings = bpy.props.PointerProperty(
        type=pg,
        name="Job Settings",
        description="Parameters for the Flamenco job",
    )

    scene.flamenco_job_settings.eval_visible_settings_if_no_value(bpy.context)


def _clear_available_job_types(scene: bpy.types.Scene) -> None:
    global _available_job_types
    global _job_type_enum_items

    _clear_job_type_propgroup()

    _available_job_types = None
    _job_type_enum_items.clear()
    scene.flamenco_available_job_types_json = ""


def _clear_job_type_propgroup() -> None:
    global _selected_job_type_propgroup

    try:
        del bpy.types.Scene.flamenco_job_settings
    except AttributeError:
        pass

    # Make sure there is no old property group reference.
    if _selected_job_type_propgroup is not None:
        _selected_job_type_propgroup.unregister_property_group()
        _selected_job_type_propgroup = None


def active_job_type(scene: bpy.types.Scene) -> Optional[_AvailableJobType]:
    """Return the active job type.

    Returns a flamenco.manager.model.available_job_type.AvailableJobType,
    or None if there is none.
    """
    if _available_job_types is None:
        return None

    job_type_name = scene.flamenco_job_type
    for job_type in _available_job_types:
        if job_type.name == job_type_name:
            return job_type
    return None


def _get_job_types_enum_items(dummy1, dummy2):
    return _job_type_enum_items


@bpy.app.handlers.persistent
def restore_available_job_types(dummy1, dummy2):
    scene = bpy.context.scene
    job_types_json = getattr(scene, "flamenco_available_job_types_json", "")
    if not job_types_json:
        _clear_available_job_types(scene)
        return
    _available_job_types_from_json(job_types_json)
    update_job_type_properties(scene)


def discard_flamenco_data():
    if _available_job_types:
        _available_job_types.clear()
    if _job_type_enum_items:
        _job_type_enum_items.clear()


def register() -> None:
    bpy.types.Scene.flamenco_job_type = bpy.props.EnumProperty(
        name="Job Type",
        items=_get_job_types_enum_items,
        update=_update_job_type,
    )

    bpy.types.Scene.flamenco_available_job_types_json = bpy.props.StringProperty(
        name="Available Job Types, stored as JSON string",
    )

    bpy.app.handlers.load_factory_startup_post.append(restore_available_job_types)
    bpy.app.handlers.load_post.append(restore_available_job_types)


def unregister() -> None:
    to_del = (
        (bpy.types.Scene, "flamenco_job_type"),
        (bpy.types.Scene, "flamenco_job_settings"),
        (bpy.types.Scene, "flamenco_available_job_types_json"),
    )
    for ob, attr in to_del:
        try:
            delattr(ob, attr)
        except AttributeError:
            pass


if __name__ == "__main__":
    import doctest

    print(doctest.testmod())
