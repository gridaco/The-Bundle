from PIL import Image


def antialias(input_path, output_path, upscale_factor=4):
    """
    Apply a simple antialiasing effect to an image by leveraging supersampling.

    Parameters:
    - input_path: Path to the input image.
    - output_path: Path to save the image after applying the antialiasing.
    - upscale_factor: Factor by which the image is initially upscaled before downscaling for antialiasing. Higher values can lead to better antialiasing but are more computationally intensive.
    """

    with Image.open(input_path) as img:
        # Upscale the image to simulate supersampling
        upscaled = img.resize(
            (img.width * upscale_factor, img.height * upscale_factor),
            Image.BICUBIC
        )

        # Downscale the image back to its original size using a high-quality resampling filter
        antialiased = upscaled.resize(
            (img.width, img.height),
            Image.LANCZOS
        )

        # Save the result
        antialiased.save(output_path)


if __name__ == "__main__":
    # Example usage:
    antialias("examples/example.png",
              "examples/example.antialiased.png", upscale_factor=4)
