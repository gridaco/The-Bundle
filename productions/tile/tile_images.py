import click
from PIL import Image, ImageDraw, ImageColor
from tqdm import tqdm
import os
from pathlib import Path
import random


def get_image_files_from_directory(image_folder):
    """Fetch all PNG and JPG images from the directory."""
    return [os.path.join(image_folder, f) for f in os.listdir(image_folder) if f.lower().endswith(('.png', '.jpg'))]


def create_blank_canvas(columns, rows, cell_width, cell_height, background_color, border_width):
    """Create a blank canvas for the tiled image."""
    total_width = columns * cell_width + (columns - 1) * border_width
    total_height = rows * cell_height + (rows - 1) * border_width
    return Image.new("RGB", (total_width, total_height), background_color)


def process_image(img_path, x, y, resolution_x, resolution_y, draw, border_width, border_color, background_color):
    """Open, resize, and draw the border for each image."""
    with Image.open(img_path) as img:
        # If the image has transparency, composite it over a solid background
        if img.mode == "RGBA":
            img_alpha = Image.new(
                "RGBA", img.size, (*ImageColor.getrgb(background_color), 255))
            img = Image.alpha_composite(img_alpha, img).convert("RGB")

        img = img.resize((resolution_x, resolution_y), Image.LANCZOS)

        # Draw the border (by drawing a larger rect behind the image)
        if border_width > 0:
            rect_x1 = x - border_width
            rect_y1 = y - border_width
            rect_x2 = x + resolution_x + border_width
            rect_y2 = y + resolution_y + border_width
            draw.rectangle([rect_x1, rect_y1, rect_x2,
                            rect_y2], fill=border_color)

        return img


def save_canvas(canvas, output_path="tiled.png"):
    """Save the final tiled image to a file."""
    canvas.save(output_path)
    print(f"Image saved to {output_path}")


@click.command()
@click.argument("image_folder", type=click.Path(exists=True, file_okay=False, dir_okay=True))
@click.option("--columns", "--col", default=10, help="Number of columns in the tiled image.", type=int)
@click.option("--rows", "--row", default=10, help="Number of rows in the tiled image.", type=int)
@click.option("--item-width", default=512, help="Width of each image cell.", type=int)
@click.option("--item-height", default=512, help="Height of each image cell.", type=int)
@click.option("--background-color", "--background", default="white", help="Background color of the tiled image.")
@click.option("--border-width", default=2, help="Width of the border around each image cell.", type=int)
@click.option("--border-color", default="black", help="Color of the border around each image cell.")
@click.option("--out", help="Path to save the tiled image.", default="examples/tiled-{name}-col_{columns}-row_{rows}-bg_{background_color}-bc_{border_color}-bw_{border_width}.png")
@click.option("--randomize", is_flag=True, help="Randomize image selection")
@click.option("--show", is_flag=True, help="Show the image after creating it")
@click.option("--no-save", is_flag=True, help="Don't save the image after creating it")
# @click.option("--mondrian", is_flag=True, help="Make the layout look like a Mondrian")
def make_tile_image(image_folder, columns, rows, item_width, item_height, background_color, border_width, border_color, out, randomize, show, no_save):
    """Create a tiled image from a list of image files in the specified folder."""

    out = out.format(
        name=Path(image_folder).name,
        columns=columns,
        rows=rows,
        background_color=background_color,
        border_color=border_color,
        border_width=border_width
    )

    image_files = get_image_files_from_directory(image_folder)
    if randomize:
        random.shuffle(image_files)

    canvas = create_blank_canvas(
        columns, rows, item_width, item_height, background_color, border_width)
    draw = ImageDraw.Draw(canvas)

    i = 0
    pbar = tqdm(image_files, desc="Processing images",
                total=min(len(image_files), columns*rows))

    for _, img_path in enumerate(image_files):
        if i >= columns * rows:
            break

        row = i // columns
        col = i % columns

        # Calculate position
        x = col * (item_width + border_width)
        y = row * (item_height + border_width)

        try:
            img = process_image(img_path, x, y, item_width, item_height,
                                draw, border_width, border_color, background_color)

            canvas.paste(img, (x, y))
            pbar.update(1)
            i += 1
        except Exception as e:
            tqdm.write(f"Error processing image {img_path}: {e}")

    if show:
        canvas.show()

    if no_save:
        pass
    else:
        save_canvas(canvas, output_path=out)


if __name__ == "__main__":
    make_tile_image()
