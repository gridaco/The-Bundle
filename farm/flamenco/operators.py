# SPDX-License-Identifier: GPL-3.0-or-later
# <pep8 compliant>

import datetime
import logging
import time
from pathlib import Path, PurePosixPath
from typing import Optional, TYPE_CHECKING
from urllib3.exceptions import HTTPError, MaxRetryError

import bpy

from . import job_types, job_submission, preferences, worker_tags
from .job_types_propgroup import JobTypePropertyGroup
from .bat.submodules import bpathlib

if TYPE_CHECKING:
    from .bat.interface import (
        PackThread as _PackThread,
        Message as _Message,
    )
    from .manager.models import (
        Error as _Error,
        SubmittedJob as _SubmittedJob,
    )
    from .manager.api_client import ApiClient as _ApiClient
    from .manager.exceptions import ApiException as _ApiException
else:
    _PackThread = object
    _Message = object
    _SubmittedJob = object
    _ApiClient = object
    _ApiException = object
    _Error = object

_log = logging.getLogger(__name__)


class FlamencoOpMixin:
    @staticmethod
    def get_api_client(context):
        """Get a Flamenco API client to talk to the Manager.

        Getting the client also loads the dependencies, so only import things
        from `flamenco.manager` after calling this function.
        """
        from . import comms, preferences

        manager_url = preferences.manager_url(context)
        api_client = comms.flamenco_api_client(manager_url)
        return api_client


class FLAMENCO_OT_fetch_job_types(FlamencoOpMixin, bpy.types.Operator):
    bl_idname = "flamenco.fetch_job_types"
    bl_label = "Fetch Job Types"
    bl_description = "Query Flamenco Manager to obtain the available job types"

    def execute(self, context: bpy.types.Context) -> set[str]:
        api_client = self.get_api_client(context)

        from flamenco.manager import ApiException

        scene = context.scene
        old_job_type_name = getattr(scene, "flamenco_job_type", "")

        try:
            job_types.fetch_available_job_types(api_client, scene)
        except ApiException as ex:
            self.report({"ERROR"}, "Error getting job types: %s" % ex)
            return {"CANCELLED"}
        except MaxRetryError as ex:
            # This is the common error, when for example the port number is
            # incorrect and nothing is listening.
            self.report({"ERROR"}, "Unable to reach Manager")
            return {"CANCELLED"}

        if old_job_type_name:
            # TODO: handle cases where the old job type no longer exists.
            scene.flamenco_job_type = old_job_type_name

        job_types.update_job_type_properties(scene)
        return {"FINISHED"}


class FLAMENCO_OT_fetch_worker_tags(FlamencoOpMixin, bpy.types.Operator):
    bl_idname = "flamenco.fetch_worker_tags"
    bl_label = "Fetch Worker Tags"
    bl_description = "Query Flamenco Manager to obtain the available worker tags"

    def execute(self, context: bpy.types.Context) -> set[str]:
        api_client = self.get_api_client(context)

        from flamenco.manager import ApiException

        scene = context.scene
        old_tag = getattr(scene, "flamenco_worker_tag", "")

        try:
            worker_tags.refresh(context, api_client)
        except ApiException as ex:
            self.report({"ERROR"}, "Error getting job types: %s" % ex)
            return {"CANCELLED"}
        except MaxRetryError as ex:
            # This is the common error, when for example the port number is
            # incorrect and nothing is listening.
            self.report({"ERROR"}, "Unable to reach Manager")
            return {"CANCELLED"}

        if old_tag:
            # TODO: handle cases where the old tag no longer exists.
            scene.flamenco_worker_tag = old_tag

        return {"FINISHED"}


