# Error

Generic error response.

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **int** | HTTP status code of this response. Is included in the payload so that a single object represents all error information. Code 503 is used when the database is busy. The HTTP response will contain a &#39;Retry-After&#39; HTTP header that indicates after which time the request can be retried. Following the header is not mandatory, and it&#39;s up to the client to do something reasonable like exponential backoff.  | 
**message** | **str** |  | 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


