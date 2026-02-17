const _ = null;

// Cute Wood Colors (Warmer, lighter)
const W_D = "#8D6E63"; // Darker brown
const W_M = "#A1887F"; // Medium brown
const W_L = "#D7CCC8"; // Light beige highlight

// Cute Fire/Light Colors
const F_R = "#FFAB91"; // Soft Red
const F_O = "#FFCC80"; // Soft Orange
const F_Y = "#FFF59D"; // Soft Yellow

// Lantern Metal
const M_D = "#546E7A"; // Blue-grey metal

// Cute Root Colors
const R_D = "#795548"; 
const R_L = "#A1887F";

// Chest Colors
const C_G = "#FFD700"; // Gold
const C_B = "#8B4513"; // Brown
const C_L = "#CD853F"; // Light Brown

// Bat/Skull Colors
const B_K = "#1a1a1a"; // Black/Dark Grey
const S_W = "#E0E0E0"; // Skull White

const DECORATION_SPRITES = {
  // 5x5 Wooden Beam (Vertical - Rounded)
  beam_vertical: [
    [_, W_D, W_D, _, _],
    [_, W_M, W_L, W_D, _],
    [_, W_M, W_M, W_D, _],
    [_, W_M, W_L, W_D, _],
    [_, W_D, W_D, _, _],
  ],
  // 5x5 Wooden Beam (Horizontal - Rounded)
  beam_horizontal: [
    [_, _, _, _, _],
    [W_D, W_M, W_M, W_M, W_D],
    [W_D, W_L, W_L, W_L, W_D],
    [W_D, W_D, W_D, W_D, W_D],
    [_, _, _, _, _],
  ],
  // 5x5 Cute Lantern (Hanging)
  lantern: [
    [_, _, M_D, _, _],
    [_, M_D, M_D, M_D, _],
    [_, F_O, F_Y, F_O, _], // Glowing center
    [_, M_D, M_D, M_D, _],
    [_, _, _, _, _],
  ],
  // 5x5 Mushroom (Glowing - for deep mines)
  mushroom: [
    [_, _, _, _, _],
    [_, F_R, F_R, _, _], // Red cap
    [F_R, F_Y, F_Y, F_R, _], // Spots
    [_, W_L, W_L, _, _], // Stem
    [_, W_L, W_L, _, _],
  ],
  // 5x5 Root (Curvy)
  root_1: [
    [R_D, _, _, _, _],
    [_, R_L, _, _, _],
    [_, _, R_D, R_L, _],
    [_, _, _, _, _],
    [_, _, _, _, _],
  ],
  // 7x6 Treasure Chest
  chest: [
    [_, C_G, C_G, C_G, C_G, C_G, _],
    [C_G, C_B, C_B, C_B, C_B, C_B, C_G],
    [C_G, C_L, C_L, C_G, C_L, C_L, C_G],
    [C_G, C_B, C_B, C_G, C_B, C_B, C_G],
    [C_G, C_B, C_B, C_B, C_B, C_B, C_G],
    [_, C_G, C_G, C_G, C_G, C_G, _],
  ],
  // 5x4 Bat (Hanging/Flying)
  bat: [
    [B_K, _, B_K, _, B_K],
    [_, B_K, B_K, B_K, _],
    [B_K, _, B_K, _, B_K],
    [B_K, _, _, _, B_K],
  ],
  // 5x5 Skull
  skull: [
    [_, S_W, S_W, S_W, _],
    [S_W, S_W, S_W, S_W, S_W],
    [S_W, B_K, S_W, B_K, S_W],
    [_, S_W, S_W, S_W, _],
    [_, S_W, _, S_W, _],
  ],
};

export function getDecoration(type) {
  return DECORATION_SPRITES[type] || DECORATION_SPRITES.beam_vertical;
}