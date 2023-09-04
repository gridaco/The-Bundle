import click
from zipfile import ZipFile
from pathlib import Path


@click.command()
@click.argument("path", type=click.Path(exists=True, file_okay=False))
@click.option("-o", "--out", type=click.Path(exists=True, file_okay=False), help="Path to output the package to")
@click.option("-p", "--profile", type=click.Path(exists=True, file_okay=True), help="Path to a profile to use (.json)")
@click.option("--allow-unknown", is_flag=True, help="Allow unknown files to be packaged")
def main(path, out, profile, allow_unknown):
    ...


if __name__ == "__main__":
    main()
