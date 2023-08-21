# SubmittedJob

Job definition submitted to Flamenco.

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | 
**type** | **str** |  | 
**submitter_platform** | **str** | Operating system of the submitter. This is used to recognise two-way variables. This should be a lower-case version of the platform, like \&quot;linux\&quot;, \&quot;windows\&quot;, \&quot;darwin\&quot;, \&quot;openbsd\&quot;, etc. Should be ompatible with Go&#39;s &#x60;runtime.GOOS&#x60;; run &#x60;go tool dist list&#x60; to get a list of possible platforms. As a special case, the platform \&quot;manager\&quot; can be given, which will be interpreted as \&quot;the Manager&#39;s platform\&quot;. This is mostly to make test/debug scripts easier, as they can use a static document on all platforms.  | 
**priority** | **int** |  | defaults to 50
**type_etag** | **str** | Hash of the job type, copied from the &#x60;AvailableJobType.etag&#x60; property of the job type. The job will be rejected if this field doesn&#39;t match the actual job type on the Manager. This prevents job submission with old settings, after the job compiler script has been updated. If this field is ommitted, the check is bypassed.  | [optional] 
**settings** | [**JobSettings**](JobSettings.md) |  | [optional] 
**metadata** | [**JobMetadata**](JobMetadata.md) |  | [optional] 
**storage** | [**JobStorageInfo**](JobStorageInfo.md) |  | [optional] 
**worker_tag** | **str** | Worker tag that should execute this job. When a tag ID is given, only Workers in that tag will be scheduled to work on it. If empty or ommitted, all workers can work on this job.  | [optional] 
**any string name** | **bool, date, datetime, dict, float, int, list, str, none_type** | any string name can be used but the value must be the correct type | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


