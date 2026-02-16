const _ = null;
const H = "#F8F8FF"; // Bright highlight (top shine)
const W = "#FFFFFF"; // Base white
const M = "#D0D0D0"; // Medium shadow
const L = "#C0C0C0"; // Darker bottom shadow

const CLOUD_SPRITES = [
  // Large cloud 10x4 with volume and depth
  [
    [_, _, H, H, H, H, H, H, _, _],
    [_, H, W, W, H, H, W, W, H, _],
    [W, W, M, W, W, W, W, M, W, W],
    [_, W, L, W, W, W, W, L, W, _],
  ],
  // Small cloud 7x3 with volume and depth
  [
    [_, _, H, H, H, _, _],
    [_, H, W, W, W, H, _],
    [W, W, M, W, M, W, W],
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
