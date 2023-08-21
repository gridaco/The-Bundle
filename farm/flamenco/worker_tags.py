# SPDX-License-Identifier: GPL-3.0-or-later

from typing import TYPE_CHECKING, Union

import bpy

from . import preferences

if TYPE_CHECKING:
    from flamenco.manager import ApiClient as _ApiClient
else:
    _ApiClient = object


_enum_items: list[Union[tuple[str, str, str], tuple[str, str, str, int, int]]] = []


def refresh(context: bpy.types.Context, api_client: _ApiClient) -> None:
    """Fetch the available worker tags from the Manager."""
    from flamenco.manager import ApiClient
    from flamenco.manager.api import worker_mgt_api
    from flamenco.manager.model.worker_tag_list import WorkerTagList

    assert isinstance(api_client, ApiClient)

    api = worker_mgt_api.WorkerMgtApi(api_client)
    response: WorkerTagList = api.fetch_worker_tags()

    # Store on the preferences, so a cached version persists until the next refresh.
    prefs = preferences.get(context)
    prefs.worker_tags.clear()

    for tag in response.tags:
        rna_tag = prefs.worker_tags.add()
        rna_tag.id = tag.id
        rna_tag.name = tag.name
        rna_tag.description = getattr(tag, "description", "")

    # Preferences have changed, so make sure that Blender saves them (assuming
    # auto-save here).
    context.preferences.is_dirty = True


def _get_enum_items(self, context):
    global _enum_items
    prefs = preferences.get(context)

    _enum_items = [
        ("-", "All", "No specific tag assigned, any worker can handle this job"),
    ]
    _enum_items.extend(
        (tag.id, tag.name, tag.description)
        for tag in prefs.worker_tags
    )
    return _enum_items


def register() -> None:
    bpy.types.Scene.flamenco_worker_tag = bpy.props.EnumProperty(
        name="Worker Tag",
        items=_get_enum_items,
        description="The set of Workers that can handle tasks of this job",
    )


def unregister() -> None:
    to_del = ((bpy.types.Scene, "flamenco_worker_tag"),)
    for ob, attr in to_del:
        try:
            delattr(ob, attr)
        except AttributeError:
            pass


if __name__ == "__main__":
    import doctest

    print(doctest.testmod())
