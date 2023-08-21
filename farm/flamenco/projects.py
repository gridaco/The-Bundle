# SPDX-License-Identifier: GPL-3.0-or-later
# <pep8 compliant>

from pathlib import Path
from typing import Callable, TypeAlias
import dataclasses


def for_blendfile(blendfile: Path, strategy: str) -> Path:
    """Return what is considered to be the project directory containing the given file.

    If none can be found, the directory containing the current blend file is returned.
    If the current blend file has no path (because it was not saved), a ValueError is raised.

    :param blendfile: the path of the blend file for which to find the project.
    :param strategy: the name of the finder to use, see `finders`.
    """
    if blendfile.is_dir():
        msg = f"{blendfile} is not a blend file, cannot find project directory"
        raise ValueError(msg)

    try:
        finder_info = finders[strategy]
    except KeyError:
        msg = f"Unknown strategy {strategy!r}, cannot find project directory"
        raise ValueError(msg) from None

    return finder_info.finder(blendfile)


def _finder_blender_project(blendfile: Path) -> Path:
    return _search_path_marker(blendfile, ".blender_project")


def _finder_git(blendfile: Path) -> Path:
    return _search_path_marker(blendfile, ".git")


def _finder_subversion(blendfile: Path) -> Path:
    return _search_path_marker(blendfile, ".svn")


def _search_path_marker(blendfile: Path, marker_path: str) -> Path:
    """Go up the directory hierarchy until a file or directory 'marker_path' is found."""

    blendfile_dir = blendfile.absolute().parent

    directory = blendfile_dir
    while True:
        marker: Path = directory / marker_path
        if marker.exists():
            return directory

        parent = directory.parent
        if directory == parent:
            # If a directory is its own parent, we're at the root and cannot go
            # up further.
            break
        directory = parent

    # Could not find the marker, so use the directory containing the blend file.
    return blendfile_dir


Finder: TypeAlias = Callable[[Path], Path]


@dataclasses.dataclass
class FinderInfo:
    label: str
    description: str
    finder: Finder


finders: dict[str, FinderInfo] = {
    "BLENDER_PROJECT": FinderInfo(
        "Blender Project",
        "Find a .blend_project directory and use that as indicator for the top level project directory.",
        _finder_blender_project,
    ),
    "GIT": FinderInfo(
        "Git",
        "Find a .git directory and use that as indicator for the top level project directory.",
        _finder_git,
    ),
    "SUBVERSION": FinderInfo(
        "Subversion",
        "Find a .svn directory and use that as indicator for the top level project directory.",
        _finder_subversion,
    ),
}
