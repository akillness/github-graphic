import { getMiner } from "./assets/miner.js";
import { getMineBackground } from "./assets/mine.js";
import { getGem, getGemTypes } from "./assets/gems.js";
import { spriteToRects, wrapSvg } from "./svg-renderer.js";

const SVG_WIDTH = 800;
const SVG_HEIGHT = 400;
const PIXEL_SIZE = 4;

// Grid dimensions in "pixels"
const GRID_W = SVG_WIDTH / PIXEL_SIZE;  // 200
const GRID_H = SVG_HEIGHT / PIXEL_SIZE; // 100

export function buildScene(tier, commitCount) {
  const parts = [];

  // 1. Mine background
  const bg = getMineBackground(tier.mineDepth, GRID_W, GRID_H);
  parts.push(spriteToRects(bg, 0, 0, PIXEL_SIZE));

  // 2. Miner character — placed on ground level
  const miner = getMiner(tier.pickaxe);
  const groundY = Math.max(2, Math.floor(GRID_H * 0.3) - tier.mineDepth);
  const minerX = (GRID_W / 2 - miner[0].length / 2) * PIXEL_SIZE;
  const minerY = (groundY - miner.length + 1) * PIXEL_SIZE;
  parts.push(spriteToRects(miner, minerX, minerY, PIXEL_SIZE));

  // 3. Gems — scatter in underground area
  if (tier.gemCount > 0) {
    const gemTypes = getGemTypes();
    const undergroundStartY = groundY + 2;
    for (let i = 0; i < tier.gemCount; i++) {
      const gemType = gemTypes[i % gemTypes.length];
      const gem = getGem(gemType);
      // Deterministic placement using index
      const gx = ((i * 37 + 13) % (GRID_W - 10)) * PIXEL_SIZE;
      const gy = (undergroundStartY + (i * 7) % (GRID_H - undergroundStartY - 5)) * PIXEL_SIZE;
      parts.push(spriteToRects(gem, gx, gy, PIXEL_SIZE, "gem"));
    }
  }

  // 4. Commit count text overlay
  const title = `⛏ ${commitCount.toLocaleString()} commits — ${tier.description}`;

  return wrapSvg(parts.join("\n"), SVG_WIDTH, SVG_HEIGHT, title);
}
