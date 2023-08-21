# SPDX-License-Identifier: GPL-3.0-or-later

# <pep8 compliant>

import logging
import dataclasses
import platform
from typing import TYPE_CHECKING, Optional

from urllib3.exceptions import HTTPError, MaxRetryError
import bpy

_flamenco_client = None
_log = logging.getLogger(__name__)

if TYPE_CHECKING:
    from flamenco.manager import ApiClient as _ApiClient
    from flamenco.manager.models import (
        FlamencoVersion as _FlamencoVersion,
        SharedStorageLocation as _SharedStorageLocation,
    )
    from .preferences import FlamencoPreferences as _FlamencoPreferences
else:
    _ApiClient = object
    _FlamencoPreferences = object
    _FlamencoVersion = object
    _SharedStorageLocation = object


@dataclasses.dataclass(frozen=True)
class ManagerInfo:
    version: Optional[_FlamencoVersion] = None
    storage: Optional[_SharedStorageLocation] = None
    error: str = ""

    @classmethod
    def with_error(cls, error: str) -> "ManagerInfo":
        return cls(error=error)

    @classmethod
    def with_info(
        cls, version: _FlamencoVersion, storage: _SharedStorageLocation
    ) -> "ManagerInfo":
        return cls(version=version, storage=storage)


def flamenco_api_client(manager_url: str) -> _ApiClient:
    """Returns an API client for communicating with a Manager."""
    global _flamenco_client

    if _flamenco_client is not None:
        return _flamenco_client

    from . import dependencies

    dependencies.preload_modules()

    from . import manager

    configuration = manager.Configuration(host=manager_url.rstrip("/"))
    _flamenco_client = manager.ApiClient(configuration)
    _log.info("created API client for Manager at %s", manager_url)

    return _flamenco_client


def flamenco_client_version() -> str:
    """Return the version of the Flamenco OpenAPI client."""

    from . import dependencies

    dependencies.preload_modules()

    from . import manager

    return manager.__version__


def discard_flamenco_data():
    global _flamenco_client

    if _flamenco_client is None:
        return

    _log.info("closing Flamenco client")
    _flamenco_client.close()
    _flamenco_client = None


def ping_manager_with_report(
    window_manager: bpy.types.WindowManager,
    api_client: _ApiClient,
    prefs: _FlamencoPreferences,
) -> tuple[str, str]:
    """Ping the Manager, update preferences, and return a report as string.

    :returns: tuple (report, level). The report will be something like "<name>
        version <version> found", or an error message. The level will be
        'ERROR', 'WARNING', or 'INFO', suitable for reporting via
        `Operator.report()`.
    """

    info = ping_manager(window_manager, api_client, prefs)
    if info.error:
        return info.error, "ERROR"

    assert info.version is not None
    report = "%s version %s found" % (info.version.name, info.version.version)
    return report, "INFO"


def ping_manager(
    window_manager: bpy.types.WindowManager,
    api_client: _ApiClient,
    prefs: _FlamencoPreferences,
) -> ManagerInfo:
    """Fetch Manager config & version, and update cached preferences."""

    window_manager.flamenco_status_ping = "..."

    # Do a late import, so that the API is only imported when actually used.
    from flamenco.manager import ApiException
    from flamenco.manager.apis import MetaApi
    from flamenco.manager.models import FlamencoVersion, SharedStorageLocation

    meta_api = MetaApi(api_client)
    error = ""
    try:
        version: FlamencoVersion = meta_api.get_version()
        storage: SharedStorageLocation = meta_api.get_shared_storage(
            "users", platform.system().lower()
        )
    except ApiException as ex:
        error = "Manager cannot be reached: %s" % ex
    except MaxRetryError as ex:
        # This is the common error, when for example the port number is
        # incorrect and nothing is listening. The exception text is not included
        # because it's very long and confusing.
        error = "Manager cannot be reached"
    except HTTPError as ex:
        error = "Manager cannot be reached: %s" % ex

    if error:
        window_manager.flamenco_status_ping = error
        return ManagerInfo.with_error(error)

    # Store whether this Manager supports the Shaman API.
    prefs.is_shaman_enabled = storage.shaman_enabled
    prefs.job_storage = storage.location

    report = "%s version %s found" % (version.name, version.version)
    window_manager.flamenco_status_ping = report

    return ManagerInfo.with_info(version, storage)
