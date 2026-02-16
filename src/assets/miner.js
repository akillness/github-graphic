const PICKAXE_COLORS = {
  wood: { handle: "#8B4513", head: "#A0522D" },
  iron: { handle: "#8B4513", head: "#A8A8A8" },
  steel: { handle: "#8B4513", head: "#708090" },
  diamond: { handle: "#8B4513", head: "#00CED1" },
  legendary: { handle: "#FFD700", head: "#FF4500" },
};

const _ = null;
const Z = "#2A1A0E";
const Y = "#F5A623";
const H = "#FFD54F";
const y = "#E09100";
const C = "#2E7D32";
const c = "#4CAF50";
const S = "#FFDAB3";
const s = "#FFE4C4";
const n = "#E8C4A0";
const E = "#000000";
const W = "#FFFFFF";
const D = "#3D2817";
const B = "#E65100";
const b = "#FF6D00";
const o = "#BF360C";
const G = "#F5A623";
const g = "#FFD54F";
const u = "#E09100";
const O = "#5D4037";
const v = "#795548";
const w = "#3E2723";

export function getMiner(pickaxe) {
  const p = PICKAXE_COLORS[pickaxe] || PICKAXE_COLORS.wood;
  const K = p.head;
  const L = p.handle;

  return [
    [_, _, _, _, Z, H, H, H, H, H, H, Z, _, _, _, _],
    [_, _, _, Z, H, Y, Y, Y, Y, Y, Y, H, Z, _, _, _],
    [_, _, Z, H, Y, Y, c, C, C, C, Y, Y, H, Z, _, _],
    [_, Z, H, Y, Y, Y, C, C, c, C, Y, Y, Y, H, Z, _],
    [_, _, Z, s, S, S, S, S, S, S, S, S, s, Z, _, _],
    [_, _, Z, S, E, W, n, S, S, n, W, E, S, Z, _, _],
    [_, _, Z, S, W, D, D, D, D, D, W, S, Z, _, _, _],
    [_, _, _, Z, S, W, W, W, W, W, S, Z, _, _, _, _],
    [_, _, _, Z, b, B, B, B, B, B, b, Z, _, _, _, _],
    [_, Z, g, G, b, B, B, B, B, B, b, G, g, Z, _, _],
    [_, Z, G, u, o, B, B, B, B, B, o, u, L, Z, _, _],
    [_, _, Z, Z, o, B, B, B, B, B, o, Z, L, Z, _, _],
    [_, _, _, _, Z, o, B, Z, B, o, Z, Z, L, Z, _, _],
    [_, _, _, Z, v, O, O, Z, O, O, v, K, K, K, Z, _],
    [_, _, _, Z, O, w, O, Z, O, w, O, Z, Z, Z, _, _],
    [_, _, _, _, Z, Z, Z, _, Z, Z, Z, _, _, _, _, _],
  ];
}
