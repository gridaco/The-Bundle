# flamenco.manager.WorkerMgtApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_worker_tag**](WorkerMgtApi.md#create_worker_tag) | **POST** /api/v3/worker-mgt/tags | Create a new worker tag.
[**delete_worker**](WorkerMgtApi.md#delete_worker) | **DELETE** /api/v3/worker-mgt/workers/{worker_id} | Remove the given worker. It is recommended to only call this function when the worker is in &#x60;offline&#x60; state. If the worker is still running, stop it first. Any task still assigned to the worker will be requeued. 
[**delete_worker_tag**](WorkerMgtApi.md#delete_worker_tag) | **DELETE** /api/v3/worker-mgt/tag/{tag_id} | Remove this worker tag. This unassigns all workers from the tag and removes it.
[**fetch_worker**](WorkerMgtApi.md#fetch_worker) | **GET** /api/v3/worker-mgt/workers/{worker_id} | Fetch info about the worker.
[**fetch_worker_sleep_schedule**](WorkerMgtApi.md#fetch_worker_sleep_schedule) | **GET** /api/v3/worker-mgt/workers/{worker_id}/sleep-schedule | 
[**fetch_worker_tag**](WorkerMgtApi.md#fetch_worker_tag) | **GET** /api/v3/worker-mgt/tag/{tag_id} | Get a single worker tag.
[**fetch_worker_tags**](WorkerMgtApi.md#fetch_worker_tags) | **GET** /api/v3/worker-mgt/tags | Get list of worker tags.
[**fetch_workers**](WorkerMgtApi.md#fetch_workers) | **GET** /api/v3/worker-mgt/workers | Get list of workers.
[**request_worker_status_change**](WorkerMgtApi.md#request_worker_status_change) | **POST** /api/v3/worker-mgt/workers/{worker_id}/setstatus | 
[**set_worker_sleep_schedule**](WorkerMgtApi.md#set_worker_sleep_schedule) | **POST** /api/v3/worker-mgt/workers/{worker_id}/sleep-schedule | 
[**set_worker_tags**](WorkerMgtApi.md#set_worker_tags) | **POST** /api/v3/worker-mgt/workers/{worker_id}/settags | 
[**update_worker_tag**](WorkerMgtApi.md#update_worker_tag) | **PUT** /api/v3/worker-mgt/tag/{tag_id} | Update an existing worker tag.


# **create_worker_tag**
> WorkerTag create_worker_tag(worker_tag)

Create a new worker tag.

### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import worker_mgt_api
from flamenco.manager.model.error import Error
from flamenco.manager.model.worker_tag import WorkerTag
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = worker_mgt_api.WorkerMgtApi(api_client)
    worker_tag = WorkerTag(
        id="id_example",
        name="name_example",
        description="description_example",
    ) # WorkerTag | The worker tag.

    # example passing only required values which don't have defaults set
    try:
        # Create a new worker tag.
        api_response = api_instance.create_worker_tag(worker_tag)
        pprint(api_response)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerMgtApi->create_worker_tag: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **worker_tag** | [**WorkerTag**](WorkerTag.md)| The worker tag. |

### Return type

[**WorkerTag**](WorkerTag.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The tag was created. The created tag is returned, so that the caller can know its UUID. |  -  |
**0** | Error message |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_worker**
> delete_worker(worker_id)

Remove the given worker. It is recommended to only call this function when the worker is in `offline` state. If the worker is still running, stop it first. Any task still assigned to the worker will be requeued. 

### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import worker_mgt_api
from flamenco.manager.model.error import Error
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = worker_mgt_api.WorkerMgtApi(api_client)
    worker_id = "worker_id_example" # str | 

    # example passing only required values which don't have defaults set
    try:
        # Remove the given worker. It is recommended to only call this function when the worker is in `offline` state. If the worker is still running, stop it first. Any task still assigned to the worker will be requeued. 
        api_instance.delete_worker(worker_id)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerMgtApi->delete_worker: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **worker_id** | **str**|  |

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | Normal response, worker has been deleted |  -  |
**0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_worker_tag**
> delete_worker_tag(tag_id)

Remove this worker tag. This unassigns all workers from the tag and removes it.

### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import worker_mgt_api
from flamenco.manager.model.error import Error
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = worker_mgt_api.WorkerMgtApi(api_client)
    tag_id = "tag_id_example" # str | 

    # example passing only required values which don't have defaults set
    try:
        # Remove this worker tag. This unassigns all workers from the tag and removes it.
        api_instance.delete_worker_tag(tag_id)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerMgtApi->delete_worker_tag: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tag_id** | **str**|  |

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | The tag has been removed. |  -  |
**0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **fetch_worker**
> Worker fetch_worker(worker_id)

Fetch info about the worker.

### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import worker_mgt_api
from flamenco.manager.model.worker import Worker
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = worker_mgt_api.WorkerMgtApi(api_client)
    worker_id = "worker_id_example" # str | 

    # example passing only required values which don't have defaults set
    try:
        # Fetch info about the worker.
        api_response = api_instance.fetch_worker(worker_id)
        pprint(api_response)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerMgtApi->fetch_worker: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **worker_id** | **str**|  |

### Return type

[**Worker**](Worker.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Worker info |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **fetch_worker_sleep_schedule**
> WorkerSleepSchedule fetch_worker_sleep_schedule(worker_id)



### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import worker_mgt_api
from flamenco.manager.model.error import Error
from flamenco.manager.model.worker_sleep_schedule import WorkerSleepSchedule
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = worker_mgt_api.WorkerMgtApi(api_client)
    worker_id = "worker_id_example" # str | 

    # example passing only required values which don't have defaults set
    try:
        api_response = api_instance.fetch_worker_sleep_schedule(worker_id)
        pprint(api_response)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerMgtApi->fetch_worker_sleep_schedule: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **worker_id** | **str**|  |

### Return type

[**WorkerSleepSchedule**](WorkerSleepSchedule.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Normal response, the sleep schedule. |  -  |
**204** | The worker has no sleep schedule. |  -  |
**0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **fetch_worker_tag**
> WorkerTag fetch_worker_tag(tag_id)

Get a single worker tag.

### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import worker_mgt_api
from flamenco.manager.model.worker_tag import WorkerTag
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = worker_mgt_api.WorkerMgtApi(api_client)
    tag_id = "tag_id_example" # str | 

    # example passing only required values which don't have defaults set
    try:
        # Get a single worker tag.
        api_response = api_instance.fetch_worker_tag(tag_id)
        pprint(api_response)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerMgtApi->fetch_worker_tag: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tag_id** | **str**|  |

### Return type

[**WorkerTag**](WorkerTag.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The worker tag. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **fetch_worker_tags**
> WorkerTagList fetch_worker_tags()

Get list of worker tags.

### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import worker_mgt_api
from flamenco.manager.model.worker_tag_list import WorkerTagList
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = worker_mgt_api.WorkerMgtApi(api_client)

    # example, this endpoint has no required or optional parameters
    try:
        # Get list of worker tags.
        api_response = api_instance.fetch_worker_tags()
        pprint(api_response)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerMgtApi->fetch_worker_tags: %s\n" % e)
```


### Parameters
This endpoint does not need any parameter.

### Return type

[**WorkerTagList**](WorkerTagList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Worker tags. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **fetch_workers**
> WorkerList fetch_workers()

Get list of workers.

### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import worker_mgt_api
from flamenco.manager.model.worker_list import WorkerList
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = worker_mgt_api.WorkerMgtApi(api_client)

    # example, this endpoint has no required or optional parameters
    try:
        # Get list of workers.
        api_response = api_instance.fetch_workers()
        pprint(api_response)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerMgtApi->fetch_workers: %s\n" % e)
```


### Parameters
This endpoint does not need any parameter.

### Return type

[**WorkerList**](WorkerList.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Known workers |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **request_worker_status_change**
> request_worker_status_change(worker_id, worker_status_change_request)



### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import worker_mgt_api
from flamenco.manager.model.error import Error
from flamenco.manager.model.worker_status_change_request import WorkerStatusChangeRequest
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = worker_mgt_api.WorkerMgtApi(api_client)
    worker_id = "worker_id_example" # str | 
    worker_status_change_request = WorkerStatusChangeRequest(
        status=WorkerStatus("starting"),
        is_lazy=True,
    ) # WorkerStatusChangeRequest | The status change to request.

    # example passing only required values which don't have defaults set
    try:
        api_instance.request_worker_status_change(worker_id, worker_status_change_request)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerMgtApi->request_worker_status_change: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **worker_id** | **str**|  |
 **worker_status_change_request** | [**WorkerStatusChangeRequest**](WorkerStatusChangeRequest.md)| The status change to request. |

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | Status change was accepted. |  -  |
**0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **set_worker_sleep_schedule**
> set_worker_sleep_schedule(worker_id, worker_sleep_schedule)



### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import worker_mgt_api
from flamenco.manager.model.error import Error
from flamenco.manager.model.worker_sleep_schedule import WorkerSleepSchedule
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = worker_mgt_api.WorkerMgtApi(api_client)
    worker_id = "worker_id_example" # str | 
    worker_sleep_schedule = WorkerSleepSchedule(
        is_active=True,
        days_of_week="days_of_week_example",
        start_time="start_time_example",
        end_time="end_time_example",
    ) # WorkerSleepSchedule | The new sleep schedule.

    # example passing only required values which don't have defaults set
    try:
        api_instance.set_worker_sleep_schedule(worker_id, worker_sleep_schedule)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerMgtApi->set_worker_sleep_schedule: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **worker_id** | **str**|  |
 **worker_sleep_schedule** | [**WorkerSleepSchedule**](WorkerSleepSchedule.md)| The new sleep schedule. |

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | The schedule has been stored. |  -  |
**0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **set_worker_tags**
> set_worker_tags(worker_id, worker_tag_change_request)



### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import worker_mgt_api
from flamenco.manager.model.error import Error
from flamenco.manager.model.worker_tag_change_request import WorkerTagChangeRequest
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = worker_mgt_api.WorkerMgtApi(api_client)
    worker_id = "worker_id_example" # str | 
    worker_tag_change_request = WorkerTagChangeRequest(
        tag_ids=[
            "tag_ids_example",
        ],
    ) # WorkerTagChangeRequest | The list of worker tag IDs this worker should be a member of.

    # example passing only required values which don't have defaults set
    try:
        api_instance.set_worker_tags(worker_id, worker_tag_change_request)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerMgtApi->set_worker_tags: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **worker_id** | **str**|  |
 **worker_tag_change_request** | [**WorkerTagChangeRequest**](WorkerTagChangeRequest.md)| The list of worker tag IDs this worker should be a member of. |

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | Status change was accepted. |  -  |
**0** | Unexpected error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update_worker_tag**
> update_worker_tag(tag_id, worker_tag)

Update an existing worker tag.

### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import worker_mgt_api
from flamenco.manager.model.error import Error
from flamenco.manager.model.worker_tag import WorkerTag
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = worker_mgt_api.WorkerMgtApi(api_client)
    tag_id = "tag_id_example" # str | 
    worker_tag = WorkerTag(
        id="id_example",
        name="name_example",
        description="description_example",
    ) # WorkerTag | The updated worker tag.

    # example passing only required values which don't have defaults set
    try:
        # Update an existing worker tag.
        api_instance.update_worker_tag(tag_id, worker_tag)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerMgtApi->update_worker_tag: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tag_id** | **str**|  |
 **worker_tag** | [**WorkerTag**](WorkerTag.md)| The updated worker tag. |

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | The tag update has been stored. |  -  |
**0** | Error message |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

