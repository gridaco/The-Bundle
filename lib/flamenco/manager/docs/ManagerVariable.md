# ManagerVariable


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**value** | **str** |  | 
**is_twoway** | **bool** | One-way variables are the most common one, and are simple replacement from &#x60;{name}&#x60; to their value, which happens when a Task is given to a Worker. Two-way variables are also replaced when submitting a job, where the platform-specific value is replaced by &#x60;{name}&#x60;.  | 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


