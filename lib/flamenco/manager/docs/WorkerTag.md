# WorkerTag

Tag of workers. A job can optionally specify which tag it should be limited to. Workers can be part of multiple tags simultaneously. 

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | 
**id** | **str** | UUID of the tag. Can be ommitted when creating a new tag, in which case a random UUID will be assigned.  | [optional] 
**description** | **str** |  | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


