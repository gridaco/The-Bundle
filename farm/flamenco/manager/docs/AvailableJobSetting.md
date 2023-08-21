# AvailableJobSetting

Single setting of a Job types.

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**key** | **str** | Identifier for the setting, must be unique within the job type. | 
**type** | [**AvailableJobSettingType**](AvailableJobSettingType.md) |  | 
**subtype** | [**AvailableJobSettingSubtype**](AvailableJobSettingSubtype.md) |  | [optional] 
**choices** | **[str]** | When given, limit the valid values to these choices. Only usable with string type. | [optional] 
**propargs** | **{str: (bool, date, datetime, dict, float, int, list, str, none_type)}** | Any extra arguments to the bpy.props.SomeProperty() call used to create this property. | [optional] 
**description** | **bool, date, datetime, dict, float, int, list, str, none_type** | The description/tooltip shown in the user interface. | [optional] 
**default** | **bool, date, datetime, dict, float, int, list, str, none_type** | The default value shown to the user when determining this setting. | [optional] 
**eval** | **str** | Python expression to be evaluated in order to determine the default value for this setting. | [optional] 
**eval_info** | [**AvailableJobSettingEvalInfo**](AvailableJobSettingEvalInfo.md) |  | [optional] 
**visible** | [**AvailableJobSettingVisibility**](AvailableJobSettingVisibility.md) |  | [optional] 
**required** | **bool** | Whether to immediately reject a job definition, of this type, without this particular setting.  | [optional]  if omitted the server will use the default value of False
**editable** | **bool** | Whether to allow editing this setting after the job has been submitted. Would imply deleting all existing tasks for this job, and recompiling it.  | [optional]  if omitted the server will use the default value of False
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


