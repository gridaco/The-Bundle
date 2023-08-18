import click
from pathlib import Path
from tqdm import tqdm
import re


@click.command()
@click.argument('path', type=Path)
@click.option('-re', '--regexp')
@click.option('-rep', '--replacement')
def main(path, regexp: str, replacement: str):
    for path in tqdm(Path(path).glob('*.png')):
        regexp = re.compile(regexp)
        new_name = regexp.sub(replacement, path.name)
        path.rename(path.parent / new_name)
        tqdm.write(f'☑ {path} ➡️ {new_name}')


if __name__ == '__main__':
    main()
