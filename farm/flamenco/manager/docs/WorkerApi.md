# flamenco.manager.WorkerApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**may_worker_run**](WorkerApi.md#may_worker_run) | **GET** /api/v3/worker/task/{task_id}/may-i-run | The response indicates whether the worker is allowed to run / keep running the task. Optionally contains a queued worker status change. 
[**register_worker**](WorkerApi.md#register_worker) | **POST** /api/v3/worker/register-worker | Register a new worker
[**schedule_task**](WorkerApi.md#schedule_task) | **POST** /api/v3/worker/task | Obtain a new task to execute
[**sign_off**](WorkerApi.md#sign_off) | **POST** /api/v3/worker/sign-off | Mark the worker as offline
[**sign_on**](WorkerApi.md#sign_on) | **POST** /api/v3/worker/sign-on | Authenticate &amp; sign in the worker.
[**task_output_produced**](WorkerApi.md#task_output_produced) | **POST** /api/v3/worker/task/{task_id}/output-produced | Store the most recently rendered frame here. Note that it is up to the Worker to ensure this is in a format that&#39;s digestable by the Manager. Currently only PNG and JPEG support is planned. 
[**task_update**](WorkerApi.md#task_update) | **POST** /api/v3/worker/task/{task_id} | Update the task, typically to indicate progress, completion, or failure.
[**worker_state**](WorkerApi.md#worker_state) | **GET** /api/v3/worker/state | 
[**worker_state_changed**](WorkerApi.md#worker_state_changed) | **POST** /api/v3/worker/state-changed | Worker changed state. This could be as acknowledgement of a Manager-requested state change, or in response to worker-local signals.


# **may_worker_run**
> MayKeepRunning may_worker_run(task_id)

The response indicates whether the worker is allowed to run / keep running the task. Optionally contains a queued worker status change. 

### Example

* Basic Authentication (worker_auth):

```python
import time
import flamenco.manager
from flamenco.manager.api import worker_api
from flamenco.manager.model.error import Error
from flamenco.manager.model.may_keep_running import MayKeepRunning
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure HTTP basic authorization: worker_auth
configuration = flamenco.manager.Configuration(
    username = 'YOUR_USERNAME',
    password = 'YOUR_PASSWORD'
)

# Enter a context with an instance of the API client
with flamenco.manager.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = worker_api.WorkerApi(api_client)
    task_id = "task_id_example" # str | 

    # example passing only required values which don't have defaults set
    try:
        # The response indicates whether the worker is allowed to run / keep running the task. Optionally contains a queued worker status change. 
        api_response = api_instance.may_worker_run(task_id)
        pprint(api_response)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerApi->may_worker_run: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **task_id** | **str**|  |

### Return type

[**MayKeepRunning**](MayKeepRunning.md)

### Authorization

[worker_auth](../README.md#worker_auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | normal response |  -  |
**0** | unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **register_worker**
> RegisteredWorker register_worker(worker_registration)

Register a new worker

### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import worker_api
from flamenco.manager.model.error import Error
from flamenco.manager.model.worker_registration import WorkerRegistration
from flamenco.manager.model.registered_worker import RegisteredWorker
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = worker_api.WorkerApi(api_client)
    worker_registration = WorkerRegistration(
        secret="secret_example",
        platform="platform_example",
        supported_task_types=[
            "supported_task_types_example",
        ],
        name="name_example",
    ) # WorkerRegistration | Worker to register

    # example passing only required values which don't have defaults set
    try:
        # Register a new worker
        api_response = api_instance.register_worker(worker_registration)
        pprint(api_response)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerApi->register_worker: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **worker_registration** | [**WorkerRegistration**](WorkerRegistration.md)| Worker to register |

### Return type

[**RegisteredWorker**](RegisteredWorker.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | normal response |  -  |
**0** | unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **schedule_task**
> AssignedTask schedule_task()

Obtain a new task to execute

### Example

* Basic Authentication (worker_auth):

```python
import time
import flamenco.manager
from flamenco.manager.api import worker_api
from flamenco.manager.model.worker_state_change import WorkerStateChange
from flamenco.manager.model.security_error import SecurityError
from flamenco.manager.model.assigned_task import AssignedTask
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure HTTP basic authorization: worker_auth
configuration = flamenco.manager.Configuration(
    username = 'YOUR_USERNAME',
    password = 'YOUR_PASSWORD'
)

# Enter a context with an instance of the API client
with flamenco.manager.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = worker_api.WorkerApi(api_client)

    # example, this endpoint has no required or optional parameters
    try:
        # Obtain a new task to execute
        api_response = api_instance.schedule_task()
        pprint(api_response)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerApi->schedule_task: %s\n" % e)
```


### Parameters
This endpoint does not need any parameter.

### Return type

[**AssignedTask**](AssignedTask.md)

### Authorization

[worker_auth](../README.md#worker_auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | No tasks available for this Worker. |  -  |
**200** | Task to execute. |  -  |
**403** | Permission Denied |  -  |
**409** | Worker is not in the active state, so is not allowed to execute tasks right now. |  -  |
**423** | Worker cannot obtain new tasks, but must go to another state. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sign_off**
> sign_off()

Mark the worker as offline

### Example

* Basic Authentication (worker_auth):

```python
import time
import flamenco.manager
from flamenco.manager.api import worker_api
from flamenco.manager.model.error import Error
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure HTTP basic authorization: worker_auth
configuration = flamenco.manager.Configuration(
    username = 'YOUR_USERNAME',
    password = 'YOUR_PASSWORD'
)

# Enter a context with an instance of the API client
with flamenco.manager.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = worker_api.WorkerApi(api_client)

    # example, this endpoint has no required or optional parameters
    try:
        # Mark the worker as offline
        api_instance.sign_off()
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerApi->sign_off: %s\n" % e)
```


### Parameters
This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

[worker_auth](../README.md#worker_auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | normal response |  -  |
**0** | unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sign_on**
> WorkerStateChange sign_on(worker_sign_on)

Authenticate & sign in the worker.

### Example

* Basic Authentication (worker_auth):

```python
import time
import flamenco.manager
from flamenco.manager.api import worker_api
from flamenco.manager.model.error import Error
from flamenco.manager.model.worker_state_change import WorkerStateChange
from flamenco.manager.model.worker_sign_on import WorkerSignOn
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure HTTP basic authorization: worker_auth
configuration = flamenco.manager.Configuration(
    username = 'YOUR_USERNAME',
    password = 'YOUR_PASSWORD'
)

# Enter a context with an instance of the API client
with flamenco.manager.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = worker_api.WorkerApi(api_client)
    worker_sign_on = WorkerSignOn(
        name="name_example",
        supported_task_types=[
            "supported_task_types_example",
        ],
        software_version="software_version_example",
        can_restart=True,
    ) # WorkerSignOn | Worker metadata

    # example passing only required values which don't have defaults set
    try:
        # Authenticate & sign in the worker.
        api_response = api_instance.sign_on(worker_sign_on)
        pprint(api_response)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerApi->sign_on: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **worker_sign_on** | [**WorkerSignOn**](WorkerSignOn.md)| Worker metadata |

### Return type

[**WorkerStateChange**](WorkerStateChange.md)

### Authorization

[worker_auth](../README.md#worker_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | normal response |  -  |
**0** | unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **task_output_produced**
> task_output_produced(task_id, body)

Store the most recently rendered frame here. Note that it is up to the Worker to ensure this is in a format that's digestable by the Manager. Currently only PNG and JPEG support is planned. 

### Example

* Basic Authentication (worker_auth):

```python
import time
import flamenco.manager
from flamenco.manager.api import worker_api
from flamenco.manager.model.error import Error
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure HTTP basic authorization: worker_auth
configuration = flamenco.manager.Configuration(
    username = 'YOUR_USERNAME',
    password = 'YOUR_PASSWORD'
)

# Enter a context with an instance of the API client
with flamenco.manager.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = worker_api.WorkerApi(api_client)
    task_id = "task_id_example" # str | 
    body = open('/path/to/file', 'rb') # file_type | Contents of the file

    # example passing only required values which don't have defaults set
    try:
        # Store the most recently rendered frame here. Note that it is up to the Worker to ensure this is in a format that's digestable by the Manager. Currently only PNG and JPEG support is planned. 
        api_instance.task_output_produced(task_id, body)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerApi->task_output_produced: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **task_id** | **str**|  |
 **body** | **file_type**| Contents of the file |

### Return type

void (empty response body)

### Authorization

[worker_auth](../README.md#worker_auth)

### HTTP request headers

 - **Content-Type**: image/jpeg, image/png
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**202** | The file was accepted for processing. |  -  |
**411** | Length required; the client did not send a Content-Length header. |  -  |
**413** | Payload too large. |  -  |
**415** | Unsupported Media Type, the image format cannot be processed by the Manager. |  -  |
**429** | The client is sending too many frames, and should throttle itself. |  -  |
**0** | unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **task_update**
> task_update(task_id, task_update)

Update the task, typically to indicate progress, completion, or failure.

### Example

* Basic Authentication (worker_auth):

```python
import time
import flamenco.manager
from flamenco.manager.api import worker_api
from flamenco.manager.model.error import Error
from flamenco.manager.model.task_update import TaskUpdate
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure HTTP basic authorization: worker_auth
configuration = flamenco.manager.Configuration(
    username = 'YOUR_USERNAME',
    password = 'YOUR_PASSWORD'
)

# Enter a context with an instance of the API client
with flamenco.manager.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = worker_api.WorkerApi(api_client)
    task_id = "task_id_example" # str | 
    task_update = TaskUpdate(
        task_status=TaskStatus("active"),
        activity="activity_example",
        log="log_example",
    ) # TaskUpdate | Task update information

    # example passing only required values which don't have defaults set
    try:
        # Update the task, typically to indicate progress, completion, or failure.
        api_instance.task_update(task_id, task_update)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerApi->task_update: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **task_id** | **str**|  |
 **task_update** | [**TaskUpdate**](TaskUpdate.md)| Task update information |

### Return type

void (empty response body)

### Authorization

[worker_auth](../README.md#worker_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | The update was accepted. |  -  |
**409** | The task is assigned to another worker, so the update was not accepted. |  -  |
**0** | unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **worker_state**
> WorkerStateChange worker_state()



### Example

* Basic Authentication (worker_auth):

```python
import time
import flamenco.manager
from flamenco.manager.api import worker_api
from flamenco.manager.model.error import Error
from flamenco.manager.model.worker_state_change import WorkerStateChange
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure HTTP basic authorization: worker_auth
configuration = flamenco.manager.Configuration(
    username = 'YOUR_USERNAME',
    password = 'YOUR_PASSWORD'
)

# Enter a context with an instance of the API client
with flamenco.manager.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = worker_api.WorkerApi(api_client)

    # example, this endpoint has no required or optional parameters
    try:
        api_response = api_instance.worker_state()
        pprint(api_response)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerApi->worker_state: %s\n" % e)
```


### Parameters
This endpoint does not need any parameter.

### Return type

[**WorkerStateChange**](WorkerStateChange.md)

### Authorization

[worker_auth](../README.md#worker_auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | no state change requested |  -  |
**200** | state change requested |  -  |
**0** | unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **worker_state_changed**
> worker_state_changed(worker_state_changed)

Worker changed state. This could be as acknowledgement of a Manager-requested state change, or in response to worker-local signals.

### Example

* Basic Authentication (worker_auth):

```python
import time
import flamenco.manager
from flamenco.manager.api import worker_api
from flamenco.manager.model.error import Error
from flamenco.manager.model.worker_state_changed import WorkerStateChanged
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure HTTP basic authorization: worker_auth
configuration = flamenco.manager.Configuration(
    username = 'YOUR_USERNAME',
    password = 'YOUR_PASSWORD'
)

# Enter a context with an instance of the API client
with flamenco.manager.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = worker_api.WorkerApi(api_client)
    worker_state_changed = WorkerStateChanged(
        status=WorkerStatus("starting"),
    ) # WorkerStateChanged | New worker state

    # example passing only required values which don't have defaults set
    try:
        # Worker changed state. This could be as acknowledgement of a Manager-requested state change, or in response to worker-local signals.
        api_instance.worker_state_changed(worker_state_changed)
    except flamenco.manager.ApiException as e:
        print("Exception when calling WorkerApi->worker_state_changed: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **worker_state_changed** | [**WorkerStateChanged**](WorkerStateChanged.md)| New worker state |

### Return type

void (empty response body)

### Authorization

[worker_auth](../README.md#worker_auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | normal response |  -  |
**0** | unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

