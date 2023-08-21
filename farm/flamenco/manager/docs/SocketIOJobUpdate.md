# SocketIOJobUpdate

Subset of a Job, sent over SocketIO when a job changes. For new jobs, `previous_status` will be excluded. 

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | UUID of the Job | 
**updated** | **datetime** | Timestamp of last update | 
**status** | [**JobStatus**](JobStatus.md) |  | 
**type** | **str** |  | 
**refresh_tasks** | **bool** | Indicates that the client should refresh all the job&#39;s tasks. This is sent for mass updates, where updating each individual task would generate too many updates to be practical.  | 
**priority** | **int** |  | defaults to 50
**name** | **str** | Name of the job | [optional] 
**previous_status** | [**JobStatus**](JobStatus.md) |  | [optional] 
**delete_requested_at** | **datetime** | If job deletion was requested, this is the timestamp at which that request was stored on Flamenco Manager.  | [optional] 
**was_deleted** | **bool** | When a job was just deleted, this is set to &#x60;true&#x60;. If this is specified, only the &#39;id&#39; field is set, the rest will be empty.  | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


