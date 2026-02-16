const SKY_TOP = "#6CB4EE";
const SKY_BOTTOM = "#87CEEB";
const GRASS_LIGHT = "#4CAF50";
const GRASS_DARK = "#388E3C";
const DIRT_LIGHT = "#D4A76A";
const DIRT_DARK = "#C4963F";
const DEEP_EARTH = "#A0845C";
const BEDROCK = "#8B7355";

export const GRASS_ROWS = 3;

export function getGroundRow(depth, height) {
  const skyRows = Math.max(2, Math.floor(height * 0.3) - depth);
  return skyRows + GRASS_ROWS;
}

export function getMineBackground(depth, width, height) {
  const skyRows = Math.max(2, Math.floor(height * 0.3) - depth);
  const grassRows = GRASS_ROWS;
  const undergroundRows = height - skyRows - grassRows;
  const deepStart = skyRows + grassRows + Math.floor(undergroundRows * 0.6);
  const bedrockStart = height - Math.max(2, Math.floor(undergroundRows * 0.1));

  const grid = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      if (y < skyRows) {
        row.push(y < Math.floor(skyRows / 2) ? SKY_TOP : SKY_BOTTOM);
      } else if (y < skyRows + grassRows) {
        row.push(y % 2 === 0 ? GRASS_LIGHT : GRASS_DARK);
      } else if (y < deepStart) {
        row.push(y % 2 === 0 ? DIRT_LIGHT : DIRT_DARK);
      } else if (y < bedrockStart) {
        row.push(DEEP_EARTH);
      } else {
        row.push(BEDROCK);
      }
    }
    grid.push(row);
  }

  return grid;
}
