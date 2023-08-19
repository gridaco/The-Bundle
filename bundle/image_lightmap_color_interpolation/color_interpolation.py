from PIL import Image
import numpy as np


def calculate_weights(ref_colors, target_color):
    distances = np.linalg.norm(ref_colors - target_color, axis=1)
    # Inverse the distances and normalize
    # Adding a small value to avoid division by zero
    weights = 1.0 / (distances + 1e-8)
    return weights / np.sum(weights)


def color_interpolation(ref_images, ref_colors, target_color):
    # Convert images to numpy arrays
    arrays = [np.array(img, dtype=float) for img in ref_images]

    # Get weights for each reference image
    weights = calculate_weights(ref_colors, target_color)

    # Create a new image using the weights
    new_array = np.zeros_like(arrays[0])
    for weight, array in zip(weights, arrays):
        new_array += weight * array

    # Clip values to [0, 255] and convert to uint8
    new_array = np.clip(new_array, 0, 255).astype(np.uint8)

    # Convert numpy array back to an image
    new_img = Image.fromarray(new_array)

    return new_img


references = [
    (Image.open("box-black.jpg"), np.array([0, 0, 0])),
    (Image.open("box-blue.jpg"), np.array([0, 0, 255])),
    (Image.open("box-red.jpg"), np.array([255, 0, 0])),
    (Image.open("box-yellow.jpg"), np.array([255, 255, 0])),
    # (Image.open("box-white.jpg"), np.array([255, 255, 255])),
]

if __name__ == "__main__":
    # Load reference images
    ref_images = [img for img, _ in references]
    # Define reference colors in RGB format. Assuming you've mentioned "B" twice by mistake.
    ref_colors = np.array([color for _, color in references])
    # Target color in RGB format
    target_color = np.array([200, 200, 200])

    new_img = color_interpolation(ref_images, ref_colors, target_color)
    new_img.show()
