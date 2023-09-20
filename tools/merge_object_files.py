import click
import bpy
from tqdm import tqdm
from pathlib import Path


@click.command()
@click.argument('path', type=click.Path(exists=True, file_okay=False, dir_okay=True, readable=True))
@click.option('--out', '-o', type=click.Path(writable=True, dir_okay=False))
def main(path, out):
    # Convert path and out to Path objects
    path = Path(path)
    out = Path(out)

    # Get all .blend files in the specified directory
    blend_files = sorted(path.glob("*.blend"))

    if not blend_files:
        print(f"No .blend files found in {path}")
        return

    # Create a new .blend file or overwrite if exists
    bpy.ops.wm.read_factory_settings(use_empty=True)

    print(len(blend_files))
    # Iterate over each .blend file
    for blend_file in tqdm(blend_files, desc="Processing .blend files", unit="file"):

        # Link the object into the current scene
        with bpy.data.libraries.load(str(blend_file)) as (data_from, data_to):
            data_to.objects = [name for name in data_from.objects]

        # Set the linked object and link to the current scene
        for obj in data_to.objects:
            if obj is not None:
                bpy.context.collection.objects.link(obj)
                # Rename the linked object
                obj.name = blend_file.stem

        # Rename the current scene
        scene_name = blend_file.stem
        bpy.context.scene.name = scene_name

        # If not the last file, create a new scene for the next object
        if blend_file != blend_files[-1]:
            bpy.ops.scene.new(type='NEW')

    # Save the merged file
    bpy.ops.wm.save_as_mainfile(filepath=str(out))
    print(f"Saved merged file to '{out.resolve()}'")


if __name__ == "__main__":
    main()
