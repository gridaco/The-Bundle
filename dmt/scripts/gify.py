import click
import imageio
import numpy as np
import os


n_white = 255
n_black = 0

@click.command()
@click.argument('png_dir')
@click.option('--output', '-o', required=True, help='Path to the output GIF file')
def main(png_dir, output):
    png_dir_to_gif(png_dir, output)


def png_dir_to_gif(png_dir, gif_path):
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



if __name__ == '__main__':
    main()

