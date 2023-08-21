"""Flamenco Job Type to bpy.props.PropertyGroup conversion."""

# SPDX-License-Identifier: GPL-3.0-or-later

import logging
import pprint
from pathlib import Path
from typing import TYPE_CHECKING, Callable, Optional, Any, Union

import bpy

from . import job_types
from .bat.submodules import bpathlib

_log = logging.getLogger(__name__)

if TYPE_CHECKING:
    from flamenco.manager.models import (
        AvailableJobType as _AvailableJobType,
        AvailableJobSetting as _AvailableJobSetting,
        JobSettings as _JobSettings,
        SubmittedJob as _SubmittedJob,
    )
else:
    _AvailableJobType = object
    _AvailableJobSetting = object
    _JobSettings = object
    _SubmittedJob = object


class SettingEvalError(Exception):
    """Raised when the evaluation of a setting fails."""

    def __init__(
        self,
        setting_key: str,
        setting_eval: str,
        eval_locals: dict[str, Any],
        exception: Exception,
    ) -> None:
        self.setting_key = setting_key
        self.setting_eval = setting_eval
        self.locals = eval_locals.copy()
        self.exception = exception

        print("Evaluation error of setting %r:" % setting_key)
        print("Expression: %s" % setting_eval)
        print("Local variables:")
        pprint.pprint(eval_locals)
        print("Exception: %s" % exception)

        msg = "Evaluation error of setting %r: %s" % (setting_key, exception)
        super().__init__(msg)


class JobTypePropertyGroup:
    """Mix-in class for PropertyGroups for Flamenco Job Types.

    Use `generate(job_type: AvailableJobType)` to create such a subclass.
    """

    job_type: _AvailableJobType
    """The job type passed to `generate(job_type)`."""

    @classmethod
    def register_property_group(cls):
        bpy.utils.register_class(cls)

    @classmethod
    def unregister_property_group(cls):
        bpy.utils.unregister_class(cls)

    def as_jobsettings(self) -> _JobSettings:
        from flamenco.manager.models import JobSettings

        js: JobSettings = JobSettings()
        for setting in self.job_type.settings:
            js[setting.key] = getattr(self, setting.key)

        return js

    def label(self, setting_key: str) -> str:
        """Return the UI label for this setting."""
        # MyPy doesn't understand the Blender RNA magic.
        label: str = self.bl_rna.properties[setting_key].name  # type: ignore
        return label

    def locals(self, context: bpy.types.Context) -> dict[str, object]:
        """Return the local variables for job type evaluation."""
        return {
            "bpy": bpy,
            "C": context,
            "jobname": context.scene.flamenco_job_name,
            "Path": Path,
            "abspath": self.abspath,
            "last_n_dir_parts": self.last_n_dir_parts,
            "settings": self,
        }

    def eval_and_assign(
        self,
        context: bpy.types.Context,
        setting_key: str,
        setting_eval: str,
    ) -> None:
        """Evaluate `setting_eval` and assign the result to the job setting."""
        value = self.eval_setting(context, setting_key, setting_eval)
        setattr(self, setting_key, value)

    def eval_setting(
        self,
        context: bpy.types.Context,
        setting_key: str,
        setting_eval: str,
    ) -> Any:
        """Evaluate `setting_eval` and return the result."""

        eval_locals = self.locals(context)
        try:
            value = eval(setting_eval, {}, eval_locals)
        except Exception as ex:
            raise SettingEvalError(setting_key, setting_eval, eval_locals, ex) from ex
        return value

    def eval_hidden_settings_of_job(
        self, context: bpy.types.Context, job: _SubmittedJob
    ) -> None:
        """Assign values to settings hidden from the UI.

        If the setting has an `eval` property, it'll be evaluated and used as the
        setting value. Otherwise the default is used.
        """
        for setting in self.job_type.settings:
            if not job_types.setting_should_autoeval(self, setting):
                continue

            setting_eval = setting.get("eval", "")
            if setting_eval:
                value = self.eval_setting(context, setting.key, setting_eval)
            elif "default" in setting:
                value = setting.default
            else:
                # No way to get a default value, so just don't bother overwriting
                # anything.
                continue

            job.settings[setting.key] = value

    def eval_visible_settings_if_no_value(self, context: bpy.types.Context) -> None:
        """Assign default values to all visible, evaluatable settings.

        If the setting already has a value, that value will not be overwritten
        in order to retain the user's input.

        If the setting has an `eval` property, it'll be evaluated and used as
        the setting value. Otherwise it will be skipped.
        """
        for setting in self.job_type.settings:
            if not job_types.setting_is_visible(setting):
                # Skip those settings that will be hidden from the GUI.
                # These are evaluated at submission time anyway.
                continue

            setting_eval = setting.get("eval", "")
            if not setting_eval:
                continue

            if getattr(self, setting.key):
                # Non-falsey setting, so don't overwrite.
                continue

            value = self.eval_setting(context, setting.key, setting_eval)
            setattr(self, setting.key, value)

    @staticmethod
    def last_n_dir_parts(n: int, filepath: Union[str, Path, None] = None) -> Path:
        """Return the last `n` parts of the directory of `filepath`.

        If `n` is 0, returns an empty `Path()`.
        If `filepath` is None, uses bpy.data.filepath instead.

        >>> str(last_n_dir_parts(2, "/path/to/some/file.blend"))
        "to/some"

        Always returns a relative path:
        >>> str(last_n_dir_parts(200, "C:\\path\\to\\some\\file.blend"))
        "path\\to\\some"
        """

        if n <= 0:
            return Path()

        if filepath is None:
            filepath = Path(bpy.data.filepath)
        elif isinstance(filepath, str):
            filepath = Path(bpy.path.abspath(filepath))

        dirpath = bpathlib.make_absolute(filepath).parent
        if n >= len(dirpath.parts):
            all_parts = dirpath.relative_to(dirpath.anchor)
            return Path(all_parts)

        subset = Path(*dirpath.parts[-n:])
        return subset

    @staticmethod
    def abspath(filepath: Union[str, Path]) -> Path:
        """Return the filepath as absolute path."""

        # This changes blendfile-relative paths to absolute.
        # It does not resolve `..` entries, though.
        abs_unclean = Path(bpy.path.abspath(str(filepath)))
        abs_clean: Path = bpathlib.make_absolute(abs_unclean)
        return abs_clean


