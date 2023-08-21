
# flake8: noqa

# Import all APIs into this package.
# If you have many APIs here with many many models used in each API this may
# raise a `RecursionError`.
# In order to avoid this, import only the API that you directly need like:
#
#   from .api.jobs_api import JobsApi
#
# or import this package, but before doing it, use:
#
#   import sys
#   sys.setrecursionlimit(n)

# Import APIs into API package:
from flamenco.manager.api.jobs_api import JobsApi
from flamenco.manager.api.meta_api import MetaApi
from flamenco.manager.api.shaman_api import ShamanApi
from flamenco.manager.api.worker_api import WorkerApi
from flamenco.manager.api.worker_mgt_api import WorkerMgtApi
