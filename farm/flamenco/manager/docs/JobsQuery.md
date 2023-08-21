# JobsQuery


## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**offset** | **int** |  | [optional] 
**limit** | **int** |  | [optional] 
**order_by** | **[str]** |  | [optional] 
**status_in** | [**[JobStatus]**](JobStatus.md) | Return only jobs with a status in this array. | [optional] 
**metadata** | **{str: (str,)}** | Filter by metadata, using &#x60;LIKE&#x60; notation. | [optional] 
**settings** | **{str: (bool, date, datetime, dict, float, int, list, str, none_type)}** | Filter by job settings, using &#x60;LIKE&#x60; notation. | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


