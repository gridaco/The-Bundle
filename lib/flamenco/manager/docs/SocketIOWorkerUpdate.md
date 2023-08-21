# SocketIOWorkerUpdate

Subset of a Worker, sent over SocketIO when a worker changes. 

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | UUID of the Worker | 
**name** | **str** | Name of the worker | 
**updated** | **datetime** | Timestamp of last update | 
**status** | [**WorkerStatus**](WorkerStatus.md) |  | 
**version** | **str** |  | 
**can_restart** | **bool** | Whether this Worker can auto-restart. | 
**last_seen** | **datetime** | Last time this worker was seen by the Manager. | [optional] 
**previous_status** | [**WorkerStatus**](WorkerStatus.md) |  | [optional] 
**status_change** | [**WorkerStatusChangeRequest**](WorkerStatusChangeRequest.md) |  | [optional] 
**deleted_at** | **datetime** | This is only set when the worker was deleted. | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


