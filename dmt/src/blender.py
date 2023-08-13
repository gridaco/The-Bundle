
import platform
import subprocess


def blenderpath():
    # check if blender is callable with "blender"
    try:
        subprocess.run(["blender", "--version"], check=True)
        return "blender"
    except:
        ...

    # otherwise, load
    if platform.system() == 'Darwin':
        return "/Applications/Blender.app/Contents/MacOS/Blender"
    elif platform.system() == 'Linux':
        return "/usr/bin/blender"
    else:
        return "blender"
