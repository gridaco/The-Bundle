# MayKeepRunning

Indicates whether the worker may keep running the task.

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**may_keep_running** | **bool** |  | 
**reason** | **str** |  | 
**status_change_requested** | **bool** | Indicates that a status change requested for the worker. It should use the &#x60;workerState&#x60; operation to determine which state to go to next. If this is &#x60;true&#x60;, &#x60;mayKeepRunning&#x60; MUST be &#x60;false&#x60;.  | 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


