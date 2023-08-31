def rename(filename):
    """
    renames the `~######.png` files to `~000°000°000°.png`
    """
    try:
        return 'renamed_' + filename
    except Exception as e:
        return filename
