# flake8: noqa

# import all models into this package
# if you have many models here with many references from one model to another this may
# raise a RecursionError
# to avoid this, import only the models that you directly need like:
# from from flamenco.manager.model.pet import Pet
# or import this package, but before doing it, use:
# import sys
# sys.setrecursionlimit(n)

from flamenco.manager.model.assigned_task import AssignedTask
from flamenco.manager.model.available_job_setting import AvailableJobSetting
from flamenco.manager.model.available_job_setting_eval_info import AvailableJobSettingEvalInfo
from flamenco.manager.model.available_job_setting_subtype import AvailableJobSettingSubtype
from flamenco.manager.model.available_job_setting_type import AvailableJobSettingType
from flamenco.manager.model.available_job_setting_visibility import AvailableJobSettingVisibility
from flamenco.manager.model.available_job_type import AvailableJobType
from flamenco.manager.model.available_job_types import AvailableJobTypes
from flamenco.manager.model.blender_path_check_result import BlenderPathCheckResult
from flamenco.manager.model.blender_path_find_result import BlenderPathFindResult
from flamenco.manager.model.blender_path_source import BlenderPathSource
from flamenco.manager.model.command import Command
from flamenco.manager.model.error import Error
from flamenco.manager.model.flamenco_version import FlamencoVersion
from flamenco.manager.model.job import Job
from flamenco.manager.model.job_all_of import JobAllOf
from flamenco.manager.model.job_blocklist import JobBlocklist
from flamenco.manager.model.job_blocklist_entry import JobBlocklistEntry
from flamenco.manager.model.job_deletion_info import JobDeletionInfo
from flamenco.manager.model.job_last_rendered_image_info import JobLastRenderedImageInfo
from flamenco.manager.model.job_metadata import JobMetadata
from flamenco.manager.model.job_priority_change import JobPriorityChange
from flamenco.manager.model.job_settings import JobSettings
from flamenco.manager.model.job_status import JobStatus
from flamenco.manager.model.job_status_change import JobStatusChange
from flamenco.manager.model.job_storage_info import JobStorageInfo
from flamenco.manager.model.job_tasks_summary import JobTasksSummary
from flamenco.manager.model.jobs_query import JobsQuery
from flamenco.manager.model.jobs_query_result import JobsQueryResult
from flamenco.manager.model.manager_configuration import ManagerConfiguration
from flamenco.manager.model.manager_variable import ManagerVariable
from flamenco.manager.model.manager_variable_audience import ManagerVariableAudience
from flamenco.manager.model.manager_variables import ManagerVariables
from flamenco.manager.model.may_keep_running import MayKeepRunning
from flamenco.manager.model.path_check_input import PathCheckInput
from flamenco.manager.model.path_check_result import PathCheckResult
from flamenco.manager.model.registered_worker import RegisteredWorker
from flamenco.manager.model.security_error import SecurityError
from flamenco.manager.model.setup_assistant_config import SetupAssistantConfig
from flamenco.manager.model.shaman_checkout import ShamanCheckout
from flamenco.manager.model.shaman_checkout_result import ShamanCheckoutResult
from flamenco.manager.model.shaman_file_spec import ShamanFileSpec
from flamenco.manager.model.shaman_file_spec_with_status import ShamanFileSpecWithStatus
from flamenco.manager.model.shaman_file_status import ShamanFileStatus
from flamenco.manager.model.shaman_requirements_request import ShamanRequirementsRequest
from flamenco.manager.model.shaman_requirements_response import ShamanRequirementsResponse
from flamenco.manager.model.shaman_single_file_status import ShamanSingleFileStatus
from flamenco.manager.model.shared_storage_location import SharedStorageLocation
from flamenco.manager.model.socket_io_job_update import SocketIOJobUpdate
from flamenco.manager.model.socket_io_last_rendered_update import SocketIOLastRenderedUpdate
from flamenco.manager.model.socket_io_subscription import SocketIOSubscription
from flamenco.manager.model.socket_io_subscription_operation import SocketIOSubscriptionOperation
from flamenco.manager.model.socket_io_subscription_type import SocketIOSubscriptionType
from flamenco.manager.model.socket_io_task_log_update import SocketIOTaskLogUpdate
from flamenco.manager.model.socket_io_task_update import SocketIOTaskUpdate
from flamenco.manager.model.socket_io_worker_update import SocketIOWorkerUpdate
from flamenco.manager.model.submitted_job import SubmittedJob
from flamenco.manager.model.task import Task
from flamenco.manager.model.task_log_info import TaskLogInfo
from flamenco.manager.model.task_status import TaskStatus
from flamenco.manager.model.task_status_change import TaskStatusChange
from flamenco.manager.model.task_summary import TaskSummary
from flamenco.manager.model.task_update import TaskUpdate
from flamenco.manager.model.task_worker import TaskWorker
from flamenco.manager.model.worker import Worker
from flamenco.manager.model.worker_all_of import WorkerAllOf
from flamenco.manager.model.worker_list import WorkerList
from flamenco.manager.model.worker_registration import WorkerRegistration
from flamenco.manager.model.worker_sign_on import WorkerSignOn
from flamenco.manager.model.worker_sleep_schedule import WorkerSleepSchedule
from flamenco.manager.model.worker_state_change import WorkerStateChange
from flamenco.manager.model.worker_state_changed import WorkerStateChanged
from flamenco.manager.model.worker_status import WorkerStatus
from flamenco.manager.model.worker_status_change_request import WorkerStatusChangeRequest
from flamenco.manager.model.worker_summary import WorkerSummary
from flamenco.manager.model.worker_tag import WorkerTag
from flamenco.manager.model.worker_tag_change_request import WorkerTagChangeRequest
from flamenco.manager.model.worker_tag_list import WorkerTagList
from flamenco.manager.model.worker_task import WorkerTask
from flamenco.manager.model.worker_task_all_of import WorkerTaskAllOf
