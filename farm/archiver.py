import json
from pathlib import Path
import shutil
from tqdm import tqdm
import importlib.util
import click


def sync_symlinks(src_dir: Path, dst_dir: Path, pattern: str, renamer, absolute=True, relative_to: Path = None):
    """
    Create symlinks in dst_dir to items in src_dir, renaming them using the provided renamer function.

    :param src_dir: Source directory to list items from.
    :param dst_dir: Destination directory to create symlinks in.
    :param pattern: Glob pattern to match files.
    :param renamer: Function to rename items. Accepts the original name, returns the new name.
    :param absolute: Boolean indicating whether to create an absolute or relative symlink.
    :param relative_to: Path relative to which the symlink will be created.
    """

    # Ensure destination directory exists
    dst_dir.mkdir(parents=True, exist_ok=True)

    # List all items in source directory recursively and filter them by pattern
    for item in tqdm(src_dir.rglob(pattern), desc='Syncing symlinks'):
        if item.is_file():

            # Determine the nested structure within src_dir
            relative_path = item.relative_to(src_dir)

            # Rename using the renamer function
            renamed_item = renamer(item)

            # Create the nested directory structure within dst_dir
            nested_dst_dir = dst_dir / relative_path.parent
            nested_dst_dir.mkdir(parents=True, exist_ok=True)
            dst_path = nested_dst_dir / renamed_item

            # Decide the target for the symlink
            if absolute:
                target_path = item.resolve()
            else:
                if relative_to is None:
                    relative_to = src_dir.parent
                target_path = Path(item.resolve()).relative_to(
                    relative_to.resolve())

            # Create a symlink in the destination directory, if it doesn't already exist
            if not dst_path.exists():
                dst_path.symlink_to(target_path)

            tqdm.write(f"☑️ {dst_path} → {target_path}")


def symlink_to_actual(symlink_path: Path, output_dir: Path = None, relative_to: Path = None):
    """
    Replace a symlink with the actual file it points to or copy it to output_dir.

    :param symlink_path: Path to the symlink.
    :param output_dir: Optional output directory.
    """
    if not symlink_path.is_symlink():
        raise ValueError(f"{symlink_path} is not a symlink.")

    target_path = symlink_path.resolve()

    if output_dir:
        relative_path = symlink_path.relative_to(relative_to)
        actual_output_dir = output_dir / relative_path.parent
        actual_output_dir.mkdir(parents=True, exist_ok=True)
        output_file_path = actual_output_dir / symlink_path.name

        # Skip if the file already exists
        if output_file_path.exists():
            return

        shutil.copy2(target_path, output_file_path)
        return output_file_path

    else:
        tmp_path = symlink_path.with_suffix('.tmp')
        symlink_path.rename(tmp_path)

        try:
            shutil.copy2(target_path, symlink_path)
        except Exception as e:
            tmp_path.rename(symlink_path)
            raise e

        tmp_path.unlink()
        return symlink_path


@click.command()
@click.argument('src_dir', type=click.Path(exists=True))
@click.argument('dst_dir', type=click.Path())
@click.option('--pattern', default='*', help='Glob pattern to filter files.')
@click.option('--renamer-script', type=click.Path(exists=True), help='Path to Python script containing renamer function, called "def rename(...)".')
@click.option('--frames-profile', type=click.Path(exists=True), help='Path to frames profile json file, where it is used to reference the frame number to the frame data, used when renaming the files.')
def stage(src_dir, dst_dir, pattern, renamer_script, frames_profile):
    """
    Create symlinks in DST_DIR to items in SRC_DIR, renaming them using the provided renamer function.
    """

    frames_profile = json.load(
        open(frames_profile)) if frames_profile else None

    if renamer_script is None:
        def renamer(x): return x
    else:
        # Dynamically import the renamer function
        spec = importlib.util.spec_from_file_location(
            'renamer_module', renamer_script)
        renamer_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(renamer_module)

        # Check if the function 'rename' exists in the imported module
        if not hasattr(renamer_module, 'rename'):
            raise ValueError(
                f"The script {renamer_script} must contain a function named 'rename'.")

        def renamer(x): return renamer_module.rename(x, frames_profile)

    # Execute the symlink_with_rename function
    src_dir = Path(src_dir)
    dst_dir = Path(dst_dir)
    sync_symlinks(src_dir, dst_dir, pattern, renamer)


@click.command()
@click.argument('dir', type=Path)
@click.option('--output', '-o', type=Path, help='Optional output directory.')
def render(dir: Path, output: Path):
    """
    Replace all symlinks in a directory and its subdirectories with the actual files they point to.

    :param dir: Path to the directory.
    :param output: Optional output directory.
    """
    if not dir.exists():
        raise ValueError(f"{dir} does not exist.")

    all_files = list(dir.rglob('*'))

    if output and not output.exists():
        output.mkdir(parents=True, exist_ok=True)

    for symlink_path in tqdm(all_files, desc="Rendering symlinks"):
        if symlink_path.is_symlink():
            res = symlink_to_actual(symlink_path, output, dir)
            if res:
                tqdm.write(f"☑️ {symlink_path} → {res}")
            else:
                tqdm.write(f"☐ {symlink_path}")
        else:
            tqdm.write(f"☒ {symlink_path}")


@click.group()
def cli():
    pass


cli.add_command(stage)
cli.add_command(render)

if __name__ == '__main__':
    # Example usage.
    # python archiver.py stage ./a ./b --pattern "*.png" --renamer-script renamers/frame_to_angle.py
    # python archiver.py render ./b --output ./c

    cli()
