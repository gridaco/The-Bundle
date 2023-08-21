# SPDX-License-Identifier: GPL-3.0-or-later
from pathlib import Path, PurePosixPath
from typing import TYPE_CHECKING, Optional, Union
import platform
import logging

import bpy

from .job_types_propgroup import JobTypePropertyGroup
from .bat.submodules import bpathlib
from . import preferences

if TYPE_CHECKING:
    from .manager import ApiClient as _ApiClient
    from .manager.models import (
        AvailableJobType as _AvailableJobType,
        Job as _Job,
        SubmittedJob as _SubmittedJob,
    )
else:
    _AvailableJobType = object
    _ApiClient = object
    _Job = object
    _SubmittedJob = object


# If a job has a setting with this key, type 'str', and subtype 'file_path',
# it'll be set to the path of the BAT-packed blend file.
BLENDFILE_SETTING_KEY = "blendfile"

log = logging.getLogger(__name__)


def job_for_scene(scene: bpy.types.Scene) -> Optional[_SubmittedJob]:
    from flamenco.manager.models import SubmittedJob, JobMetadata

    propgroup = getattr(scene, "flamenco_job_settings", None)
    assert isinstance(propgroup, JobTypePropertyGroup), "did not expect %s" % (
        type(propgroup)
    )

    settings = propgroup.as_jobsettings()
    metadata = JobMetadata()

    priority = getattr(scene, "flamenco_job_priority", 50)

    job: SubmittedJob = SubmittedJob(
        name=scene.flamenco_job_name,
        type=propgroup.job_type.name,
        priority=priority,
        settings=settings,
        metadata=metadata,
        submitter_platform=platform.system().lower(),
        type_etag=propgroup.job_type.etag,
    )

    worker_tag: str = getattr(scene, "flamenco_worker_tag", "")
    if worker_tag and worker_tag != "-":
        job.worker_tag = worker_tag

    return job


def set_blend_file(
    job_type: _AvailableJobType,
    job: _SubmittedJob,
    blendfile: Union[str, Path, PurePosixPath],
) -> None:
    """Update the job's 'blendfile' setting, if available.

    If a job has a 'blendfile' setting, type 'str', it'll be set to the path/URL
    of the BAT-packed blend file.
    """
    from .manager.models import AvailableJobSetting, AvailableJobSettingType

    expected_type = AvailableJobSettingType("string")
    for setting in job_type.settings:
        if setting.key == BLENDFILE_SETTING_KEY and setting.type == expected_type:
            break
    else:
        # Not having this setting is fine.
        return

    assert isinstance(setting, AvailableJobSetting)
    job.settings[BLENDFILE_SETTING_KEY] = str(blendfile)


def set_shaman_checkout_id(job: _SubmittedJob, checkout_id: PurePosixPath) -> None:
    from flamenco.manager.models import JobStorageInfo

    # The job.storage attribute doesn't even exist if it's not set.
    if getattr(job, "storage", None) is None:
        job.storage = JobStorageInfo()
    job.storage.shaman_checkout_id = checkout_id.as_posix()


def submit_job(job: _SubmittedJob, api_client: _ApiClient) -> _Job:
    """Send the given job to Flamenco Manager."""
    from flamenco.manager import ApiClient
    from flamenco.manager.api import jobs_api
    from flamenco.manager.models import SubmittedJob, Job

    assert isinstance(job, SubmittedJob), "got %s" % type(job)
    assert isinstance(api_client, ApiClient), "got %s" % type(api_client)

    job_api_instance = jobs_api.JobsApi(api_client)
    response: Job = job_api_instance.submit_job(job)
    print("Job submitted: %s (%s)" % (response.name, response.id))

    return response


def submit_job_check(job: _SubmittedJob, api_client: _ApiClient) -> None:
    """Check the given job at Flamenco Manager to see if it is acceptable."""
    from flamenco.manager import ApiClient
    from flamenco.manager.api import jobs_api
    from flamenco.manager.models import SubmittedJob, Job

    assert isinstance(job, SubmittedJob), "got %s" % type(job)
    assert isinstance(api_client, ApiClient), "got %s" % type(api_client)

    job_api_instance = jobs_api.JobsApi(api_client)
    job_api_instance.submit_job_check(job)


def is_file_inside_job_storage(context: bpy.types.Context, blendfile: Path) -> bool:
    """Check whether current blend file is inside the storage path.

    :return: True when the current blend file is inside the Flamenco job storage
        directory already. In this case it won't be BAT-packed, as it's assumed
        the job storage dir is accessible by the workers already.
    """

    blendfile = blendfile.absolute().resolve()

    prefs = preferences.get(context)
    job_storage = Path(prefs.job_storage).absolute().resolve()

    log.info("Checking whether the file is already inside the job storage")
    log.info("    file   : %s", blendfile)
    log.info("    storage: %s", job_storage)

    try:
        blendfile.relative_to(job_storage)
    except ValueError:
        return False
    return True