class FLAMENCO_OT_ping_manager(FlamencoOpMixin, bpy.types.Operator):
    bl_idname = "flamenco.ping_manager"
    bl_label = "Flamenco: Ping Manager"
    bl_description = "Attempt to connect to the Manager"
    bl_options = {"REGISTER"}  # No UNDO.

    def execute(self, context: bpy.types.Context) -> set[str]:
        from . import comms, preferences

        api_client = self.get_api_client(context)
        prefs = preferences.get(context)

        report, level = comms.ping_manager_with_report(
            context.window_manager, api_client, prefs
        )
        self.report({level}, report)

        return {"FINISHED"}


class FLAMENCO_OT_eval_setting(FlamencoOpMixin, bpy.types.Operator):
    bl_idname = "flamenco.eval_setting"
    bl_label = "Flamenco: Evalutate Setting Value"
    bl_description = "Automatically determine a suitable value"
    bl_options = {"REGISTER", "INTERNAL", "UNDO"}

    setting_key: bpy.props.StringProperty(name="Setting Key")  # type: ignore
    setting_eval: bpy.props.StringProperty(name="Python Expression")  # type: ignore

    eval_description: bpy.props.StringProperty(name="Description", options={"HIDDEN"})

    @classmethod
    def description(cls, context, properties):
        if not properties.eval_description:
            return ""  # Causes bl_description to be shown.
        return f"Set value to: {properties.eval_description}"

    def execute(self, context: bpy.types.Context) -> set[str]:
        job = job_submission.job_for_scene(context.scene)
        if job is None:
            self.report({"ERROR"}, "This Scene has no Flamenco job")
            return {"CANCELLED"}

        propgroup: JobTypePropertyGroup = context.scene.flamenco_job_settings
        propgroup.eval_and_assign(context, self.setting_key, self.setting_eval)
        return {"FINISHED"}