# Mapping from AvailableJobType.setting.type to a callable that converts a value
# to the appropriate type. This is necessary due to the ambiguity between floats
# and ints in JavaScript (and thus JSON).
_value_coerce = {
    "bool": bool,
    "string": str,
    "int32": int,
    "float": float,
}

_prop_types = {
    "bool": bpy.props.BoolProperty,
    "string": bpy.props.StringProperty,
    "int32": bpy.props.IntProperty,
    "float": bpy.props.FloatProperty,
}


def generate(job_type: _AvailableJobType) -> type[JobTypePropertyGroup]:
    """Create a PropertyGroup for the job type.

    Does not register the property group.
    """
    from flamenco.manager.model.available_job_type import AvailableJobType

    assert isinstance(job_type, AvailableJobType)

    classname = _job_type_to_class_name(job_type.name)

    pg_type = type(
        classname,
        (JobTypePropertyGroup, bpy.types.PropertyGroup),  # Base classes.
        {  # Class attributes.
            "job_type": job_type,
        },
    )
    pg_type.__annotations__ = {}

    # Add RNA properties for the settings.
    for setting in job_type.settings:
        prop = _create_property(job_type, setting)
        pg_type.__annotations__[setting.key] = prop

        if job_types.show_eval_on_submit_button(setting):
            # Add RNA property for the 'auto-eval' toggle.
            propname, prop = _create_autoeval_property(setting)
            pg_type.__annotations__[propname] = prop

    assert issubclass(pg_type, JobTypePropertyGroup), "did not expect type %r" % type(
        pg_type
    )

    return pg_type


def _create_property(job_type: _AvailableJobType, setting: _AvailableJobSetting) -> Any:
    """Create a bpy.props property for the given job setting.

    Depending on the setting, will be a StringProperty, EnumProperty, FloatProperty, etc.
    """
    from flamenco.manager.model.available_job_setting import AvailableJobSetting
    from flamenco.manager.model_utils import ModelSimple

    assert isinstance(setting, AvailableJobSetting)

    # Special case: a string property with 'choices' setting. This should translate to an EnumProperty
    prop_type, prop_kwargs = _find_prop_type(job_type, setting)

    assert isinstance(setting.type, ModelSimple)
    value_coerce = _value_coerce[setting.type.to_str()]
    _set_if_available(prop_kwargs, setting, "description")
    _set_if_available(prop_kwargs, setting, "default", transform=value_coerce)
    _set_if_available(prop_kwargs, setting, "subtype", transform=_transform_subtype)

    # Remove the 'ANIMATABLE' option.
    prop_kwargs.setdefault("options", set())

    # Add any extra arguments.
    propargs = setting.get("propargs", {})
    coerce_keys = {"min", "max"}
    for key, value in propargs.items():
        if key in coerce_keys:
            propargs[key] = value_coerce(value)
    prop_kwargs.update(propargs)

    # Construct a getter if it's a non-editable property. By having a getter and
    # not a setter, the property automatically becomes read-only in the UI.
    if not setting.get("editable", True):
        prop_kwargs["get"] = _create_prop_getter(job_type, setting)

    prop_name = _job_setting_key_to_label(setting.key)
    prop = prop_type(name=prop_name, **prop_kwargs)
    return prop


