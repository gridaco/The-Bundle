# Task

The task as it exists in the Manager database, i.e. before variable replacement.

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | 
**created** | **datetime** | Creation timestamp | 
**updated** | **datetime** | Timestamp of last update. | 
**job_id** | **str** |  | 
**name** | **str** |  | 
**status** | [**TaskStatus**](TaskStatus.md) |  | 
**priority** | **int** |  | 
**task_type** | **str** |  | 
**activity** | **str** |  | 
**commands** | [**[Command]**](Command.md) |  | 
**worker** | [**TaskWorker**](TaskWorker.md) |  | [optional] 
**last_touched** | **datetime** | Timestamp of when any worker worked on this task. | [optional] 
**failed_by_workers** | [**[TaskWorker]**](TaskWorker.md) |  | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


