# AvailableJobType

Job type supported by this Manager, and its parameters.

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | 
**label** | **str** |  | 
**settings** | [**[AvailableJobSetting]**](AvailableJobSetting.md) |  | 
**etag** | **str** | Hash of the job type. If the job settings or the label change, this etag will change. This is used on job submission to ensure that the submitted job settings are up to date.  | 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


