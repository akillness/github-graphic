const SKY = "#87CEEB";
const GRASS = "#228B22";
const DIRT_LIGHT = "#5D4037";
const DIRT_DARK = "#3E2723";
const STONE = "#696969";

export function getMineBackground(depth, width, height) {
  const skyRows = Math.max(2, Math.floor(height * 0.3) - depth);
  const grassRows = 1;
  const dirtRows = Math.min(depth * 2, height - skyRows - grassRows);
  const stoneRows = height - skyRows - grassRows - dirtRows;

  const grid = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      if (y < skyRows) {
        row.push(SKY);
      } else if (y < skyRows + grassRows) {
        row.push(GRASS);
      } else if (y < skyRows + grassRows + dirtRows) {
        row.push(y % 2 === 0 ? DIRT_LIGHT : DIRT_DARK);
      } else {
        row.push(STONE);
      }
    }
    grid.push(row);
  }

  return grid;
}
