const _ = null;
const H = "#B8B8B8";
const L = "#A0A0A0";
const M = "#808080";
const D = "#696969";
const S = "#505050";
const C = "#585858";

const ROCK_SPRITES = [
  [
    [_, H, L, D, _],
    [H, L, M, C, D],
    [_, S, D, S, _],
  ],
  [
    [_, H, L, L, D, _],
    [H, L, M, C, M, D],
    [L, M, C, L, M, S],
    [_, S, D, S, D, _],
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
