# JobAllOf


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | UUID of the Job | 
**created** | **datetime** | Creation timestamp | 
**updated** | **datetime** | Timestamp of last update. | 
**status** | [**JobStatus**](JobStatus.md) |  | 
**activity** | **str** | Description of the last activity on this job. | 
**delete_requested_at** | **datetime** | If job deletion was requested, this is the timestamp at which that request was stored on Flamenco Manager.  | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


