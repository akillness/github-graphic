const _ = null;
const D = "#696969";
const M = "#808080";
const L = "#A0A0A0";

const ROCK_SPRITES = [
  // Small rock 5x3
  [
    [_, D, D, D, _],
    [D, M, L, M, D],
    [_, D, D, D, _],
  ],
  // Large rock 6x4
  [
    [_, _, D, D, _, _],
    [_, D, M, L, D, _],
    [D, M, L, L, M, D],
    [_, D, D, D, D, _],
  ],
];

export function getRock(index) {
  return ROCK_SPRITES[index % ROCK_SPRITES.length];
}

export function getRockPositions(gridWidth) {
  const positions = [];
  const count = Math.max(2, Math.floor(gridWidth / 40));
  const spacing = Math.floor(gridWidth / (count + 1));

  for (let i = 0; i < count; i++) {
    const spriteIndex = i % ROCK_SPRITES.length;
    const x = spacing * (i + 1) - Math.floor(ROCK_SPRITES[spriteIndex][0].length / 2);
    positions.push({ spriteIndex, x });
  }

  return positions;
}
