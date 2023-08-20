import cv2
import numpy as np


def bloom_effect(input_path, output_path, threshold=240, blur_intensity=30, blend_intensity=0.5):
    """
    Apply a bloom effect to an image.

    Parameters:
    - input_path (str): Path to the input image.
    - output_path (str): Path to save the image after applying the bloom effect.

    - threshold (int, default=240): Brightness threshold to isolate the bright parts for the bloom effect.
      Range: 0-255
      Explanation: Determines which pixels are considered "bright" for the bloom effect. Based on the 
      8-bit pixel value range. A value of 0 would mean every pixel is considered, while a value of 
      255 would mean none are.

    - blur_intensity (int, default=30): Intensity of the blur for the bloom effect.
      Range: Practically 0-100, but can vary depending on desired effect.
      Explanation: Determines the spread of the bloom. Higher values make the effect more spread out. 
      Beyond certain values, the blur becomes too wide and might not produce visually pleasing results.

    - blend_intensity (float, default=0.5): Intensity to blend the original image and the bloom effect.
      Range: Typically between 0 and 1, but can be increased for a stronger effect.
      Explanation: Determines how much of the blurred bloom effect is added back to the original image. 
      A value of 0 would mean the bloom effect is not added at all, while a value of 1 would add the 
      full bloom effect. Higher values can be used for stronger blending but might over-brighten the image.

    """
    # Load the image with the -1 flag to ensure alpha channel is loaded if present
    img = cv2.imread(input_path, -1)

    # Convert to floating point for computations
    img_float = img.astype(np.float32) / 255.0

    # Separate the alpha channel and RGB channels
    if img_float.shape[2] == 4:  # Check for alpha channel
        img_rgb = img_float[:, :, :3]
        alpha = img_float[:, :, 3]
    else:
        img_rgb = img_float
        alpha = None

    # Isolate the bright parts of the image
    bright_areas = np.clip(img_rgb - threshold / 255.0, 0, 1)

    # Apply a blur to the bright parts
    blurred_bright_areas = cv2.GaussianBlur(
        bright_areas, (0, 0), blur_intensity)

    # Blend the blurred brightness back into the original image
    img_bloom = np.clip(img_rgb + blurred_bright_areas * blend_intensity, 0, 1)

    # If the alpha channel was present, merge it back
    if alpha is not None:
        img_bloom = np.dstack((img_bloom, alpha))

    # Convert back to 8-bit format for saving
    img_bloom_8bit = np.uint8(img_bloom * 255)

    # Save the result
    cv2.imwrite(output_path, img_bloom_8bit)


if __name__ == "__main__":
    # Example usage:
    bloom_effect("examples/example.png", "examples/example.bloom.png", threshold=150,
                 blur_intensity=100, blend_intensity=1)
