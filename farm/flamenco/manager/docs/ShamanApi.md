# flamenco.manager.ShamanApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**shaman_checkout**](ShamanApi.md#shaman_checkout) | **POST** /api/v3/shaman/checkout/create | Create a directory, and symlink the required files into it. The files must all have been uploaded to Shaman before calling this endpoint.
[**shaman_checkout_requirements**](ShamanApi.md#shaman_checkout_requirements) | **POST** /api/v3/shaman/checkout/requirements | Checks a Shaman Requirements file, and reports which files are unknown.
[**shaman_file_store**](ShamanApi.md#shaman_file_store) | **POST** /api/v3/shaman/files/{checksum}/{filesize} | Store a new file on the Shaman server. Note that the Shaman server can forcibly close the HTTP connection when another client finishes uploading the exact same file, to prevent double uploads. The file&#39;s contents should be sent in the request body. 
[**shaman_file_store_check**](ShamanApi.md#shaman_file_store_check) | **GET** /api/v3/shaman/files/{checksum}/{filesize} | Check the status of a file on the Shaman server. 


# **shaman_checkout**
> ShamanCheckoutResult shaman_checkout(shaman_checkout)

Create a directory, and symlink the required files into it. The files must all have been uploaded to Shaman before calling this endpoint.

### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import shaman_api
from flamenco.manager.model.error import Error
from flamenco.manager.model.shaman_checkout import ShamanCheckout
from flamenco.manager.model.shaman_checkout_result import ShamanCheckoutResult
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = shaman_api.ShamanApi(api_client)
    shaman_checkout = ShamanCheckout(
        files=[
            ShamanFileSpec(
                sha="sha_example",
                size=1,
                path="path_example",
            ),
        ],
        checkout_path="checkout_path_example",
    ) # ShamanCheckout | Set of files to check out.

    # example passing only required values which don't have defaults set
    try:
        # Create a directory, and symlink the required files into it. The files must all have been uploaded to Shaman before calling this endpoint.
        api_response = api_instance.shaman_checkout(shaman_checkout)
        pprint(api_response)
    except flamenco.manager.ApiException as e:
        print("Exception when calling ShamanApi->shaman_checkout: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shaman_checkout** | [**ShamanCheckout**](ShamanCheckout.md)| Set of files to check out. |

### Return type

[**ShamanCheckoutResult**](ShamanCheckoutResult.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Checkout was created succesfully. |  -  |
**424** | There were files missing. Use &#x60;shamanCheckoutRequirements&#x60; to figure out which ones. |  -  |
**409** | Checkout already exists. |  -  |
**0** | unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **shaman_checkout_requirements**
> ShamanRequirementsResponse shaman_checkout_requirements(shaman_requirements_request)

Checks a Shaman Requirements file, and reports which files are unknown.

### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import shaman_api
from flamenco.manager.model.shaman_requirements_request import ShamanRequirementsRequest
from flamenco.manager.model.error import Error
from flamenco.manager.model.shaman_requirements_response import ShamanRequirementsResponse
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = shaman_api.ShamanApi(api_client)
    shaman_requirements_request = ShamanRequirementsRequest(
        files=[
            ShamanFileSpec(
                sha="sha_example",
                size=1,
                path="path_example",
            ),
        ],
    ) # ShamanRequirementsRequest | Set of files to check

    # example passing only required values which don't have defaults set
    try:
        # Checks a Shaman Requirements file, and reports which files are unknown.
        api_response = api_instance.shaman_checkout_requirements(shaman_requirements_request)
        pprint(api_response)
    except flamenco.manager.ApiException as e:
        print("Exception when calling ShamanApi->shaman_checkout_requirements: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shaman_requirements_request** | [**ShamanRequirementsRequest**](ShamanRequirementsRequest.md)| Set of files to check |

### Return type

[**ShamanRequirementsResponse**](ShamanRequirementsResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Subset of the posted requirements, indicating the unknown files. |  -  |
**0** | unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **shaman_file_store**
> shaman_file_store(checksum, filesize, body)

Store a new file on the Shaman server. Note that the Shaman server can forcibly close the HTTP connection when another client finishes uploading the exact same file, to prevent double uploads. The file's contents should be sent in the request body. 

### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import shaman_api
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
    api_instance = shaman_api.ShamanApi(api_client)
    checksum = "checksum_example" # str | SHA256 checksum of the file.
    filesize = 1 # int | Size of the file in bytes.
    body = open('/path/to/file', 'rb') # file_type | Contents of the file
    x_shaman_can_defer_upload = True # bool | The client indicates that it can defer uploading this file. The \"208\" response will not only be returned when the file is already fully known to the Shaman server, but also when someone else is currently uploading this file.  (optional)
    x_shaman_original_filename = "X-Shaman-Original-Filename_example" # str | The original filename. If sent along with the request, it will be included in the server logs, which can aid in debugging.  (optional)

    # example passing only required values which don't have defaults set
    try:
        # Store a new file on the Shaman server. Note that the Shaman server can forcibly close the HTTP connection when another client finishes uploading the exact same file, to prevent double uploads. The file's contents should be sent in the request body. 
        api_instance.shaman_file_store(checksum, filesize, body)
    except flamenco.manager.ApiException as e:
        print("Exception when calling ShamanApi->shaman_file_store: %s\n" % e)

    # example passing only required values which don't have defaults set
    # and optional values
    try:
        # Store a new file on the Shaman server. Note that the Shaman server can forcibly close the HTTP connection when another client finishes uploading the exact same file, to prevent double uploads. The file's contents should be sent in the request body. 
        api_instance.shaman_file_store(checksum, filesize, body, x_shaman_can_defer_upload=x_shaman_can_defer_upload, x_shaman_original_filename=x_shaman_original_filename)
    except flamenco.manager.ApiException as e:
        print("Exception when calling ShamanApi->shaman_file_store: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **checksum** | **str**| SHA256 checksum of the file. |
 **filesize** | **int**| Size of the file in bytes. |
 **body** | **file_type**| Contents of the file |
 **x_shaman_can_defer_upload** | **bool**| The client indicates that it can defer uploading this file. The \&quot;208\&quot; response will not only be returned when the file is already fully known to the Shaman server, but also when someone else is currently uploading this file.  | [optional]
 **x_shaman_original_filename** | **str**| The original filename. If sent along with the request, it will be included in the server logs, which can aid in debugging.  | [optional]

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/octet-stream
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | The file was accepted. |  -  |
**208** | The file was already known to the server. |  -  |
**417** | There was a mismatch between the request parameters and the actual file size or checksum of the uploaded file.  |  -  |
**425** | Client should defer uploading this file. The file is currently in the process of being uploaded by someone else, and &#x60;X-Shaman-Can-Defer-Upload: true&#x60; was sent in the request.  |  -  |
**0** | unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **shaman_file_store_check**
> ShamanSingleFileStatus shaman_file_store_check(checksum, filesize)

Check the status of a file on the Shaman server. 

### Example


```python
import time
import flamenco.manager
from flamenco.manager.api import shaman_api
from flamenco.manager.model.error import Error
from flamenco.manager.model.shaman_single_file_status import ShamanSingleFileStatus
from pprint import pprint
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = shaman_api.ShamanApi(api_client)
    checksum = "checksum_example" # str | SHA256 checksum of the file.
    filesize = 1 # int | Size of the file in bytes.

    # example passing only required values which don't have defaults set
    try:
        # Check the status of a file on the Shaman server. 
        api_response = api_instance.shaman_file_store_check(checksum, filesize)
        pprint(api_response)
    except flamenco.manager.ApiException as e:
        print("Exception when calling ShamanApi->shaman_file_store_check: %s\n" % e)
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **checksum** | **str**| SHA256 checksum of the file. |
 **filesize** | **int**| Size of the file in bytes. |

### Return type

[**ShamanSingleFileStatus**](ShamanSingleFileStatus.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Normal response. |  -  |
**0** | unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

