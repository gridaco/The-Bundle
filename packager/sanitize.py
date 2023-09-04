import click


object_exclude = ["Scene"]


@click.command()
@click.argument("path", type=click.Path(exists=True, file_okay=False))
@click.option("-y", "--yes", is_flag=True, help="Don't ask for confirmation")
def main(path, yes):
    """
    Sanitize a distribution directory.

    removes files that aren't supposed to be included. E.g. demo files truncated files

    report the list of files to be removed, ask for confirmation, then remove them.
    """

    click.confirm("Are you sure you want to sanitize this file?", abort=True)
    ...


if __name__ == "__main__":
    ...
