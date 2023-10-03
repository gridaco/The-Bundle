type RMap = ReadonlyArray<Readonly<[number, number, number]>>;

export function idx_from_rot(
  rmap: RMap,
  rotation: {
    x: number;
    y: number;
    z: number;
  }
): number {
  let closestIndex = 0;
  let closestDistance = Infinity;

  for (let i = 0; i < rmap.length; i++) {
    const [rx, ry, rz] = rmap[i];

    // Compute the Euclidean distance in 3D space
    const distance = Math.sqrt(
      (rx - rotation.x) ** 2 + (ry - rotation.y) ** 2 + (rz - rotation.z) ** 2
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
}
