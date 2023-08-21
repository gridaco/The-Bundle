# SocketIOTaskLogUpdate

Task log chunk, sent to a SocketIO room dedicated to a single task, to avoid sending too many updates. 

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**task_id** | **str** | UUID of the Task | 
**log** | **str** | Chunk of the task log. May contain multiple lines of text. | 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


