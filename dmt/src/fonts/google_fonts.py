import os
from pathlib import Path
from fontTools.ttLib import TTFont
from dmt.src.fonts.axes import get_font_axes

__dir = os.path.dirname(os.path.realpath(__file__))
font_repo = os.path.join(__dir, '../../..', 'fonts', 'fonts.google.com')


class GoogleFontsRepository:
    repo: Path
    fonts_path_map: dict = {}

    def __init__(self, repo=font_repo):
        self.repo = Path(repo)

        # init the fonts directories - these are the directories that contain the fonts
        licenses = ['apache', 'ofl', 'ufl']
        for license in licenses:
            # list all the directories under the license
            license_dir = self.repo / license
            for font_dir in os.listdir(license_dir):
                name = Path(font_dir).name
                self.fonts_path_map[name] = f'{license}/{font_dir}'

    def family(self, name):
        """
        finds the font family by name
        while searching, it will
        flatten the font family name, e.g. Noto Sans KR -> notosanskr
        """
        # remove spaces, dashes, etc.
        name = name.lower()\
            .replace(' ', '')\
            .replace('-', '')\
            .replace('_', '')\
            .replace('+', '')

        return self.fonts_path_map.get(name)

    def font(self, family, weight):
        """
        finds the font by family and weight
        """
        _family = self.family(family)
        if not _family:
            return None

        path = self.repo / _family

        # Convert the weight string to integer for comparison
        weight_int = int(weight)

        font_files = list(path.glob('*.ttf'))

        # Iterate through all font files in the directory
        for font_file in font_files:
            ttfont = TTFont(font_file)
            axes = get_font_axes(ttfont)
            if axes:
                try:
                    # this is a variable font
                    # find the weight axis
                    weight_axis = next(
                        filter(lambda axis: axis['tag'] == 'wght', axes))
                    if weight_axis['min'] <= weight_int <= weight_axis['max']:
                        # the weight is within the range
                        # load the font
                        return font_file
                except StopIteration:
                    # the font doesn't have a weight axis
                    continue
            else:
                # this is a non-variable font
                if 'OS/2' not in ttfont:
                    continue  # skip this font if it doesn't have an OS/2 table

                os2_table = ttfont['OS/2']

                if os2_table.usWeightClass == weight_int:
                    # the font has the desired weight
                    return font_file

        # if no font was found with the desired weight, return the first font
        if len(font_files) > 0:
            return font_files[0]

        raise Exception(f'Empty fonts directory: {family} {weight}')


if __name__ == '__main__':
    repo = GoogleFontsRepository()
    # f = repo.font('Noto Sans KR', 400)
    # print(f)
    f2 = repo.font('OI', 400)
    print(f2)
    f3 = repo.font('Cairo', 400)
    print(f3)
