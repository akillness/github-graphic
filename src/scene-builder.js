import { getMiner } from "./assets/miner.js";
import { getMineBackground, getGroundRow } from "./assets/mine.js";
import { getGem, getGemTypes } from "./assets/gems.js";
import { getCloud, getCloudPositions } from "./assets/clouds.js";
import { getRock, getRockPositions } from "./assets/rocks.js";
import { getDecoration } from "./assets/decorations.js";
import { spriteToRects, wrapSvg } from "./svg-renderer.js";
import { OreGenerator } from "./ore-generator.js";
import { getAssetDensity } from "./tiers.js";

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
  const undergroundHeight = GRID_H - undergroundStartY;

  // Roots: Controlled placement (Tier 1+)
  const rootDensity = getAssetDensity("roots", tier.level);
  const rootCount = rootDensity?.targetCount ?? 10;
  const rootMinDist = rootDensity?.minDistance ?? 5;
  const rootPositions = OreGenerator.generateRandomPositions(
    rootCount, GRID_W, 5, rootMinDist
  );
  for (const pos of rootPositions) {
    parts.push(spriteToRects(getDecoration("root_1"), pos.x * PIXEL_SIZE, (undergroundStartY + pos.y) * PIXEL_SIZE, PIXEL_SIZE));
  }

  // Beams & Supports (Tier 2+: Depth > 4) - Controlled count
  if (tier.mineDepth > 4) {
    const areaHeight = GRID_H - undergroundStartY - 10;
    const beamDensity = getAssetDensity("beams", tier.level);

    // Vertical beams - controlled by tier
    const numVertical = beamDensity?.vertical ?? Math.min(Math.floor(areaHeight / 3) * 2, 8);
    for(let i=0; i<numVertical; i++) {
        const vx = Math.random() * (GRID_W - 10);
        const vy = undergroundStartY + 5 + Math.random() * areaHeight;
        parts.push(spriteToRects(getDecoration("beam_vertical"), vx * PIXEL_SIZE, vy * PIXEL_SIZE, PIXEL_SIZE));
    }

    // Tier 3+ (Depth > 7): Horizontal beams and Lanterns
    if (tier.mineDepth > 7) {
       const numHorizontal = beamDensity?.horizontal ?? Math.min(Math.floor(areaHeight / 6), 4);
       for(let i=0; i<numHorizontal; i++) {
           const hx = Math.random() * (GRID_W - 10);
           const hy = undergroundStartY + 5 + Math.random() * areaHeight;
           parts.push(spriteToRects(getDecoration("beam_horizontal"), hx * PIXEL_SIZE, hy * PIXEL_SIZE, PIXEL_SIZE));

           if (Math.random() > 0.4) {
              parts.push(spriteToRects(getDecoration("lantern"), (hx + 1) * PIXEL_SIZE, (hy + 2) * PIXEL_SIZE, PIXEL_SIZE));
           }
       }
    }
  }

  // Deep Decorations (Tier 4+: Depth > 10): Glowing Mushrooms - Controlled placement
  if (tier.mineDepth > 10) {
     const mushDensity = getAssetDensity("mushrooms", tier.level);
     const mushCount = mushDensity?.targetCount ?? 10;
     const mushMinDist = mushDensity?.minDistance ?? 8;

     // Place mushrooms in deep area only (y >= 15)
     const mushPositions = OreGenerator.generateRandomPositions(
       mushCount, GRID_W, undergroundHeight - 15, mushMinDist
     );
     for (const pos of mushPositions) {
       parts.push(spriteToRects(
         getDecoration("mushroom"),
         pos.x * PIXEL_SIZE,
         (undergroundStartY + 15 + pos.y) * PIXEL_SIZE,
         PIXEL_SIZE
       ));
     }
  }

  // 3.6 New Gamification Assets (Bats, Skulls, Chests) - Controlled counts
  if (tier.mineDepth > 5) {
    // Bats in the upper cave - controlled by tier
    const batDensity = getAssetDensity("bats", tier.level);
    const maxBats = batDensity?.maxCount ?? 3;
    for (let i = 0; i < maxBats; i++) {
        const bx = (Math.random() * (GRID_W - 10));
        const by = undergroundStartY + 5 + Math.random() * 10;
        parts.push(spriteToRects(getDecoration("bat"), bx * PIXEL_SIZE, by * PIXEL_SIZE, PIXEL_SIZE));
    }
  }

  if (tier.mineDepth > 8) {
      // Skulls in the deep - controlled by tier
      const skullDensity = getAssetDensity("skulls", tier.level);
      const maxSkulls = skullDensity?.maxCount ?? 3;
      for (let i = 0; i < maxSkulls; i++) {
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

  // 5. Gems — Vein-based placement (Minecraft-style ore veins)
  if (tier.gemCount > 0) {
    const gemTypes = getGemTypes();
    const gemDensity = getAssetDensity("gems", tier.level);

    // Determine gem count based on tier density config
    const targetGems = gemDensity?.targetCount ?? tier.gemCount;

    // Scattered distribution with depth bias and density zones
    const gemMinDist = gemDensity?.minDistance ?? 5;
    const gemPositions = OreGenerator.generateScattered(
      targetGems,
      GRID_W - 4,
      undergroundHeight - 4,
      {
        minDistance: gemMinDist,
        depthBias: 0.6,
        noiseScale: 0.04,
        densityContrast: 0.35,
        outlierRatio: 0.12,
        margin: 2,
      }
    );

    for (const pos of gemPositions) {
      // Bounds check with offset
      const gx = pos.x + 2;
      const gy = pos.y + 2;
      if (gx >= 2 && gx < GRID_W - 2 && gy >= 2 && gy < undergroundHeight - 2) {
        const gemType = gemTypes[Math.floor(Math.random() * gemTypes.length)];
        parts.push(spriteToRects(
          getGem(gemType),
          gx * PIXEL_SIZE,
          (undergroundStartY + gy) * PIXEL_SIZE,
          PIXEL_SIZE,
          "gem"
        ));
      }
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
