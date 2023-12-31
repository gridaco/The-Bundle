import os
import click
import subprocess
import zipfile
import tarfile
import shutil
import tempfile
import numpy as np
import imageio
from apng import APNG
from pathlib import Path
from PIL import Image

from dmt.src.blender import blenderpath


n_white = 255
n_black = 0


def pngs_to_gif(png_dir, gif_path):
    # Get all PNG images in the directory
    png_files = sorted([os.path.join(png_dir, f)
                       for f in os.listdir(png_dir) if f.endswith('.png')])

    # Create a white background
    first_image = imageio.imread(png_files[0])
    height, width, _ = first_image.shape
    # white background, adjust as needed
    background = np.full((height, width, 3), n_black, dtype=np.uint8)

    # Read all images
    images = [composite_image_with_background(
        png_file, background) for png_file in png_files]

    # Save as GIF
    imageio.mimsave(gif_path, images, loop=0)


def composite_image_with_background(png_path, background):
    # Read the image
    img = imageio.imread(png_path)

    # If the image has an alpha channel, composite it over the background
    if img.shape[2] == 4:
        alpha = img[..., 3:4] / 255
        img_rgb = img[..., :3]
        bg_rgb = background[..., :3]
        composite = img_rgb * alpha + bg_rgb * (1 - alpha)
        return composite.astype(np.uint8)
    else:
        return img


def pngs_to_apng(input_dir, output_filepath):
    # Sort the images by name to ensure they're in the correct order
    image_filenames = sorted(filename for filename in os.listdir(
        input_dir) if filename.endswith('.png'))

    # Create file paths
    filepaths = [os.path.join(input_dir, filename)
                 for filename in image_filenames]

    # Create the APNG
    apng = APNG()
    for filepath in filepaths:
        apng.append_file(filepath, delay=100)  # Delay in milliseconds

    # Save the APNG
    apng.save(output_filepath)


def load_template(template):
    """
    Loads the required template files from a dedicated template directory either archived as .zip or .tar.gz, or a root directory with required files as a copy to the tmp dir for manipulation.
    Currently supported:
    - template.zip
    - template.tar.gz
    """

    # Check which archive is available
    archive_gz = os.path.join(template, 'template.tar.gz')
    archive_zip = os.path.join(template, 'template.zip')

    tmp = tempfile.mkdtemp()

    if os.path.exists(archive_gz):
        return load_template_gz(archive_gz, to=tmp)
    elif os.path.exists(archive_zip):
        return load_template_zip(archive_zip, to=tmp)
    else:
        raise ValueError(
            f"No supported archive found in the given template directory - {template}")


def load_template_gz(archive_gz, to):

    with tarfile.open(archive_gz, 'r:gz') as tar:
        tar.extractall(to)

        # If the root content isn't named "template", rename it
        extracted_folder_name = tar.getnames()[0].split('/')[0]
        extracted_folder_path = os.path.join(to, extracted_folder_name)
        template_folder_path = os.path.join(to, "template")

        if not os.path.exists(template_folder_path):
            os.rename(extracted_folder_path, template_folder_path)

    blendfile = os.path.join(to, 'template', 'scene.blend')
    return blendfile


def load_template_zip(archive_zip, to):
    with zipfile.ZipFile(archive_zip, 'r') as zip_ref:
        zip_ref.extractall(to)

        # If the root content isn't named "template", rename it
        extracted_folder_name = zip_ref.namelist()[0].split('/')[0]
        extracted_folder_path = os.path.join(to, extracted_folder_name)
        template_folder_path = os.path.join(to, "template")

        if not os.path.exists(template_folder_path):
            os.rename(extracted_folder_path, template_folder_path)

    blendfile = os.path.join(to, 'template', 'scene.blend')
    return blendfile


@click.command()
@click.option('-t', '--template', type=click.Path(exists=True, file_okay=False, dir_okay=True), required=True, help="Path to the template dir")
@click.option('-d', '--data', type=click.Path(exists=True, file_okay=True, dir_okay=False), required=True, help="New text content")
@click.option('-c', '--config', required=False, help="config as json file path")
@click.option('-r', '--request', required=False, help="render request as json file path")
@click.option('-o', '--out', type=click.Path(), required=True, help="Path to the output file")
@click.option('-b', '--blender', default=blenderpath(), help="Path to the Blender executable")
def main(template, data, config, request, out, blender):

    file = load_template(template)
    print('tmp file available at', file)

    # use env vars to pass arguments to the blender script
    os.environ['DMT_BLENDER_FILE'] = file
    os.environ['DMT_DATA_FILE'] = data
    os.environ['DMT_OUTPUT_PATH'] = out
    if config:
        os.environ['DMT_CONFIG'] = config
    if request:
        os.environ['DMT_REQUEST_FILE'] = request

    # Call Blender with subprocess
    blender_script = os.path.join(os.path.dirname(
        os.path.realpath(__file__)), 'main.py')
    subprocess.run([blender, "-b", "-P", blender_script], check=True)

    outdir = Path(os.path.dirname(out))
    # create dist dir
    (outdir / 'dist').mkdir(parents=True, exist_ok=True)

    # optimzie pngs
    for png in outdir.glob('*.png'):
        img = Image.open(png)
        img.save(png, optimize=True)

    # try:
    #     # Post processing: create a GIF from the rendered images
    #     pngs_to_gif(outdir, outdir / 'dist/anim.gif')
    #     pngs_to_apng(outdir, outdir / 'dist/anim.png')
    # except:
    #     ...

    # remove tmp dir
    # get parent dir of tmp file
    try:
        tmpdir = Path(file).parent
        shutil.rmtree(tmpdir)
    except:
        ...


if __name__ == '__main__':
    main()
