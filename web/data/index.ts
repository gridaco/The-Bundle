import bundle from "@/k/bundle.json";
import assert from "assert";

const materials = bundle.materials;

export function packdata({
  objpack,
  matpack,
}: {
  matpack: string;
  objpack: string;
}) {
  const matPack = matpack;
  const objPack = objpack;
  const objPackName = objPack.toUpperCase();
  const __mat = (materials as any)[matPack];
  assert(__mat["packs"].includes(objPack));

  const matPackName = __mat["name"];

  const has_t2 = ["a", "b", "c", "f", "99"].includes(objPack);

  return {
    label: `${matPackName} ${objPackName}`,
    matpack: {
      id: matPack,
      name: matPackName,
    },
    objpack: {
      id: objPack,
      name: objPackName,
    },
    images: {
      thumbnail: `/bundle/thumbnails/${matPack}/${objPack}.png`,
      previews: [
        {
          src: `/bundle/previews/${matpack}/${objpack}/t-0.png`,
          alt: `The Bundle - ${matPack}/${objPack} tile image 1`,
        },
        has_t2 && {
          src: `/bundle/previews/${matpack}/${objpack}/t-1.png`,
          alt: `The Bundle - ${matPack}/${objPack} tile image 2`,
        },
      ].filter(Boolean) as ReadonlyArray<{
        src: string;
        alt: string;
      }>,
    },
    download: `/library/download?item=${`v1/bin/${matPack}/${objPack}.zip`}`,
  };
}
