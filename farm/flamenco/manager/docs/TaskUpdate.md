# TaskUpdate

TaskUpdate is sent by a Worker to update the status & logs of a task it's executing. All properties are optional; omitted properties are ignored (i.e. omitting `activity` will not erase the activity property of the task). 

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**task_status** | [**TaskStatus**](TaskStatus.md) |  | [optional] 
**activity** | **str** | One-liner to indicate what&#39;s currently happening with the task. Overwrites previously sent activity strings. | [optional] 
**log** | **str** | Log lines for this task, will be appended to logs sent earlier. | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


