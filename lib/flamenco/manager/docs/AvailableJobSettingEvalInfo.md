# AvailableJobSettingEvalInfo

Meta-data for the 'eval' expression.

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**show_link_button** | **bool** | Enables the &#39;eval on submit&#39; toggle button behavior for this setting. A toggle button will be shown in Blender&#39;s submission interface. When toggled on, the &#x60;eval&#x60; expression will determine the setting&#39;s value. Manually editing the setting is then no longer possible, and instead of an input field, the &#39;description&#39; string is shown. An example use is the to-be-rendered frame range, which by default automatically follows the scene range, but can be overridden manually when desired.  | defaults to False
**description** | **str** | Description of what the &#39;eval&#39; expression is doing. It is also used as placeholder text to show when the manual input field is hidden (because eval-on-submit has been toggled on by the user).  | defaults to ""
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


