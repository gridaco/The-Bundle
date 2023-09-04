import click
import json
import re
import shutil
from zipfile import ZipFile
from pathlib import Path
import logging
import fnmatch
from tqdm import tqdm

logging.basicConfig(level=logging.DEBUG)

__DIR = Path(__file__).parent


def load_json_with_comments(filename):
    with open(filename, 'r') as f:
        lines = f.readlines()
        lines = [line for line in lines if not line.strip().startswith('//')]
        clean_data = ''.join(lines)
    return json.loads(clean_data)


class PackagingProfile:
    data: dict
    packaging: dict
    mapping: dict
    pattern_i: str
    pattern_o: str
    targets: [str]
    files: [str]

    def __init__(self, path: Path):
        self.data = load_json_with_comments(str(path))
        self.pattern_i = self.data.get("pattern").get("i")
        self.pattern_o = self.data.get("pattern").get("o")
        self.packaging = self.data.get("packaging")
        self.mapping = self.data.get("mapping")
        self.targets = self.packaging.get("targets")
        self.files = self.data.get("files")


def render_attatchments(pack: Path, attatchments: [str], target: str, prefix="_"):
    for att in attatchments:
        # resolve it
        # 1. check if the specified path is a file
        # if file, use it as is.
        # if directory, try to resolve it with target.

        att = Path(__DIR / att)
        if att.exists():
            # check if file
            if att.is_file():
                shutil.copyfile(str(att), pack / f"{prefix}{att.name}")

            # if a directory, resolve the file with "target", the name would be the parent name
            if att.is_dir():
                for item in att.iterdir():
                    if item.stem == target:
                        shutil.copy2(
                            item, pack / f"{prefix}{item.parent.name}")


def apply_mapping(mapping, value):
    for pattern, result in mapping.items():
        if fnmatch.fnmatch(value, pattern):
            return result.format(name=value)
    return None


def render_mappings(path: Path, out: Path, objects_mapping: dict, materials_mapping: dict, symlink=True):
    for material_dir in path.iterdir():
        if not material_dir.is_dir():
            continue
        mapped_material = apply_mapping(materials_mapping, material_dir.name)
        if mapped_material is None:
            logging.debug(
                f"Material {material_dir.name} not mapped, skipping.")
            continue

        material_out_path = out / mapped_material
        material_out_path.mkdir(parents=True, exist_ok=True)

        for file in tqdm(material_dir.iterdir(), desc=f'{material_dir.name}'):
            if not file.is_file():
                continue
            filename_parts = file.name.split(',')
            # TODO: make this dynamic referencing the profiles's pattern.i
            object_name = filename_parts[0].strip()
            mapped_object = apply_mapping(objects_mapping, object_name)

            if mapped_object is None:
                logging.debug(f"Object {object_name} not mapped, skipping.")
                continue

            object_out_path = material_out_path / mapped_object
            object_out_path.mkdir(parents=True, exist_ok=True)

            dst = object_out_path / file.name

            if symlink:
                # Create a symlink to the file
                dst.symlink_to(file)
            else:
                # Copy the file to the new location
                shutil.copy(file, dst)


@click.command()
@click.argument("path", type=click.Path(exists=True, file_okay=False))
@click.option("-o", "--out", type=click.Path(exists=False, file_okay=False), help="Path to output the package to")
@click.option("-p", "--profile", type=click.Path(exists=True, file_okay=True), help="Path to a profile to use (.json)")
@click.option("--allow-unknown", is_flag=True, help="Allow unknown files to be packaged")
@click.option("--package-master-file", is_flag=True, help="Package the master file (takes another double storage)")
@click.option("--no-symlink", is_flag=True, help="Don't Use symlink. always copy")
def main(path, out, profile, allow_unknown, package_master_file, no_symlink):
    path = Path(path)

    out = Path(out)
    # assert out dir is empty
    assert not out.exists(), "Output directory must not exist"

    out.mkdir(exist_ok=False, parents=True)

    assert path != out, "Path and out cannot be the same"

    profile = PackagingProfile(Path(profile))

    render_mappings(
        path, out,
        profile.mapping["objects"],
        profile.mapping["materials"],
        symlink=not no_symlink
    )

    # all output packs are double nested directories
    packs = []
    for subdir in out.iterdir():
        if subdir.is_dir():
            for subsubdir in subdir.iterdir():
                if subsubdir.is_dir():
                    packs.append(subsubdir)

    # include attatchments
    for pack in tqdm(packs, desc="Rendering Attatchments"):
        render_attatchments(pack, profile.files, 'pro')

    # archive the packs
    for pack in tqdm(packs, desc="Archiving individual packs"):
        # this will automatically resolve all symlinks
        shutil.make_archive(str(pack), 'zip', str(pack))


if __name__ == "__main__":
    main()
