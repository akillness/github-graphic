const _ = null;

// Ruby - Red family (dark red base, bright red highlight, white shine)
const R_DR = "#8B0000"; // Dark red (edge/deep shadow)
const R_R = "#DC143C"; // Red (base)
const R_BR = "#FF0000"; // Bright red (main facet)
const R_LR = "#FF6B6B"; // Light red (highlight)
const R_WR = "#FFB3B3"; // White-red (top shine)

// Emerald - Green family (dark green base, bright green highlight, white shine)
const E_DG = "#004d00"; // Dark green (edge/deep shadow)
const E_G = "#228B22"; // Green (base)
const E_BG = "#00CC00"; // Bright green (main facet)
const E_LG = "#66FF66"; // Light green (highlight)
const E_WG = "#B3FFB3"; // White-green (top shine)

// Diamond - Cyan/White family (light blue base, white highlight, blue shadow)
const D_DB = "#4682B4"; // Dark blue (edge/deep shadow)
const D_LB = "#87CEEB"; // Light blue (base)
const D_C = "#00FFFF"; // Cyan (main facet)
const D_W = "#E0FFFF"; // Light cyan/white (highlight)
const D_BW = "#F0FFFF"; // Bright white (shine)

// Gold - Yellow/Gold family (dark gold base, bright gold highlight, white shine)
const G_DG = "#8B6914"; // Dark gold (edge/deep shadow)
const G_G = "#DAA520"; // Gold (base)
const G_BG = "#FFD700"; // Bright gold (main facet)
const G_LG = "#FFEC8B"; // Light gold (highlight)
const G_WG = "#FFFACD"; // White-gold (top shine)

const GEM_SPRITES = {
  ruby: [
    [_, _, R_WR, _, _],
    [_, R_LR, R_BR, R_LR, _],
    [R_DR, R_BR, R_WR, R_BR, R_DR],
    [_, R_DR, R_R, R_DR, _],
    [_, _, R_DR, _, _],
  ],
  emerald: [
    [_, _, E_WG, _, _],
    [_, E_LG, E_BG, E_LG, _],
    [E_DG, E_BG, E_WG, E_BG, E_DG],
    [_, E_DG, E_G, E_DG, _],
    [_, _, E_DG, _, _],
  ],
  diamond: [
    [_, _, D_BW, _, _],
    [_, D_W, D_C, D_W, _],
    [D_DB, D_C, D_BW, D_C, D_DB],
    [_, D_DB, D_LB, D_DB, _],
    [_, _, D_DB, _, _],
  ],
  gold: [
    [_, _, G_WG, _, _],
    [_, G_LG, G_BG, G_LG, _],
    [G_DG, G_BG, G_WG, G_BG, G_DG],
    [_, G_DG, G_G, G_DG, _],
    [_, _, G_DG, _, _],
  ],
};

export function getGem(type) {
  return GEM_SPRITES[type] || GEM_SPRITES.ruby;
}

export function getGemTypes() {
  return Object.keys(GEM_SPRITES);
}
