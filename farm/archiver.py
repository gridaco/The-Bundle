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

            # Create a symlink in the destination directory
            dst_path.symlink_to(target_path)


def symlink_to_actual_safe(symlink_path: Path):
    """
    Safely replace a symlink with the actual file it points to.

    :param symlink_path: Path to the symlink.
    """
    if not symlink_path.is_symlink():
        raise ValueError(f"{symlink_path} is not a symlink.")

    # Get the actual file path that the symlink points to
    target_path = Path(symlink_path.resolve())

    # Rename the symlink to {original-name}.tmp
    tmp_path = symlink_path.with_suffix('.tmp')
    symlink_path.rename(tmp_path)

    try:
        # Copy the actual file to the symlink's location
        shutil.copy2(target_path, symlink_path)
    except Exception as e:
        # If there's an error, revert the symlink name
        tmp_path.rename(symlink_path)
        raise e

    # After successful copy, remove the temporary symlink
    tmp_path.unlink()


def render_symlinks(dir: Path):
    """
    Replace all symlinks in a directory and its subdirectories with the actual files they point to.

    :param dir: Path to the directory.
    """
    if not dir.exists():
        raise ValueError(f"{dir} does not exist.")

    # List all items in directory recursively
    all_files = list(dir.rglob('*'))

    # Ensure all files are symlinks
    if not all(file.is_symlink() for file in all_files):
        raise ValueError(f"{dir} contains non-symlink files.")

    # Process each symlink file
    for symlink_path in tqdm(all_files, desc="Rendering symlinks"):
        symlink_to_actual_safe(symlink_path)


# # Usage example for render_symlinks
# dir_path = Path('/path/to/directory')
# render_symlinks(dir_path)


@click.command()
@click.argument('src_dir', type=click.Path(exists=True))
@click.argument('dst_dir', type=click.Path())
@click.option('--pattern', default='*', help='Glob pattern to filter files.')
@click.option('--renamer-script', type=click.Path(exists=True), help='Path to Python script containing renamer function, called "def rename(...)".')
@click.option('--frames-profile', type=click.Path(exists=True), help='Path to frames profile json file, where it is used to reference the frame number to the frame data, used when renaming the files.')
def main(src_dir, dst_dir, pattern, renamer_script, frames_profile):
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


if __name__ == '__main__':
    # Example usage.
    # python archiver.py ./a ./b --pattern "*.png" --renamer-script renamers/frame_to_angle.py

    main()
