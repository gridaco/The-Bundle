# SocketIOSubscription

Send by SocketIO clients as `/subscription` event type, to manage their subscription to job updates. Clients always get job updates, but for task updates or task logs they need to explicitly subscribe. For simplicity, clients can only subscribe to one job (to get task updates for that job) and one task's log at a time. 

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**op** | [**SocketIOSubscriptionOperation**](SocketIOSubscriptionOperation.md) |  | 
**type** | [**SocketIOSubscriptionType**](SocketIOSubscriptionType.md) |  | 
**uuid** | **str** | UUID of the thing to subscribe to / unsubscribe from. | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


