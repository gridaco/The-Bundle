# Setup blender python

# Install requirements to blender python

import os
import subprocess
import sys

__dir = os.path.dirname(os.path.realpath(__file__))
__requirements = os.path.join(__dir, '..', 'requirements.txt')


def pip_install_requirements():
    """
    A pip install for blender's bundled python.
    """
    bin = os.path.join(sys.prefix, 'bin')
    # find the python executable under the bin folder
    # for instance, blender 3.6, it's named ~/bin/python3.10
    python_exe = None
    for file in os.listdir(bin):
        if file.startswith('python'):
            python_exe = os.path.join(bin, file)
            break

    # upgrade pip
    subprocess.call([python_exe, "-m", "ensurepip"])
    subprocess.call([python_exe, "-m", "pip", "install", "--upgrade", "pip"])

    # install required packages
    subprocess.call([python_exe, "-m", "pip", "install",
                    "-r", __requirements])


if __name__ == "__main__":
    # this should be executed via cli.py for setup, once.
    pip_install_requirements()
