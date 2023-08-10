from fontTools.ttLib import TTFont


def get_font_axes(ttfont: TTFont):
    """
    Retrieves the axes data from the font. returns None if the font is not a variable font.
    Example:
    ```
    [{'tag': 'wght', 'min': 200.0, 'default': 400.0, 'max': 1000.0}, {'tag': 'slnt', 'min': -11.0, 'default': 0.0, 'max': 11.0}]
    ```
    """
    if 'fvar' not in ttfont:
        return None

    fvar_table = ttfont['fvar']
    axes_data = []

    for axis in fvar_table.axes:

        axes_data.append({
            "tag": axis.axisTag,
            "min": axis.minValue,
            "default": axis.defaultValue,
            "max": axis.maxValue
        })

    return axes_data
