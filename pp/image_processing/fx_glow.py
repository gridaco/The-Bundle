import cv2
import numpy as np


def glow_effect(input_path, output_path, threshold=220, glow_radius=15, blend_intensity=0.7):
    """
    Apply a glow effect to an image.

    Parameters:
    - input_path (str): Path to the input image.
    - output_path (str): Path to save the image after applying the glow effect.

    - threshold (int, default=220): Brightness threshold to isolate the glowing parts of the image.
      Range: 0-255
      Explanation: Determines which pixels are considered "bright" for the glow effect. Based on the 
      8-bit pixel value range.

    - glow_radius (int, default=15): Determines the spread of the glow. Higher values produce a wider glow.
      Explanation: Radius for the Gaussian blur applied to the isolated bright parts, creating the glow effect.

    - blend_intensity (float, default=0.7): Intensity to blend the original image and the glow effect.
      Range: Typically between 0 and 1, but can be increased for a stronger effect.
      Explanation: Determines how much of the glow is added back to the original image. 

    """
    # Load the image
    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)

    # Handle transparent PNGs
    if img.shape[2] == 4:
        # Splitting the alpha channel
        bgr, alpha = img[..., :3], img[..., 3]
        img_float = bgr.astype(np.float32) / 255.0
    else:
        img_float = img.astype(np.float32) / 255.0

    # Isolate bright parts for the glow
    bright_areas = np.clip(img_float - threshold / 255.0, 0, 1)

    # Blur these parts to produce the glow
    glowing_areas = cv2.GaussianBlur(bright_areas, (0, 0), glow_radius)

    # Blend the glow back into the original image
    img_glow = np.clip(img_float + glowing_areas * blend_intensity, 0, 1)

    # Convert back to 8-bit format for saving
    img_glow_8bit = np.uint8(img_glow * 255)

    # If image had an alpha channel, merge it back
    if img.shape[2] == 4:
        img_glow_8bit = cv2.merge([img_glow_8bit, alpha])

    # Save the result
    cv2.imwrite(output_path, img_glow_8bit)


if __name__ == "__main__":
    # Example usage with more pronounced settings:
    glow_effect("examples/example.png", "examples/example.glow.png",
                threshold=180, glow_radius=25, blend_intensity=1.0)
