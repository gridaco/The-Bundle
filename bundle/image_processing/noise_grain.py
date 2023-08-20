from PIL import Image
import random


def noise_grain(input_path, output_path, intensity=0.1):
    """
    Add grain noise to a PNG image with transparency.

    Parameters:
        input_path (str): Path to the input PNG image.
        output_path (str): Path to save the noisy image.
        intensity (float): Intensity of the noise. Default is 0.1, and the range is [0, 1].
    """
    image = Image.open(input_path)
    noisy_image = image.copy()

    pixels = noisy_image.load()

    for i in range(image.width):
        for j in range(image.height):
            r, g, b, a = image.getpixel((i, j))

            # Only apply noise to non-transparent pixels
            if a > 0:
                rand_val = random.randint(-int(255 * intensity),
                                          int(255 * intensity))

                r = max(0, min(255, r + rand_val))
                g = max(0, min(255, g + rand_val))
                b = max(0, min(255, b + rand_val))

                pixels[i, j] = (r, g, b, a)

    noisy_image.save(output_path)


if __name__ == '__main__':
    # Example usage
    for i in range(5):
        intensity = (i + 1) / 10
        noise_grain(
            'examples/example.png',
            f'examples/example.grain ({intensity}).png',
            intensity=intensity
        )
