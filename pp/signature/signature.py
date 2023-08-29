from PIL import Image


def add_signature(input_image, output_image, signature_image, pos_left=None, pos_right=24, pos_top=None, pos_bottom=24):
    # Open the input and signature images
    main = Image.open(input_image)
    signature = Image.open(signature_image)

    # Assert to ensure correct positioning values are provided
    assert (pos_top is not None or pos_bottom is not None) and (pos_left is not None or pos_right is not None), \
        "You must provide either top or bottom and left or right positioning values."

    # Set default values if all provided values are None
    if pos_left is None and pos_right is None and pos_top is None and pos_bottom is None:
        pos_right = 24
        pos_bottom = 24

    # Calculate the position for the signature
    if pos_left is not None:
        x = pos_left
    else:
        x = main.width - signature.width - pos_right

    if pos_top is not None:
        y = pos_top
    else:
        y = main.height - signature.height - pos_bottom

    # Paste the signature onto the main image and save it
    # The last parameter is the alpha channel for transparency support
    main.paste(signature, (x, y), signature)
    main.save(output_image)


if __name__ == "__main__":
    import os
    __dir = os.path.dirname(os.path.realpath(__file__))
    signature_name = 'signature-copyright-grida-inc-2023-XY2048'
    input_image = os.path.join(__dir, 'examples/example.png')
    output_image = os.path.join(
        __dir, f'examples/example.{signature_name}.png')
    signature_image = os.path.join(
        __dir, f'assets/{signature_name}.png')

    add_signature(
        input_image=input_image,
        output_image=output_image,
        signature_image=signature_image
    )
