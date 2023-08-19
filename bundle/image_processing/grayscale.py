from PIL import Image


def grayscale(image) -> Image:
    """
    Converts an image to grayscale.

    Args:
        image (PIL.Image): The image to convert.

    Returns:
        PIL.Image: The grayscale image.
    """
    return image.convert('L')
