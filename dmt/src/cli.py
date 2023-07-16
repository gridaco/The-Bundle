import click
import os
import subprocess
import platform
import gzip
import tempfile
import numpy as np
import imageio
from apng import APNG
from pathlib import Path

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

n_white = 255
n_black = 0


def pngs_to_gif(png_dir, gif_path):
    # Get all PNG images in the directory
    png_files = sorted([os.path.join(png_dir, f) for f in os.listdir(png_dir) if f.endswith('.png')])

    # Create a white background
    first_image = imageio.imread(png_files[0])
    height, width, _ = first_image.shape
    background = np.full((height, width, 3), n_black, dtype=np.uint8)  # white background, adjust as needed

    # Read all images
    images = [composite_image_with_background(png_file, background) for png_file in png_files]

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
    image_filenames = sorted(filename for filename in os.listdir(input_dir) if filename.endswith('.png'))
    
    # Create file paths
    filepaths = [os.path.join(input_dir, filename) for filename in image_filenames]

    # Create the APNG
    apng = APNG()
    for filepath in filepaths:
        apng.append_file(filepath, delay=100)  # Delay in milliseconds

    # Save the APNG
    apng.save(output_filepath)


def load_template(blender_file):
       # # if file is gzip, unzip it
    # if file.endswith('.gz'):
    #     with gzip.open(file, 'rb') as f_in:
    #         # make
    #         with open(file[:-3], 'wb') as f_out:
    #             shutil.copyfileobj(f_in, f_out)
    #     file = file[:-3]
    ...

@click.command()
@click.option('-f', '--file', type=click.Path(exists=True), required=True, help="Path to the Blender file")
@click.option('-t', '--text', required=True, help="New text content")
@click.option('-o', '--out', type=click.Path(), required=True, help="Path to the output file")
@click.option('-b', '--blender', default=blenderpath(), help="Path to the Blender executable")
def main(file, text, out, blender):

    # Set the environment variables
    os.environ['BLENDER_FILE'] = file
    os.environ['TEXT_CONTENT'] = text
    os.environ['OUTPUT_PATH'] = out

    # Call Blender with subprocess
    blender_script = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'mod.py')
    subprocess.run([blender, "-b", "-P", blender_script], check=True)


    outdir = Path(os.path.dirname(out))
    # create dist dir
    (outdir / 'dist').mkdir(parents=True, exist_ok=True)
    # Post processing: create a GIF from the rendered images
    pngs_to_gif(outdir, outdir / 'dist/anim.gif')
    pngs_to_apng(outdir, outdir / 'dist/anim.png')


if __name__ == '__main__':
    main()