import click


@click.command()
@click.argument('path', type=click.Path(exists=True))
def main(path):
    """
    Archives template to tar.gz file.
    template.wip -> template.tar.gz
    """
    ...
    


if __name__ == '__main__':
    pass