/**
 * Milestone petroglyph sprites — 7x7 pixel "cave carvings"
 * Displayed in an achievement alcove panel on the left underground wall.
 * 3-color system: dark groove, deep shadow, highlight edge.
 */

const _ = null;
const C = "#5C3D1E"; // Carved groove (dark — high contrast against wall)
const D = "#3A2510"; // Deep shadow (very dark center)
const H = "#E8D5A0"; // Highlight edge (light — simulates light catching carved edge)

// Unearned niche fill color (blank dark stone)
export const NICHE_EMPTY = "#5C4A3A";
// Niche border color
export const NICHE_BORDER = "#4A3828";
// Panel border color (matches heatmap border for consistency)
export const PANEL_BORDER = "#3D2E1F";

const PETROGLYPH_SPRITES = {
  // Pickaxe — First Steps (50+ contributions)
  pickaxe: [
    [_, _, _, _, C, H, _],
    [_, _, _, C, D, _, _],
    [_, _, C, D, _, _, _],
    [_, C, D, H, _, _, _],
    [C, D, _, _, _, _, _],
    [C, _, _, _, _, _, _],
    [H, _, _, _, _, _, _],
  ],

  // Star — Century (100+ contributions)
  star: [
    [_, _, _, H, _, _, _],
    [_, _, C, D, C, _, _],
    [_, C, D, D, D, C, _],
    [H, D, D, D, D, D, H],
    [_, C, D, D, D, C, _],
    [_, _, C, D, C, _, _],
    [_, _, _, C, _, _, _],
  ],

  // Double Pickaxe — Dedicated (500+ contributions)
  double_pickaxe: [
    [C, H, _, _, _, H, C],
    [C, D, _, _, _, D, C],
    [_, C, _, _, _, C, _],
    [_, C, D, _, D, C, _],
    [_, _, C, _, C, _, _],
    [_, _, C, _, C, _, _],
    [_, H, D, _, D, H, _],
  ],

  // Diamond — Veteran (1000+ contributions)
  diamond: [
    [_, _, _, H, _, _, _],
    [_, _, H, D, C, _, _],
    [_, H, D, C, D, C, _],
    [H, D, C, D, C, D, C],
    [_, C, D, C, D, C, _],
    [_, _, C, D, C, _, _],
    [_, _, _, C, _, _, _],
  ],

  // Crown — Master (2500+ contributions)
  crown: [
    [H, _, _, H, _, _, H],
    [C, _, C, D, C, _, C],
    [C, C, D, D, D, C, C],
    [C, D, D, D, D, D, C],
    [_, C, D, D, D, C, _],
    [_, _, C, D, C, _, _],
    [_, _, H, C, H, _, _],
  ],

  // Trophy — Legend (5000+ contributions)
  trophy: [
    [_, _, H, C, H, _, _],
    [_, H, C, D, C, H, _],
    [H, C, D, D, D, C, H],
    [_, H, C, D, C, H, _],
    [_, _, _, C, _, _, _],
    [_, _, C, D, C, _, _],
    [_, _, H, D, H, _, _],
  ],

  // Small Flame — Streak Starter (7+ day streak)
  small_flame: [
    [_, _, _, H, _, _, _],
    [_, _, H, C, _, _, _],
    [_, _, C, D, H, _, _],
    [_, H, C, D, C, _, _],
    [_, C, D, D, C, _, _],
    [H, C, D, D, D, C, _],
    [_, C, C, C, C, _, _],
  ],

  // Large Flame — Streak Master (30+ day streak)
  large_flame: [
    [_, _, H, _, H, _, _],
    [_, H, C, H, C, _, _],
    [H, C, D, C, D, H, _],
    [C, D, D, D, D, C, _],
    [C, D, D, D, D, C, H],
    [C, C, D, D, D, C, _],
    [_, H, C, C, C, H, _],
  ],
};

/** Fixed slot order for the achievement alcove (4 columns × 2 rows) */
export const MILESTONE_SLOTS = [
  // Row 1: contribution milestones
  "pickaxe", "star", "double_pickaxe", "diamond",
  // Row 2: high contribution + streak milestones
  "crown", "trophy", "small_flame", "large_flame",
];

export function getPetroglyph(icon) {
  return PETROGLYPH_SPRITES[icon] || PETROGLYPH_SPRITES.pickaxe;
}
