from PIL import Image, ImageEnhance, ImageChops


def grayscale(file, output=None) -> Image:
    """
    Converts an image to grayscale while preserving its transparency.

    Args:
        file (str): Path to the input image file.
        output (str, optional): Path to save the grayscale image.

    Returns:
        PIL.Image: The grayscale image.
    """
    image = Image.open(file)

    if image.mode == 'RGBA':
        r, g, b, a = image.split()
        # Weight for the red channel based on human perception.
        # These coefficients are derived from the ITU-R Recommendation BT.601 standard for TV encoding.
        # For more details, see: https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
        r_enhanced = ImageEnhance.Brightness(r).enhance(0.299)

        # Weight for the green channel based on human perception.
        g_enhanced = ImageEnhance.Brightness(g).enhance(0.587)

        # Weight for the blue channel based on human perception.
        b_enhanced = ImageEnhance.Brightness(b).enhance(0.114)

        gray = ImageChops.add(ImageChops.add(
            r_enhanced, g_enhanced), b_enhanced)
        image = Image.merge('RGBA', [gray, gray, gray, a])
    else:
        image = image.convert('L')

    if output:
        image.save(output)

    return image


if __name__ == '__main__':
    grayscale('examples/example.png', 'examples/example.grayscale.png').show()
