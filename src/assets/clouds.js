const _ = null;
const W = "#FFFFFF";
const L = "#E8E8E8";

const CLOUD_SPRITES = [
  // Large cloud 10x4
  [
    [_, _, W, W, W, W, W, W, _, _],
    [_, W, W, W, W, W, W, W, W, _],
    [W, W, W, L, W, W, L, W, W, W],
    [_, W, W, W, W, W, W, W, W, _],
  ],
  // Small cloud 7x3
  [
    [_, _, W, W, W, _, _],
    [_, W, W, W, W, W, _],
    [W, W, L, W, L, W, W],
  ],
];

export function getCloud(index) {
  return CLOUD_SPRITES[index % CLOUD_SPRITES.length];
}

export function getCloudPositions(skyRows, gridWidth) {
  if (skyRows < 4) return [];

  const positions = [];
  const seeds = [7, 53, 97, 131, 173];

  for (let i = 0; i < seeds.length; i++) {
    const spriteIndex = i % CLOUD_SPRITES.length;
    const cloud = CLOUD_SPRITES[spriteIndex];
    const x = (seeds[i] * 17 + i * 41) % (gridWidth - cloud[0].length);
    const y = (seeds[i] * 3 + i * 5) % Math.max(1, skyRows - cloud.length);
    positions.push({ spriteIndex, x, y });
  }

  return positions;
}
