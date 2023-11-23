import time
import flamenco.manager
from flamenco.manager.api import shaman_api
from flamenco.manager.model.error import Error
# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = flamenco.manager.Configuration(
    host="http://localhost"
)


# Enter a context with an instance of the API client
with flamenco.manager.ApiClient() as api_client:
    # Create an instance of the API class
    api_instance = shaman_api.ShamanApi(api_client)
    checksum = "checksum_example"  # str | SHA256 checksum of the file.
    filesize = 1  # int | Size of the file in bytes.
    body = open('/path/to/file', 'rb')  # file_type | Contents of the file
    # bool | The client indicates that it can defer uploading this file. The \"208\" response will not only be returned when the file is already fully known to the Shaman server, but also when someone else is currently uploading this file.  (optional)
    x_shaman_can_defer_upload = True
    # str | The original filename. If sent along with the request, it will be included in the server logs, which can aid in debugging.  (optional)
    x_shaman_original_filename = "X-Shaman-Original-Filename_example"

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
        api_instance.shaman_file_store(checksum, filesize, body, x_shaman_can_defer_upload=x_shaman_can_defer_upload,
                                       x_shaman_original_filename=x_shaman_original_filename)
    except flamenco.manager.ApiException as e:
        print("Exception when calling ShamanApi->shaman_file_store: %s\n" % e)
