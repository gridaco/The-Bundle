# ShamanCheckout

Set of files with their SHA256 checksum, size in bytes, and desired location in the checkout directory.

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**files** | [**[ShamanFileSpec]**](ShamanFileSpec.md) |  | 
**checkout_path** | **str** | Path where the Manager should create this checkout. It is relative to the Shaman checkout path as configured on the Manager. In older versions of the Shaman this was just the \&quot;checkout ID\&quot;, but in this version it can be a path like &#x60;project-slug/scene-name/unique-ID&#x60;.  | 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


