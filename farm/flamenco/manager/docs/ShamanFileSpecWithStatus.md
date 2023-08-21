# ShamanFileSpecWithStatus

Specification of a file, which could be in the Shaman storage, or not, depending on its status.

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sha** | **str** | SHA256 checksum of the file | 
**size** | **int** | File size in bytes | 
**path** | **str** | Location of the file in the checkout | 
**status** | [**ShamanFileStatus**](ShamanFileStatus.md) |  | 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


