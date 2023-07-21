from PIL import Image


def is_image_transparent(img_path):
    """
    check if image has transparency
    """
    img = Image.open(img_path)
    if img.mode == 'RGBA':
        # If the image has an alpha channel, get all the alpha values
        alpha = img.split()[3]

        # Check if any pixel has transparency
        if any(pixel < 255 for pixel in alpha.getdata()):
            return True
    return False
