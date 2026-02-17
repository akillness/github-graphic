import { getMiner } from "./assets/miner.js";
import { getMineBackground, getGroundRow } from "./assets/mine.js";
import { getGem, getGemTypes } from "./assets/gems.js";
import { getCloud, getCloudPositions } from "./assets/clouds.js";
import { getRock, getRockPositions } from "./assets/rocks.js";
import { getDecoration } from "./assets/decorations.js";
import { getPetroglyph, MILESTONE_SLOTS, NICHE_EMPTY, NICHE_BORDER, PANEL_BORDER } from "./assets/petroglyphs.js";
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

export function buildScene(tier, commitCount, activity) {
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

  // 3.7 Achievement Alcove — grouped milestone panel on the left underground wall
  if (activity && activity.milestones.length > 0) {
    const earnedIcons = new Set(activity.milestones.map((m) => m.icon));

    // Layout: 4 columns × 2 rows of 7x7 icon niches
    const ICON_SIZE = 7;        // 7x7 logical pixels per icon
    const NICHE_PAD = 1;        // 1px padding around each icon inside niche
    const NICHE_SIZE = ICON_SIZE + NICHE_PAD * 2; // 9px per niche slot
    const COLS = 4;
    const ROWS = 2;
    const GAP = 1;              // 1px gap between niches
    const BORDER = 1;           // 1px panel border

    const panelW = BORDER + COLS * NICHE_SIZE + (COLS - 1) * GAP + BORDER; // 1 + 36 + 3 + 1 = 41
    const panelH = BORDER + ROWS * NICHE_SIZE + (ROWS - 1) * GAP + BORDER; // 1 + 18 + 1 + 1 = 21

    // Position: left side, vertically centered in underground
    const alcoveGridX = 4;
    const alcoveGridY = undergroundStartY + Math.floor((undergroundHeight - panelH) / 2);
    const alcoveX = alcoveGridX * PIXEL_SIZE;
    const alcoveY = alcoveGridY * PIXEL_SIZE;

    // Panel border
    parts.push(`<rect x="${alcoveX}" y="${alcoveY}" width="${panelW * PIXEL_SIZE}" height="${panelH * PIXEL_SIZE}" fill="${PANEL_BORDER}" rx="2"/>`);

    // Render each slot
    for (let slot = 0; slot < MILESTONE_SLOTS.length; slot++) {
      const col = slot % COLS;
      const row = Math.floor(slot / COLS);
      const nicheX = alcoveX + (BORDER + col * (NICHE_SIZE + GAP)) * PIXEL_SIZE;
      const nicheY = alcoveY + (BORDER + row * (NICHE_SIZE + GAP)) * PIXEL_SIZE;

      // Niche border
      parts.push(`<rect x="${nicheX}" y="${nicheY}" width="${NICHE_SIZE * PIXEL_SIZE}" height="${NICHE_SIZE * PIXEL_SIZE}" fill="${NICHE_BORDER}" rx="1"/>`);

      const icon = MILESTONE_SLOTS[slot];
      if (earnedIcons.has(icon)) {
        // Earned: render carved icon inside the niche
        const iconX = nicheX + NICHE_PAD * PIXEL_SIZE;
        const iconY = nicheY + NICHE_PAD * PIXEL_SIZE;
        parts.push(spriteToRects(getPetroglyph(icon), iconX, iconY, PIXEL_SIZE));
      } else {
        // Unearned: blank dark stone fill (inset from niche border)
        const innerX = nicheX + NICHE_PAD * PIXEL_SIZE;
        const innerY = nicheY + NICHE_PAD * PIXEL_SIZE;
        parts.push(`<rect x="${innerX}" y="${innerY}" width="${ICON_SIZE * PIXEL_SIZE}" height="${ICON_SIZE * PIXEL_SIZE}" fill="${NICHE_EMPTY}"/>`);
      }
    }
  }

  // 4. Miner character — mixed resolution: 32×32 sprite at MINER_PIXEL_SIZE for detail
  const minerState = activity
    ? activity.isActiveToday ? "active"
    : activity.daysSinceLastCommit >= 7 ? "idle"
    : "normal"
    : "normal";
  const miner = getMiner(tier.pickaxe, minerState);
  const minerSvgW = miner[0].length * MINER_PIXEL_SIZE;
  const minerSvgH = miner.length * MINER_PIXEL_SIZE;
  const minerX = (SVG_WIDTH - minerSvgW) / 2;
  const minerY = groundY * PIXEL_SIZE - minerSvgH;

  if (minerState === "idle") {
    // Wrap miner in a group with reduced opacity
    parts.push(`<g opacity="0.65">`);
    parts.push(spriteToRects(miner, minerX, minerY, MINER_PIXEL_SIZE));
    parts.push(`</g>`);

    // Floating "zzz" text above miner head
    const fontFamily = "'Press Start 2P', monospace";
    const zzzX = minerX + minerSvgW / 2 + 12;
    const zzzY = minerY - 8;
    parts.push(`<text x="${zzzX}" y="${zzzY}" font-family="${fontFamily}" font-size="8" fill="#FFFFFF" opacity="0.6" class="pulse">zzz</text>`);
    parts.push(`<text x="${zzzX + 16}" y="${zzzY - 12}" font-family="${fontFamily}" font-size="6" fill="#FFFFFF" opacity="0.4" class="pulse">z</text>`);
  } else if (minerState === "active") {
    // Split miner into body + pickaxe for swing animation
    // Pickaxe pixels: rows 23-26, cols >= 19 (non-null)
    const bodyRects = [];
    const pickaxeRects = [];

    for (let y = 0; y < miner.length; y++) {
      for (let x = 0; x < miner[y].length; x++) {
        const color = miner[y][x];
        if (color === null) continue;

        const rx = minerX + x * MINER_PIXEL_SIZE;
        const ry = minerY + y * MINER_PIXEL_SIZE;
        const rect = `<rect x="${rx}" y="${ry}" width="${MINER_PIXEL_SIZE}" height="${MINER_PIXEL_SIZE}" fill="${color}"/>`;

        const isPickaxe = y >= 23 && y <= 26 && x >= 19;
        if (isPickaxe) {
          pickaxeRects.push(rect);
        } else {
          bodyRects.push(rect);
        }
      }
    }

    // Render body (static)
    parts.push(bodyRects.join("\n"));

    // Render pickaxe with swing animation
    // Pivot at (col 19, row 24) — where arm connects to pickaxe
    const pivotX = minerX + 19 * MINER_PIXEL_SIZE;
    const pivotY = minerY + 24 * MINER_PIXEL_SIZE;
    const swingAngle = -40;

    parts.push(`<g>`);
    parts.push(pickaxeRects.join("\n"));
    parts.push(`<animateTransform attributeName="transform" type="rotate" values="0 ${pivotX} ${pivotY}; ${swingAngle} ${pivotX} ${pivotY}; 0 ${pivotX} ${pivotY}" dur="1.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>`);
    parts.push(`</g>`);

    // Anime-style swoosh arcs — speed lines along the pickaxe swing path
    // The pickaxe head traces an arc from ~63° to ~23° (in SVG coords) around the pivot
    const swooshConfigs = [
      { radius: 10, strokeWidth: 1,   color: "#FFFFFF", startDeg: 70, endDeg: 20 },
      { radius: 14, strokeWidth: 1.5, color: "#FFFFFF", startDeg: 75, endDeg: 15 },
      { radius: 18, strokeWidth: 1,   color: "#E0E0E0", startDeg: 80, endDeg: 10 },
    ];

    for (const sw of swooshConfigs) {
      const toRad = (d) => (d * Math.PI) / 180;
      const x1 = pivotX + sw.radius * Math.cos(toRad(sw.startDeg));
      const y1 = pivotY + sw.radius * Math.sin(toRad(sw.startDeg));
      const x2 = pivotX + sw.radius * Math.cos(toRad(sw.endDeg));
      const y2 = pivotY + sw.radius * Math.sin(toRad(sw.endDeg));

      // Arc path: sweep-flag=0 for counterclockwise
      // Opacity timed to downstroke: invisible during upswing (0-0.5s), flash on downswing (0.6-1.0s)
      parts.push(`<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${sw.radius} ${sw.radius} 0 0 0 ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${sw.color}" stroke-width="${sw.strokeWidth}" stroke-linecap="round" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;0.9;0.3;0" dur="1.2s" repeatCount="indefinite"/>
      </path>`);
    }

    // Spark particles near pickaxe head (impact sparks)
    const sparkColors = ["#FFD700", "#FF6B35", "#FFFFFF", "#FFA500"];
    const pickaxeX = minerX + 20 * MINER_PIXEL_SIZE;
    const pickaxeY = minerY + 25 * MINER_PIXEL_SIZE;
    for (let i = 0; i < 6; i++) {
      const sx = pickaxeX + (Math.random() * 16) - 4;
      const sy = pickaxeY + (Math.random() * 12) - 6;
      const size = 1 + Math.floor(Math.random() * 2);
      const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
      parts.push(`<rect x="${sx}" y="${sy}" width="${size}" height="${size}" fill="${color}" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;1;0.4;0" dur="1.2s" repeatCount="indefinite" />
      </rect>`);
    }
  } else {
    parts.push(spriteToRects(miner, minerX, minerY, MINER_PIXEL_SIZE));
  }

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
  parts.push(buildHud(tier, commitCount, activity));

  return wrapSvg(parts.join("\n"), SVG_WIDTH, SVG_HEIGHT);
}

function buildHud(tier, commitCount, activity) {
  const hud = [];

  const fontFamily = "'Press Start 2P', monospace";

  // Top-left: commits bar
  hud.push(`<rect x="8" y="8" width="220" height="28" rx="4" fill="rgba(0,0,0,0.6)"/>`);
  hud.push(`<text x="16" y="27" font-family="${fontFamily}" font-size="10" fill="#FFFFFF">COMMITS: ${commitCount.toLocaleString()}</text>`);

  // Below commits: streak display
  if (activity && activity.currentStreak > 0) {
    const streak = activity.currentStreak;
    let streakColor = "#FFFFFF";          // 1-6 days: white
    let streakClass = "";
    if (streak >= 30) {
      streakColor = "#FFD700";            // 30+ days: gold + pulse
      streakClass = ' class="pulse"';
    } else if (streak >= 7) {
      streakColor = "#FFD700";            // 7-29 days: gold
    }
    hud.push(`<rect x="8" y="42" width="180" height="22" rx="4" fill="rgba(0,0,0,0.6)"/>`);
    hud.push(`<text x="16" y="58" font-family="${fontFamily}" font-size="8" fill="${streakColor}"${streakClass}>STREAK: ${streak}d</text>`);
  }

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
