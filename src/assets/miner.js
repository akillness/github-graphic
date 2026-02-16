const PICKAXE_COLORS = {
  wood: { handle: "#8B4513", head: "#A0522D" },
  iron: { handle: "#8B4513", head: "#A8A8A8" },
  steel: { handle: "#8B4513", head: "#708090" },
  diamond: { handle: "#8B4513", head: "#00CED1" },
  legendary: { handle: "#FFD700", head: "#FF4500" },
};

const _ = null;
const S = "#F5DEB3"; // skin
const H = "#4A3728"; // hair
const B = "#1E90FF"; // blue shirt
const P = "#2F4F4F"; // pants
const E = "#000000"; // eyes
const O = "#8B4513"; // boots

export function getMiner(pickaxe) {
  const c = PICKAXE_COLORS[pickaxe] || PICKAXE_COLORS.wood;
  const K = c.head;    // pickaxe head
  const L = c.handle;  // pickaxe handle

  // 16x16 miner sprite facing right, holding pickaxe
  return [
    [_, _, _, _, _, H, H, H, H, _, _, _, _, _, _, _],
    [_, _, _, _, H, H, H, H, H, H, _, _, _, _, _, _],
    [_, _, _, _, H, H, H, H, H, H, _, _, _, _, _, _],
    [_, _, _, _, S, S, S, S, S, S, _, _, _, _, _, _],
    [_, _, _, _, S, E, S, S, E, S, _, _, _, _, _, _],
    [_, _, _, _, S, S, S, S, S, S, _, _, _, _, _, _],
    [_, _, _, _, _, S, S, S, S, _, _, _, _, _, _, _],
    [_, _, _, B, B, B, B, B, B, B, B, _, L, _, _, _],
    [_, _, _, B, B, B, B, B, B, B, B, _, L, _, _, _],
    [_, _, _, _, B, B, B, B, B, B, _, _, L, _, _, _],
    [_, _, _, _, S, B, B, B, B, S, _, L, _, _, _, _],
    [_, _, _, _, _, P, P, P, P, _, K, K, K, _, _, _],
    [_, _, _, _, _, P, P, P, P, _, _, _, _, _, _, _],
    [_, _, _, _, _, P, _, _, P, _, _, _, _, _, _, _],
    [_, _, _, _, _, P, _, _, P, _, _, _, _, _, _, _],
    [_, _, _, _, O, O, _, _, O, O, _, _, _, _, _, _],
  ];
}