def _create_autoeval_property(
    setting: _AvailableJobSetting,
) -> tuple[str, Any]:
    from flamenco.manager.model.available_job_setting import AvailableJobSetting

    assert isinstance(setting, AvailableJobSetting)

    setting_name = _job_setting_key_to_label(setting.key)
    prop_descr = (
        "Automatically determine the value for %r when the job gets submitted"
        % setting_name
    )

    prop = bpy.props.BoolProperty(
        name="Use Automatic Value",
        description=prop_descr,
        default=True,
    )

    prop_name = job_types.setting_autoeval_propname(setting)
    return prop_name, prop


def _find_prop_type(
    job_type: _AvailableJobType, setting: _AvailableJobSetting
) -> tuple[Any, dict[str, Any]]:
    """Return a tuple (bpy.props.XxxProperty, kwargs for construction)."""

    # The special case is a 'string' property with 'choices' setting, which
    # should translate to an EnumProperty. All others just map to a simple
    # bpy.props type.

    setting_type = setting.type.to_str()

    if "choices" not in setting:
        return _prop_types[setting_type], {}

    if setting_type != "string":
        # There was a 'choices' key, but not for a supported type. Ignore the
        # choices but complain about it.
        _log.warn(
            "job type %r, setting %r: only string choices are supported, but property is of type %s",
            job_type.name,
            setting.key,
            setting_type,
        )
        return _prop_types[setting_type], {}

    choices = setting.choices
    enum_items = [(choice, choice, "") for choice in choices]
    return bpy.props.EnumProperty, {"items": enum_items}


def _transform_subtype(subtype: object) -> str:
    uppercase = str(subtype).upper()
    if uppercase == "HASHED_FILE_PATH":
        # Flamenco has a concept of 'hashed file path' subtype, but Blender does not.
        return "FILE_PATH"
    return uppercase


def _job_type_to_class_name(job_type_name: str) -> str:
    """Change 'job-type-name' to 'JobTypeName'.

    >>> _job_type_to_class_name('job-type-name')
    'JobTypeName'
    """
    return job_type_name.title().replace("-", "")


def _job_setting_key_to_label(setting_key: str) -> str:
    """Change 'some_setting_key' to 'Some Setting Key'.

    >>> _job_setting_key_to_label('some_setting_key')
    'Some Setting Key'
    """
    return setting_key.title().replace("_", " ")


def _set_if_available(
    some_dict: dict[Any, Any],
    setting: object,
    key: str,
    transform: Optional[Callable[[object], object]] = None,
) -> None:
    """some_dict[key] = setting.key, if that key is available.

    >>> class Setting:
    ...     pass
    >>> setting = Setting()
    >>> setting.exists = 47
    >>> d = {}
    >>> _set_if_available(d, setting, "exists")
    >>> _set_if_available(d, setting, "other")
    >>> d
    {'exists': 47}
    >>> d = {}
    >>> _set_if_available(d, setting, "exists", transform=lambda v: str(v))
    >>> d
    {'exists': '47'}
    """
    try:
        value = getattr(setting, key)
    except AttributeError:
        return

    if transform is None:
        some_dict[key] = value
    else:
        some_dict[key] = transform(value)


def _create_prop_getter(
    job_type: _AvailableJobType, setting: _AvailableJobSetting
) -> Callable[[JobTypePropertyGroup], Any]:
    def evaluate_setting(propgroup: JobTypePropertyGroup) -> Any:
        value = propgroup.eval_setting(
            bpy.context,
            setting.key,
            setting.eval,
        )
        return value

    def default_value(propgroup: JobTypePropertyGroup) -> Any:
        return setting.default

    if setting.get("eval"):
        return evaluate_setting
    return default_value
