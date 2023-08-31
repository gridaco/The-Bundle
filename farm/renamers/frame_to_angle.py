from pathlib import Path
import re


def rename(filename, data=None):
    """
    renames the `~######.png` files to `~0°0°0°.png`
    """
    try:
        __f = Path(filename)
        ext = __f.suffix
        name = __f.stem

        pattern = r'(.*)-[0-9]{1,6}'
        match = re.match(pattern, name)
        object_name = match.group(1)

        # parse frame number from last 6 characters of filename (######.)
        frame_str = name[-6:]
        frame = int(frame_str)

        keyframe_data = data['keyframes'][str(frame)]
        rotation = keyframe_data['rotation']

        resolution_x = data['resolution_x']
        resolution_y = data['resolution_y']
        samples = data['samples']
        resolution_percentage = data['resolution_percentage']

        # build new filename
        rot = "{rotation[0]}°{rotation[1]}°{rotation[2]}°"\
            .format(rotation=rotation)
        res = f'{resolution_x}x{resolution_y}'
        qua = f'{resolution_percentage}%'
        samples = f'#{samples}'
        seq = [object_name, rot, samples, res, qua]
        # filter out empty strings, None, etc.
        seq = [s for s in seq if s]

        id = ",".join(seq)
        # replace the ###### with the rotation str
        return f"{id}{ext}"

    except Exception as e:
        return filename
