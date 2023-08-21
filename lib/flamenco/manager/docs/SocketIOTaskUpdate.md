# SocketIOTaskUpdate

Subset of a Task, sent over SocketIO when a task changes. For new tasks, `previous_status` will be excluded. 

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | UUID of the Task | 
**job_id** | **str** |  | 
**name** | **str** | Name of the task | 
**updated** | **datetime** | Timestamp of last update | 
**status** | [**TaskStatus**](TaskStatus.md) |  | 
**activity** | **str** |  | 
**previous_status** | [**TaskStatus**](TaskStatus.md) |  | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


