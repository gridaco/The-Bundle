from pathlib import Path
import click
from PIL import Image
from tqdm import tqdm


def optimize_image(image_path, output_path, quality=95):
    """Optimizes a given image."""
    with Image.open(image_path) as img:
        # check if image file is a lossless format
        if img.format == 'PNG':
            # optimize PNGs
            img.save(output_path, optimize=True)
        else:
            img.save(output_path, optimize=True, quality=quality)


@click.command()
@click.argument('target_directory', type=click.Path(exists=True))
@click.option('-o', '--output', default=None, help='Output directory for optimized images.')
@click.option('--pattern', default='*.png', help='Glob pattern to match filenames.')
@click.option('--quality', default=95, help='Quality for optimization, ignored for PNGs.', type=int)
@click.option('--recursive', is_flag=True, help='Search for files recursively.')
@click.option('--overwrite', is_flag=True, help='Allow overwrite in same directory. not safe, only use when testing or small set of files.')
def main(target_directory, output, pattern, quality, recursive, overwrite):
    """
    Optimize all images matching the pattern in the target directory and its subdirectories.
    """
    target_path = Path(target_directory)
    output_path = Path(output) if output else target_path
    output_path.mkdir(parents=True, exist_ok=True)

    # assert overwrite - if same directory is provided, user must explicitly allow overwrite
    if target_path == output_path and not overwrite:
        raise click.UsageError(
            'Output directory is the same as target directory. Use --overwrite to allow.')

    if recursive:
        matching_files = list(target_path.rglob(pattern))
    else:
        matching_files = list(target_path.glob(pattern))

    # Show the progress bar while optimizing
    with tqdm(total=len(matching_files), dynamic_ncols=True) as pbar:
        for img_file in matching_files:
            rel_path = img_file.relative_to(target_path)
            save_to = output_path / rel_path

            # check if already optimized (if not overwrite)
            if not overwrite:
                if save_to.exists():
                    tqdm.write(f'☑ Skipped: {rel_path}')
                    pbar.update(1)
                    continue

            # create parent directories if they don't exist
            save_to.parent.mkdir(parents=True, exist_ok=True)
            size_a = img_file.stat().st_size
            optimize_image(img_file, save_to, quality)
            size_b = img_file.stat().st_size
            size_c = size_a - size_b
            size_c_kb = size_c / 1024
            tqdm.write(
                f'☑ Saved: {size_c_kb}kb | {rel_path} | {size_a} >> {size_b}')
            pbar.update(1)


if __name__ == '__main__':
    """
    Optimize Image Files
    --------------------
    This script is used to optimize image files in a specified directory.
    The script can search recursively through subdirectories if specified.

    Dependencies:
    - Pillow for image processing.
    - click for CLI argument handling.
    - tqdm for the progress bar.

    Example Usage:
    - To optimize all PNG files in a folder (non-recursive):
        python optimize_images.py /path/to/target/directory --pattern *.png

    - To optimize all JPG files in a folder and its subfolders (recursive):
        python optimize_images.py /path/to/target/directory --pattern *.jpg --quality 95 --recursive
    """
    main()
