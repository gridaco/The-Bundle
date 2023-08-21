# WorkerSleepSchedule

Sleep schedule for a single Worker. Start and end time indicate the time of each day at which the schedule is active. Applies only when today is in `days_of_week`, or when `days_of_week` is empty. Start and end time are in 24-hour HH:MM notation. 

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**is_active** | **bool** |  | 
**days_of_week** | **str** | Space-separated two-letter strings indicating days of week the schedule is active (\&quot;mo\&quot;, \&quot;tu\&quot;, etc.). Empty means \&quot;every day\&quot;.  | 
**start_time** | **str** |  | 
**end_time** | **str** |  | 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


