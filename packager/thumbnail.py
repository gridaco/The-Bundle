import os
import shutil
import click
import fnmatch

targets = {
    "a": "a.cube.rounded.0001,{material},0°30°30°,#*,2048x2048,100%.png",
    "b": "b.rhombicuboctahedron,{material},15°30°0°,#*,2048x2048,100%.png",
    "c": "c.torus.knot.trefoil,{material},30°30°0°,#*,2048x2048,100%.png",
    "d": "d.tetrapod (imported),{material},15°30°0°,#*,2048x2048,100%.png",
    "e": "e.blob.sphere.004,{material},0°30°0°,#*,2048x2048,100%.png",
    "f": "f.surface.hexahedron,{material},15°30°0°,#*,2048x2048,100%.png",
    "x": "x.ring (atomic rotations of rings with downscaling),{material},30°30°0°,#*,2048x2048,100%.png",
    "z": "z.comp.cuboid.array.5 (n5),{material},0°30°30°,#*,2048x2048,100%.png",
    "99": "Spheres_04,{material},0°30°30°,#*,2048x2048,100%.png",
}

fallbacks = {
    "a_fallback": "a.cube.rounded.0001,{material},*,#*,2048x2048,100%.png",
    "b_fallback": "b.rhombicuboctahedron,{material},*,#*,2048x2048,100%.png",
    "c_fallback": "c.torus.knot.trefoil,{material},*,#*,2048x2048,100%.png",
    "d_fallback": "d.tetrapod (imported),{material},*,#*,2048x2048,100%.png",
    "e_fallback": "e.blob.sphere.004,{material},*,#*,2048x2048,100%.png",
    "f_fallback": "f.surface.hexahedron,{material},*,#*,2048x2048,100%.png",
    "x_fallback": "x.ring (atomic rotations of rings with downscaling),{material},*,#*,2048x2048,100%.png",
    "z_fallback": "z.comp.cuboid.array.5 (n5),{material},*,#*,2048x2048,100%.png",
    "99_fallback": "Spheres_04,{material},*,#*,2048x2048,100%.png"
}

materials = {
    "cmp.aluminium-foil": "Aluminium Foil",
    "cmp.battered": "Battered",
    "cmp.bubble": "Bubble",
    "cmp.brushed": "Brushed",
    "cmp.clay": "Clay",
    "cmp.frosted-dispersion-glass": "Frosted Dispersion Glass",
    "cmp.frosted-glass": "Frosted Glass",
    "cmp.glass": "Glass",
    "cmp.gold-foil": "Gold Foil",
    "cmp.marble": "Marble",
    "cmp.plastic": "Plastic",
    "cmp.subtle-imperfections": "Subtle Imperfections",
    # "m.blob": "Blob",
    "m.chrome": "m.chrome",
    "m.cloudy": "m.cloudy",
    "m.copper": "m.copper",
    "m.gold": "m.gold",
    "m.hologram": "m.hologram",
    "m.silver": "m.silver",
    "p.reflective": "p.reflective",
    "p.rough": "p.rough",
    "sss": "sss",
}


@click.command()
@click.argument("dist_path", type=click.Path(exists=True))
@click.option("--out", "-o", type=click.Path(), default="./thumbnails")
def main(dist_path, out):
    """
    Generate thumbnails from the specified directory and copy them to the output directory.
    """
    # Ensure the output directory exists
    if not os.path.exists(out):
        os.makedirs(out)

    for material, material_name in materials.items():
        material_path = os.path.join(dist_path, material)

        # Check if material folder exists
        if not os.path.exists(material_path):
            click.echo(f"☒ [missing material folder]: {material_path}")
            continue

        # Create corresponding folder in the output directory
        out_material_path = os.path.join(out, material)
        if not os.path.exists(out_material_path):
            os.makedirs(out_material_path)

        for target_key, target_file_template in targets.items():
            # Replace {material} placeholder with the actual material name
            target_file_wildcard = target_file_template.format(
                material=material_name)
            target_file_found = None

            # Use fnmatch to find the matching file
            pack_dir = os.path.join(material_path, target_key)
            if not os.path.exists(pack_dir):
                click.echo(f"☒ [missing pack folder]: {pack_dir}")
                continue
            for filename in os.listdir(pack_dir):
                if fnmatch.fnmatch(filename, target_file_wildcard):
                    target_file_found = filename
                    break

            if target_file_found is None:

                # Try to find a fallback file
                target_file_wildcard = fallbacks.get(f"{target_key}_fallback")
                if target_file_wildcard:
                    target_file_wildcard = target_file_wildcard.format(
                        material=material_name)

                    for filename in os.listdir(pack_dir):
                        if fnmatch.fnmatch(filename, target_file_wildcard):
                            target_file_found = filename
                            break

                if target_file_found is None:
                    click.echo(
                        f"☒ [missing file] at {material_path}/{target_key}: {target_file_wildcard}")
                    continue

            src_file_path = os.path.join(
                material_path, target_key, target_file_found)
            dst_file_path = os.path.join(
                out_material_path, target_file_found)

            # Copy the file
            shutil.copy2(src_file_path, dst_file_path)
            click.echo(f"☑ {dst_file_path}")


if __name__ == "__main__":
    main()
