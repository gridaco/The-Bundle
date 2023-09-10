from pathlib import Path
import random
import click
import shutil
from productions.tile.tile_images import make_tile_image


materials = {
    "cmp.aluminium-foil": {
        "name": "Aluminium Foil",
        "packs": ["99", "a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "cmp.battered": {
        "name": "Battered",
        "packs": ["99", "a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "cmp.brushed": {
        "name": "Brushed",
        "packs": ["99", "a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "cmp.bubble": {
        "name": "Bubble",
        "packs": ["99", "a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "cmp.clay": {
        "name": "Clay",
        "packs": ["99", "a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "cmp.frosted-dispersion-glass": {
        "name": "Frosted Dispersion Glass",
        "packs": ["99", "a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "cmp.frosted-glass": {
        "name": "Frosted Glass",
        "packs": ["99", "a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "cmp.glass": {
        "name": "Glass",
        "packs": ["99", "a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "cmp.gold-foil": {
        "name": "Gold Foil",
        "packs": ["99", "a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "cmp.marble": {
        "name": "Marble",
        "packs": ["99", "a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "cmp.plastic": {
        "name": "Plastic",
        "packs": ["99", "a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "cmp.subtle-imperfections": {
        "name": "Subtle Imperfections",
        "packs": ["99", "a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "m.chrome": {
        "name": "Chrome",
        "packs": ["a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "m.cloudy": {
        "name": "Cloudy",
        "packs": ["a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "m.copper": {
        "name": "Copper",
        "packs": ["a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "m.gold": {
        "name": "Gold",
        "packs": ["a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "m.hologram": {
        "name": "Hologram",
        "packs": ["a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "m.silver": {
        "name": "Silver",
        "packs": ["a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "p.reflective": {
        "name": "Reflective",
        "packs": ["a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "p.rough": {
        "name": "Rough",
        "packs": ["a", "b", "c", "d", "e", "f", "x", "z"]
    },
    "sss": {
        "name": "SSS",
        "packs": ["a", "b", "c", "d", "e", "f", "x", "z"]
    }
}


def select_previews(packdir: Path, outdir: Path, n: int):
    items = (packdir).glob("*.png")
    objkeys = make_objkey_list(items)
    # shuffle
    random.shuffle(objkeys)
    targetkeys = objkeys[:n]

    for tk in targetkeys:
        i = 0
        for item in packdir.glob(f"{tk}*.png"):
            try:
                shutil.copy(item, outdir / f"p-{i}.png")
                i += 1
                if i >= n:
                    break
            except Exception as e:
                ...


n_preview = 5

tiles = {
    "a": [
        (10, 10),
        (5, 20)
    ],
    "b": [
        (7, 7),
        (5, 20)
    ],
    "c": [
        (7, 7),
        (5, 10)
    ],
    "d": [
        (4, 4),
        # (5, 20)
    ],
    "e": [
        (8, 8),
        # (5, 20)
    ],
    "f": [
        (9, 9),
        (5, 16)
    ],
    "x": [
        (6, 6),
        # (5, 20)
    ],
    "z": [
        (8, 8),
        # (5, 20)
    ],
    "99": [
        (10, 10),
        (5, 20)
    ]
}


def make_objkey_list(items: list[Path]):
    keys = set()
    for item in items:
        keys.add(item.name.split(",")[0])
    return list(keys)


@click.command()
@click.argument("bin_path", type=click.Path(exists=True))
@click.argument("out_path", type=click.Path())
@click.option("--overwrite", is_flag=True)
def main(bin_path, out_path, overwrite):
    dist = Path(bin_path)
    out = Path(out_path)
    out.mkdir(exist_ok=True, parents=True)

    # [p-{n}.png] - select 5 images for to be used as preview images
    # [t-1.png]   - make 1 10x10 tile image
    # [t-2.png]   - make 1 5x20 tile image

    for matkey, data in materials.items():
        for pack in data["packs"]:
            pack_out: Path = out / matkey / pack
            pack_in: Path = dist / matkey / pack

            pack_out.mkdir(exist_ok=True, parents=True)

            # select_previews(
            #     pack_in,
            #     pack_out,
            #     n_preview
            # )

            for i, (col, row) in enumerate(tiles.get(pack, [])):
                randomize = pack == "99"  # randomize only for the 99 pack
                __out = pack_out.resolve() / f"t-{i}.png"
                if not overwrite and __out.exists():
                    continue

                make_tile_image(
                    str(pack_in),
                    columns=col,
                    rows=row,
                    border_width=0,
                    background_color="black",
                    item_width=216,
                    item_height=216,
                    border_color="black",
                    randomize=randomize,
                    out=str(__out),
                    verbose=False
                )


if __name__ == "__main__":
    main()
