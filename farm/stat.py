import sys
import click
import os
import bpy
from tqdm import tqdm
from pathlib import Path
from flamenco.manager import ApiClient, Configuration
from flamenco.manager.apis import JobsApi
from flamenco.manager.models import FlamencoVersion

configuration = Configuration(host="http://192.168.0.6:8080")
api_client = ApiClient(configuration)
api = JobsApi(api_client)


res = api.query_jobs(
    {
        "limit": 1,
        "metadata": {
            "project": "The Bundle",
            # "material": "Marble"
        },
        "status_in": [
            # "active",
            "queued",
            # "failed"
        ],
    }
)

print(res)
