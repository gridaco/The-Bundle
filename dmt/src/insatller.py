import os
import subprocess
from dmt.src.blender import blenderpath


if __name__ == "__main__":
    blender = blenderpath()
    blender_script = os.path.join(os.path.dirname(
        os.path.realpath(__file__)), 'requirements.py')
    subprocess.run([blender, "-b", "-P", blender_script], check=True)