class FLAMENCO_OT_submit_job(FlamencoOpMixin, bpy.types.Operator):
    bl_idname = "flamenco.submit_job"
    bl_label = "Flamenco: Submit Job"
    bl_description = "Pack the current blend file and send it to Flamenco"
    bl_options = {"REGISTER"}  # No UNDO.

    blendfile_on_farm: Optional[PurePosixPath] = None
    actual_shaman_checkout_path: Optional[PurePosixPath] = None

    job_name: bpy.props.StringProperty(name="Job Name")  # type: ignore
    job: Optional[_SubmittedJob] = None
    temp_blendfile: Optional[Path] = None
    ignore_version_mismatch: bpy.props.BoolProperty(  # type: ignore
        name="Ignore Version Mismatch",
        default=False,
    )

    TIMER_PERIOD = 0.25  # seconds
    timer: Optional[bpy.types.Timer] = None
    packthread: Optional[_PackThread] = None

    log = _log.getChild(bl_idname)

    @classmethod
    def poll(cls, context: bpy.types.Context) -> bool:
        # Only allow submission when there is a job type selected.
        job_type = job_types.active_job_type(context.scene)
        return job_type is not None

    def invoke(self, context: bpy.types.Context, event: bpy.types.Event) -> set[str]:
        # Before doing anything, make sure the info we cached about the Manager
        # is up to date. A change in job storage directory on the Manager can
        # cause nasty error messages when we submit, and it's better to just be
        # ahead of the curve and refresh first. This also allows for checking
        # the actual Manager version before submitting.
        err = self._check_manager(context)
        if err:
            self.report({"WARNING"}, err)
            return {"CANCELLED"}

        if not context.blend_data.filepath:
            # The file path needs to be known before the file can be submitted.
            self.report(
                {"ERROR"}, "Please save your .blend file before submitting to Flamenco"
            )
            return {"CANCELLED"}

        filepath = self._save_blendfile(context)

        # Check the job with the Manager, to see if it would be accepted.
        if not self._check_job(context):
            return {"CANCELLED"}

        return self._submit_files(context, filepath)

    def modal(self, context: bpy.types.Context, event: bpy.types.Event) -> set[str]:
        # This function is called for TIMER events to poll the BAT pack thread.
        if event.type != "TIMER":
            return {"PASS_THROUGH"}

        if self.packthread is None:
            # If there is no pack thread running, there isn't much we can do.
            return self._quit(context)

        # Limit the time for which messages are processed. If there are no
        # queued messages, this code stops immediately, but otherwise it will
        # continue to process until the deadline.
        deadline = time.monotonic() + 0.9 * self.TIMER_PERIOD
        num_messages = 0
        msg = None
        while time.monotonic() < deadline:
            msg = self.packthread.poll()
            if not msg:
                break
            num_messages += 1
            result = self._on_bat_pack_msg(context, msg)
            if "RUNNING_MODAL" not in result:
                return result

        return {"RUNNING_MODAL"}

    def _check_manager(self, context: bpy.types.Context) -> str:
        """Check the Manager version & fetch the job storage directory.

        :return: an error string when something went wrong.
        """
        from . import comms, preferences

        # Get the manager's info. This is cached in the preferences, so
        # regardless of whether this function actually responds to version
        # mismatches, it has to be called to also refresh the shared storage
        # location.
        api_client = self.get_api_client(context)
        prefs = preferences.get(context)
        mgrinfo = comms.ping_manager(context.window_manager, api_client, prefs)
        if mgrinfo.error:
            return mgrinfo.error

        # Check the Manager's version.
        if not self.ignore_version_mismatch:
            my_version = comms.flamenco_client_version()
            assert mgrinfo.version is not None

            try:
                mgrversion = mgrinfo.version.shortversion
            except AttributeError:
                # shortversion was introduced in Manager version 3.0-beta2, which
                # may not be running here yet.
                mgrversion = mgrinfo.version.version
            if mgrversion != my_version:
                context.window_manager.flamenco_version_mismatch = True
                return (
                    f"Manager ({mgrversion}) and this add-on ({my_version}) version "
                    + "mismatch, either update the add-on or force the submission"
                )

        # Un-set the 'flamenco_version_mismatch' when the versions match or when
        # one forced submission is done. Each submission has to go through the
        # same cycle of submitting, seeing the warning, then explicitly ignoring
        # the mismatch, to make it a concious decision to keep going with
        # potentially incompatible versions.
        context.window_manager.flamenco_version_mismatch = False

        # Empty error message indicates 'ok'.
        return ""

    def _save_blendfile(self, context):
        """Save to a different file, specifically for Flamenco.

        We shouldn't overwrite the artist's file.
        We can compress, since this file won't be managed by SVN and doesn't need diffability.
        """
        render = context.scene.render
        prefs = context.preferences

        # Remember settings we need to restore after saving.
        old_use_file_extension = render.use_file_extension
        old_use_overwrite = render.use_overwrite
        old_use_placeholder = render.use_placeholder
        old_use_all_linked_data_direct = getattr(
            prefs.experimental, "use_all_linked_data_direct", None
        )

        # TODO: see about disabling the denoiser (like the old Blender Cloud addon did).

        try:
            # The file extension should be determined by the render settings, not necessarily
            # by the setttings in the output panel.
            render.use_file_extension = True

            # Rescheduling should not overwrite existing frames.
            render.use_overwrite = False
            render.use_placeholder = False

            # To work around a shortcoming of BAT, ensure that all
            # indirectly-linked data is still saved as directly-linked.
            #
            # See `133dde41bb5b: Improve handling of (in)direclty linked status
            # for linked IDs` in Blender's Git repository.
            if old_use_all_linked_data_direct is not None:
                self.log.info(
                    "Overriding prefs.experimental.use_all_linked_data_direct = True"
                )
                prefs.experimental.use_all_linked_data_direct = True

            filepath = Path(context.blend_data.filepath).with_suffix(".flamenco.blend")
            self.log.info("Saving copy to temporary file %s", filepath)
            bpy.ops.wm.save_as_mainfile(
                filepath=str(filepath), compress=True, copy=True
            )
            self.temp_blendfile = filepath
        finally:
            # Restore the settings we changed, even after an exception.
            render.use_file_extension = old_use_file_extension
            render.use_overwrite = old_use_overwrite
            render.use_placeholder = old_use_placeholder

            # Only restore if the property exists to begin with:
            if old_use_all_linked_data_direct is not None:
                prefs.experimental.use_all_linked_data_direct = (
                    old_use_all_linked_data_direct
                )

        return filepath

    def _submit_files(self, context: bpy.types.Context, blendfile: Path) -> set[str]:
        """Ensure that the files are somewhere in the shared storage."""

        from .bat import interface as bat_interface

        if bat_interface.is_packing():
            self.report({"ERROR"}, "Another packing operation is running")
            self._quit(context)
            return {"CANCELLED"}

        prefs = preferences.get(context)
        if prefs.is_shaman_enabled:
            # self.blendfile_on_farm will be set when BAT created the checkout,
            # see _on_bat_pack_msg() below.
            self.blendfile_on_farm = None
            self._bat_pack_shaman(context, blendfile)
        elif job_submission.is_file_inside_job_storage(context, blendfile):
            self.log.info(
                "File is already in job storage location, submitting it as-is"
            )
            self._use_blendfile_directly(context, blendfile)
        else:
            self.log.info(
                "File is not already in job storage location, copying it there"
            )
            self.blendfile_on_farm = self._bat_pack_filesystem(context, blendfile)

        context.window_manager.modal_handler_add(self)
        wm = context.window_manager
        self.timer = wm.event_timer_add(self.TIMER_PERIOD, window=context.window)

        return {"RUNNING_MODAL"}

    def _bat_pack_filesystem(
        self, context: bpy.types.Context, blendfile: Path
    ) -> PurePosixPath:
        """Use BAT to store the pack on the filesystem.

        :return: the path of the blend file, for use in the job definition.
        """
        from .bat import interface as bat_interface

        # Get project path from addon preferences.
        prefs = preferences.get(context)
        project_path: Path = prefs.project_root()
        try:
            project_path = Path(bpy.path.abspath(str(project_path))).resolve()
        except FileNotFoundError:
            # Path.resolve() will raise a FileNotFoundError if the project path doesn't exist.
            self.report({"ERROR"}, "Project path %s does not exist" % project_path)
            raise  # TODO: handle this properly.

        # Determine where the blend file will be stored.
        unique_dir = "%s-%s" % (
            datetime.datetime.now().isoformat("-").replace(":", ""),
            self.job_name,
        )
        pack_target_dir = Path(prefs.job_storage) / unique_dir

        # TODO: this should take the blendfile location relative to the project path into account.
        pack_target_file = pack_target_dir / blendfile.name
        self.log.info("Will store blend file at %s", pack_target_file)

        self.packthread = bat_interface.copy(
            base_blendfile=blendfile,
            project=project_path,
            target=str(pack_target_dir),
            exclusion_filter="",  # TODO: get from GUI.
            relative_only=True,  # TODO: get from GUI.
        )

        return PurePosixPath(pack_target_file.as_posix())

    def _shaman_checkout_path(self) -> PurePosixPath:
        """Construct the Shaman checkout path, aka Shaman Checkout ID.

        Note that this may not be the actually used checkout ID, as that will be
        made unique to this job by Flamenco Manager. That will be stored in
        self.actual_shaman_checkout_path after the Shaman checkout is actually
        done.
        """
        assert self.job is not None

        # TODO: get project name from preferences/GUI and insert that here too.
        return PurePosixPath(f"{self.job.name}")

    def _bat_pack_shaman(self, context: bpy.types.Context, blendfile: Path) -> None:
        """Use the Manager's Shaman API to submit the BAT pack.

        :return: the filesystem path of the blend file, for in the render job definition.
        """
        from .bat import (
            interface as bat_interface,
            shaman as bat_shaman,
        )

        assert self.job is not None
        self.log.info("Sending BAT pack to Shaman")

        prefs = preferences.get(context)
        project_path: Path = prefs.project_root()

        self.packthread = bat_interface.copy(
            base_blendfile=blendfile,
            project=project_path,
            target="/",  # Target directory irrelevant for Shaman transfers.
            exclusion_filter="",  # TODO: get from GUI.
            relative_only=True,  # TODO: get from GUI.
            packer_class=bat_shaman.Packer,
            packer_kwargs=dict(
                api_client=self.get_api_client(context),
                checkout_path=self._shaman_checkout_path(),
            ),
        )

        # We cannot assume the blendfile location is known until the Shaman
        # checkout has actually been created.

    def _on_bat_pack_msg(self, context: bpy.types.Context, msg: _Message) -> set[str]:
        from .bat import interface as bat_interface

        if isinstance(msg, bat_interface.MsgDone):
            if self.blendfile_on_farm is None:
                # Adjust the blendfile to match the Shaman checkout path. Shaman
                # may have checked out at a different location than we
                # requested.
                #
                # Manager automatically creates a variable "jobs" that will
                # resolve to the job storage directory.
                self.blendfile_on_farm = PurePosixPath("{jobs}") / msg.output_path

            self.actual_shaman_checkout_path = msg.actual_checkout_path
            self._submit_job(context)
            return self._quit(context)

        if isinstance(msg, bat_interface.MsgException):
            self.log.error("Error performing BAT pack: %s", msg.ex)
            self.report({"ERROR"}, "Error performing BAT pack: %s" % msg.ex)

            # This was an exception caught at the top level of the thread, so
            # the packing thread itself has stopped.
            return self._quit(context)

        if isinstance(msg, bat_interface.MsgSetWMAttribute):
            wm = context.window_manager
            setattr(wm, msg.attribute_name, msg.value)

        return {"RUNNING_MODAL"}

    def _use_blendfile_directly(
        self, context: bpy.types.Context, blendfile: Path
    ) -> None:
        # The temporary '.flamenco.blend' file should not be deleted, as it
        # will be used directly by the render job.
        self.temp_blendfile = None

        # The blend file is contained in the job storage path, no need to
        # copy anything.
        self.blendfile_on_farm = bpathlib.make_absolute(blendfile)

        # No Shaman is involved when using the file directly.
        self.actual_shaman_checkout_path = None

        self._submit_job(context)

    def _prepare_job_for_submission(self, context: bpy.types.Context) -> bool:
        """Prepare self.job for sending to Flamenco."""

        self.job = job_submission.job_for_scene(context.scene)
        if self.job is None:
            self.report({"ERROR"}, "Unable to create job")
            return False

        propgroup = getattr(context.scene, "flamenco_job_settings", None)
        assert isinstance(propgroup, JobTypePropertyGroup), "did not expect %s" % (
            type(propgroup)
        )
        propgroup.eval_hidden_settings_of_job(context, self.job)

        job_submission.set_blend_file(
            propgroup.job_type,
            self.job,
            # self.blendfile_on_farm is None when we're just checking the job.
            self.blendfile_on_farm or "dummy-for-job-check.blend",
        )

        if self.actual_shaman_checkout_path:
            job_submission.set_shaman_checkout_id(
                self.job, self.actual_shaman_checkout_path
            )

        return True

    def _submit_job(self, context: bpy.types.Context) -> None:
        """Use the Flamenco API to submit the new Job."""
        assert self.job is not None
        assert self.blendfile_on_farm is not None

        from flamenco.manager import ApiException

        if not self._prepare_job_for_submission(context):
            return

        api_client = self.get_api_client(context)
        try:
            submitted_job = job_submission.submit_job(self.job, api_client)
        except MaxRetryError as ex:
            self.report({"ERROR"}, "Unable to reach Flamenco Manager")
            return
        except HTTPError as ex:
            self.report({"ERROR"}, "Error communicating with Flamenco Manager: %s" % ex)
            return
        except ApiException as ex:
            if ex.status == 412:
                self.report(
                    {"ERROR"},
                    "Cached job type is old. Refresh the job types and submit again, please",
                )
                return
            if ex.status == 400:
                error = parse_api_error(api_client, ex)
                self.report({"ERROR"}, error.message)
                return
            self.report({"ERROR"}, f"Could not submit job: {ex.reason}")
            return

        self.report({"INFO"}, "Job %s submitted" % submitted_job.name)

    def _check_job(self, context: bpy.types.Context) -> bool:
        """Use the Flamenco API to check the Job before submitting files.

        :return: "OK" flag, so True = ok, False = not ok.
        """
        from flamenco.manager import ApiException

        if not self._prepare_job_for_submission(context):
            return False
        assert self.job is not None

        api_client = self.get_api_client(context)
        try:
            job_submission.submit_job_check(self.job, api_client)
        except MaxRetryError as ex:
            self.report({"ERROR"}, "Unable to reach Flamenco Manager")
            return False
        except HTTPError as ex:
            self.report({"ERROR"}, "Error communicating with Flamenco Manager: %s" % ex)
            return False
        except ApiException as ex:
            if ex.status == 412:
                self.report(
                    {"ERROR"},
                    "Cached job type is old. Refresh the job types and submit again, please",
                )
                return False
            if ex.status == 400:
                error = parse_api_error(api_client, ex)
                self.report({"ERROR"}, error.message)
                return False
            self.report({"ERROR"}, f"Could not check job: {ex.reason}")
            return False
        return True

    def _quit(self, context: bpy.types.Context) -> set[str]:
        """Stop any timer and return a 'FINISHED' status.

        Does neither check nor abort the BAT pack thread.
        """

        if self.temp_blendfile is not None:
            self.log.info("Removing temporary file %s", self.temp_blendfile)
            self.temp_blendfile.unlink(missing_ok=True)

        if self.timer is not None:
            context.window_manager.event_timer_remove(self.timer)
            self.timer = None
        return {"FINISHED"}


