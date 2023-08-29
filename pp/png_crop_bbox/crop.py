import click
from pathlib import Path
from PIL import Image
from tqdm import tqdm
import glob


def calculate_bbox(image, margin):
    im = image.convert("RGBA")
    data = im.getdata()

    ALPHA_THRESHOLD = 50  # adjust based on your needs

    newData = []
    for item in data:
        if item[3] < ALPHA_THRESHOLD:
            newData.append((0, 0, 0, 0))  # fully transparent
        else:
            newData.append(item)

    im.putdata(newData)

    # Get the bounding box
    bbox = im.getbbox()

    if bbox:
        # Add margin
        left = max(0, bbox[0] - margin)
        upper = max(0, bbox[1] - margin)
        right = min(im.width, bbox[2] + margin)
        lower = min(im.height, bbox[3] + margin)

        return (left, upper, right, lower)
    else:
        return None


@click.command()
@click.argument('input_dir')
@click.option('--ext', prompt='File extension', default='*.png', help='File extension for a deep glob search.')
@click.option('--margin', prompt='Margin in pixels', default=8, help='Margin to be added after cropping.')
@click.option('--out', prompt='Output directory', help='The directory where the cropped images will be saved.')
@click.option('--alpha', prompt='Alpha threshold', default=25, help='Alpha threshold for the bounding box.')
def main(input_dir, ext, margin, out):
    input_path = Path(input_dir)
    output_path = Path(out)

    # Create output directory if it doesn't exist
    output_path.mkdir(parents=True, exist_ok=True)

    # Search for files
    search_path = f"{input_path}/**/{ext}"
    image_files = glob.glob(search_path, recursive=True)

    for image_path in tqdm(image_files):
        relative_path = Path(image_path).relative_to(
            input_path)  # Find relative path to input dir
        # Create corresponding path in output dir
        output_image_path = output_path / relative_path

        # Create parent folders if they don't exist
        output_image_path.parent.mkdir(parents=True, exist_ok=True)

        with Image.open(image_path).convert("RGBA") as img:
            bbox = calculate_bbox(img, margin)
            if bbox:
                cropped_img = img.crop(bbox)
                cropped_img.save(output_image_path)
                tqdm.write(f"☑️ {output_image_path}")


if __name__ == '__main__':
    main()
