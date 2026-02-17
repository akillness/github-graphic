import { getMiner } from "./assets/miner.js";
import { getMineBackground, getGroundRow } from "./assets/mine.js";
import { getGem, getGemTypes } from "./assets/gems.js";
import { getCloud, getCloudPositions } from "./assets/clouds.js";
import { getRock, getRockPositions } from "./assets/rocks.js";
import { getDecoration } from "./assets/decorations.js";
import { spriteToRects, wrapSvg } from "./svg-renderer.js";

const SVG_WIDTH = 800;
const SVG_HEIGHT = 400;
const PIXEL_SIZE = 4;
const MINER_PIXEL_SIZE = PIXEL_SIZE / 2; // 2 — miner renders at half pixel size for 2× detail

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

  // 3.5 Underground Decorations (Tier-based)
  const undergroundStartY = groundY;
  
  // Roots: Always present near surface (Tier 1+)
  for (let x = 0; x < GRID_W; x += 12) {
    if (Math.random() > 0.7) {
      parts.push(spriteToRects(getDecoration("root_1"), x * PIXEL_SIZE, undergroundStartY * PIXEL_SIZE, PIXEL_SIZE));
    }
  }

  // Beams & Supports (Tier 2+: Depth > 4)
  if (tier.mineDepth > 4) {
    for (let y = undergroundStartY + 8; y < GRID_H - 5; y += 10) {
      // Side Supports
      parts.push(spriteToRects(getDecoration("beam_vertical"), 8 * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE));
      parts.push(spriteToRects(getDecoration("beam_vertical"), (GRID_W - 12) * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE));
      
      // Tier 3+ (Depth > 7): Cross beams and Lanterns
      if (tier.mineDepth > 7 && Math.random() > 0.6) {
         const bx = 20 + Math.floor(Math.random() * (GRID_W - 40));
         parts.push(spriteToRects(getDecoration("beam_horizontal"), bx * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE));
         
         // Lanterns on beams
         if (Math.random() > 0.4) {
            parts.push(spriteToRects(getDecoration("lantern"), (bx + 1) * PIXEL_SIZE, (y + 2) * PIXEL_SIZE, PIXEL_SIZE));
         }
      }
    }
  }

  // Deep Decorations (Tier 4+: Depth > 10): Glowing Mushrooms
  if (tier.mineDepth > 10) {
    for (let i = 0; i < 8; i++) {
       const mx = (15 + Math.random() * (GRID_W - 30));
       const my = (undergroundStartY + 15 + Math.random() * (GRID_H - undergroundStartY - 20));
       parts.push(spriteToRects(getDecoration("mushroom"), mx * PIXEL_SIZE, my * PIXEL_SIZE, PIXEL_SIZE));
    }
  }

  // 3.6 New Gamification Assets (Bats, Skulls, Chests)
  if (tier.mineDepth > 5) {
    // Bats in the upper cave
    for (let i = 0; i < tier.mineDepth; i++) {
        if (Math.random() > 0.7) {
            const bx = (Math.random() * (GRID_W - 10));
            const by = undergroundStartY + 5 + Math.random() * 10;
            parts.push(spriteToRects(getDecoration("bat"), bx * PIXEL_SIZE, by * PIXEL_SIZE, PIXEL_SIZE));
        }
    }
  }

  if (tier.mineDepth > 8) {
      // Skulls in the deep
      for (let i = 0; i < 5; i++) {
          const sx = (Math.random() * (GRID_W - 10));
          const sy = undergroundStartY + 20 + Math.random() * (GRID_H - undergroundStartY - 30);
          parts.push(spriteToRects(getDecoration("skull"), sx * PIXEL_SIZE, sy * PIXEL_SIZE, PIXEL_SIZE));
      }
  }

  if (tier.mineDepth > 10) {
      // Legendary Treasure Chest at the bottom
      const chestX = (GRID_W / 2) + 15; // Offset slightly from center
      const chestY = GRID_H - 8;
      parts.push(spriteToRects(getDecoration("chest"), chestX * PIXEL_SIZE, chestY * PIXEL_SIZE, PIXEL_SIZE));
  }

  // 4. Miner character — mixed resolution: 32×32 sprite at MINER_PIXEL_SIZE for detail
  const miner = getMiner(tier.pickaxe);
  const minerSvgW = miner[0].length * MINER_PIXEL_SIZE;
  const minerSvgH = miner.length * MINER_PIXEL_SIZE;
  const minerX = (SVG_WIDTH - minerSvgW) / 2;
  const minerY = groundY * PIXEL_SIZE - minerSvgH;
  parts.push(spriteToRects(miner, minerX, minerY, MINER_PIXEL_SIZE));

  // 4.5 Sparkles for High Tier
  if (tier.pickaxe === "diamond" || tier.pickaxe === "legendary") {
      const sparkleColor = tier.pickaxe === "legendary" ? "#FFD700" : "#E0FFFF";
      for (let i = 0; i < 5; i++) {
          const sx = minerX + Math.random() * minerSvgW;
          const sy = minerY + Math.random() * minerSvgH;
          // Simple 2x2 pixel sparkle
          parts.push(`<rect x="${sx}" y="${sy}" width="${PIXEL_SIZE/2}" height="${PIXEL_SIZE/2}" fill="${sparkleColor}" opacity="0.8">
            <animate attributeName="opacity" values="0;1;0" dur="${0.5 + Math.random()}s" repeatCount="indefinite" />
          </rect>`);
      }
  }

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

  const fontFamily = "'Press Start 2P', monospace";

  // Top-left: commits bar
  hud.push(`<rect x="8" y="8" width="220" height="28" rx="4" fill="rgba(0,0,0,0.6)"/>`);
  hud.push(`<text x="16" y="27" font-family="${fontFamily}" font-size="10" fill="#FFFFFF">COMMITS: ${commitCount.toLocaleString()}</text>`);

  // Top-right: tier badge
  hud.push(`<rect x="${SVG_WIDTH - 158}" y="8" width="150" height="28" rx="4" fill="rgba(0,0,0,0.6)"/>`);
  hud.push(`<text x="${SVG_WIDTH - 150}" y="27" font-family="${fontFamily}" font-size="10" fill="#FFD700">TIER ${tier.level}</text>`);

  // Depth indicator below tier
  hud.push(`<text x="${SVG_WIDTH - 150}" y="50" font-family="${fontFamily}" font-size="8" fill="#CCCCCC">DEPTH: ${tier.mineDepth}m</text>`);

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
    hud.push(`<text x="${SVG_WIDTH - 150}" y="69" font-family="${fontFamily}" font-size="8" fill="#FFD700">★ MAX TIER ★</text>`);
  }

  return hud.join("\n");
}
