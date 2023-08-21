# Worker

All information about a Worker

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | 
**name** | **str** |  | 
**status** | [**WorkerStatus**](WorkerStatus.md) |  | 
**version** | **str** | Version of Flamenco this Worker is running | 
**can_restart** | **bool** | Whether this worker can auto-restart. | 
**ip_address** | **str** | IP address of the Worker | 
**platform** | **str** | Operating system of the Worker | 
**supported_task_types** | **[str]** |  | 
**status_change** | [**WorkerStatusChangeRequest**](WorkerStatusChangeRequest.md) |  | [optional] 
**last_seen** | **datetime** | Last time this worker was seen by the Manager. | [optional] 
**task** | [**WorkerTask**](WorkerTask.md) |  | [optional] 
**tags** | [**[WorkerTag]**](WorkerTag.md) | Tags of which this Worker is a member. | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


