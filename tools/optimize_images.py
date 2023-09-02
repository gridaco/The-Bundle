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
@click.option('--pattern', default='*.png', help='Glob pattern to match filenames.')
@click.option('--quality', default=95, help='Quality for optimization, ignored for PNGs.', type=int)
@click.option('--recursive', is_flag=True, help='Search for files recursively.')
def main(target_directory, pattern, quality, recursive):
    """
    Optimize all images matching the pattern in the target directory and its subdirectories.
    """
    target_path = Path(target_directory)

    if recursive:
        matching_files = list(target_path.rglob(pattern))
    else:
        matching_files = list(target_path.glob(pattern))

    # Show the progress bar while optimizing
    with tqdm(total=len(matching_files), dynamic_ncols=True) as pbar:
        for img_file in matching_files:
            pbar.set_postfix(file=img_file.name, refresh=True)
            optimize_image(img_file, img_file, quality)
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
