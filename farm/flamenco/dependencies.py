# SPDX-License-Identifier: GPL-3.0-or-later


def preload_modules() -> None:
    """Pre-load the datetime module from a wheel so that the API can find it."""
    import sys

    if "dateutil" in sys.modules:
        return

    from . import wheels

    wheels.load_wheel_global("six", "six")
    wheels.load_wheel_global("dateutil", "python_dateutil")
