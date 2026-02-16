import { getMiner } from "./assets/miner.js";
import { getMineBackground, getGroundRow } from "./assets/mine.js";
import { getGem, getGemTypes } from "./assets/gems.js";
import { getCloud, getCloudPositions } from "./assets/clouds.js";
import { getRock, getRockPositions } from "./assets/rocks.js";
import { spriteToRects, wrapSvg } from "./svg-renderer.js";

const SVG_WIDTH = 800;
const SVG_HEIGHT = 400;
const PIXEL_SIZE = 4;

// Grid dimensions in "pixels"
const GRID_W = SVG_WIDTH / PIXEL_SIZE;  // 200
const GRID_H = SVG_HEIGHT / PIXEL_SIZE; // 100

export function buildScene(tier, commitCount) {
  const parts = [];

  // 1. Mine background (new sandy colors)
  const bg = getMineBackground(tier.mineDepth, GRID_W, GRID_H);
  parts.push(spriteToRects(bg, 0, 0, PIXEL_SIZE));

  // 2. Clouds in sky
  const skyRows = Math.max(2, Math.floor(GRID_H * 0.3) - tier.mineDepth);
  const cloudPositions = getCloudPositions(skyRows, GRID_W);
  for (const cp of cloudPositions) {
    const cloud = getCloud(cp.spriteIndex);
    parts.push(spriteToRects(cloud, cp.x * PIXEL_SIZE, cp.y * PIXEL_SIZE, PIXEL_SIZE, "cloud"));
  }

  // 3. Rocks along ground surface
  const groundY = getGroundRow(tier.mineDepth, GRID_H);
  const rockPositions = getRockPositions(GRID_W);
  for (const rp of rockPositions) {
    const rock = getRock(rp.spriteIndex);
    const rockY = groundY - rock.length;
    parts.push(spriteToRects(rock, rp.x * PIXEL_SIZE, rockY * PIXEL_SIZE, PIXEL_SIZE));
  }

  // 4. Miner character — placed on ground level using getGroundRow
  const miner = getMiner(tier.pickaxe);
  const minerX = (GRID_W / 2 - miner[0].length / 2) * PIXEL_SIZE;
  const minerY = (groundY - miner.length) * PIXEL_SIZE;
  parts.push(spriteToRects(miner, minerX, minerY, PIXEL_SIZE));

  // 5. Gems — scatter in underground area
  if (tier.gemCount > 0) {
    const gemTypes = getGemTypes();
    const undergroundStartY = groundY + 2;
    for (let i = 0; i < tier.gemCount; i++) {
      const gemType = gemTypes[i % gemTypes.length];
      const gem = getGem(gemType);
      const gx = ((i * 37 + 13) % (GRID_W - 10)) * PIXEL_SIZE;
      const gy = (undergroundStartY + (i * 7) % (GRID_H - undergroundStartY - 5)) * PIXEL_SIZE;
      parts.push(spriteToRects(gem, gx, gy, PIXEL_SIZE, "gem"));
    }
  }

  // 6. Game-style HUD
  parts.push(buildHud(tier, commitCount));

  return wrapSvg(parts.join("\n"), SVG_WIDTH, SVG_HEIGHT);
}

function buildHud(tier, commitCount) {
  const hud = [];

  // Top-left: commits bar
  hud.push(`<rect x="8" y="8" width="200" height="28" rx="4" fill="rgba(0,0,0,0.6)"/>`);
  hud.push(`<text x="16" y="28" font-family="monospace" font-size="14" font-weight="bold" fill="#FFFFFF">COMMITS: ${commitCount.toLocaleString()}</text>`);

  // Top-right: tier badge
  hud.push(`<rect x="${SVG_WIDTH - 158}" y="8" width="150" height="28" rx="4" fill="rgba(0,0,0,0.6)"/>`);
  hud.push(`<text x="${SVG_WIDTH - 150}" y="28" font-family="monospace" font-size="14" font-weight="bold" fill="#FFD700">TIER ${tier.level}</text>`);

  // Depth indicator below tier
  hud.push(`<text x="${SVG_WIDTH - 150}" y="52" font-family="monospace" font-size="10" fill="#CCCCCC">DEPTH: ${tier.mineDepth}m</text>`);

  // Progress bar or MAX TIER badge
  if (tier.nextLevelMinCommits !== null && tier.nextLevelMinCommits !== undefined) {
    const barX = SVG_WIDTH - 158;
    const barY = 56;
    const barW = 150;
    const barH = 10;
    const progress = Math.min(1, (commitCount - tier.minCommits) / (tier.nextLevelMinCommits - tier.minCommits));
    const fillW = Math.floor(barW * progress);

    hud.push(`<rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="2" fill="rgba(0,0,0,0.6)"/>`);
    hud.push(`<rect x="${barX}" y="${barY}" width="${fillW}" height="${barH}" rx="2" fill="#4CAF50" class="progress-bar"/>`);
  } else {
    hud.push(`<rect x="${SVG_WIDTH - 158}" y="56" width="150" height="16" rx="4" fill="rgba(0,0,0,0.6)"/>`);
    hud.push(`<text x="${SVG_WIDTH - 150}" y="69" font-family="monospace" font-size="10" font-weight="bold" fill="#FFD700">★ MAX TIER ★</text>`);
  }

  return hud.join("\n");
}