class FLAMENCO3_OT_explore_file_path(bpy.types.Operator):
    """Opens the given path in a file explorer.

    If the path cannot be found, this operator tries to open its parent.
    """

    bl_idname = "flamenco3.explore_file_path"
    bl_label = "Open in file explorer"
    bl_description = __doc__.rstrip(".")

    path: bpy.props.StringProperty(  # type: ignore
        name="Path", description="Path to explore", subtype="DIR_PATH"
    )

    def execute(self, context):
        import platform
        import pathlib

        # Possibly open a parent of the path
        to_open = pathlib.Path(self.path)
        while to_open.parent != to_open:  # while we're not at the root
            if to_open.exists():
                break
            to_open = to_open.parent
        else:
            self.report(
                {"ERROR"}, "Unable to open %s or any of its parents." % self.path
            )
            return {"CANCELLED"}

        if platform.system() == "Windows":
            import os

            # Ignore the mypy error here, as os.startfile() only exists on Windows.
            os.startfile(str(to_open))  # type: ignore

        elif platform.system() == "Darwin":
            import subprocess

            subprocess.Popen(["open", str(to_open)])

        else:
            import subprocess

            subprocess.Popen(["xdg-open", str(to_open)])

        return {"FINISHED"}


classes = (
    FLAMENCO_OT_fetch_job_types,
    FLAMENCO_OT_fetch_worker_tags,
    FLAMENCO_OT_ping_manager,
    FLAMENCO_OT_eval_setting,
    FLAMENCO_OT_submit_job,
    FLAMENCO3_OT_explore_file_path,
)
register, unregister = bpy.utils.register_classes_factory(classes)


def parse_api_error(api_client: _ApiClient, ex: _ApiException) -> _Error:
    """Parse the body of an ApiException into an manager.models.Error instance."""

    from .manager.models import Error

    class MockResponse:
        data: str

    response = MockResponse()
    response.data = ex.body

    error: _Error = api_client.deserialize(response, (Error,), True)
    return error
