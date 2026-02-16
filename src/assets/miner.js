const PICKAXE_COLORS = {
  wood: { handle: "#8B4513", head: "#A0522D" },
  iron: { handle: "#8B4513", head: "#A8A8A8" },
  steel: { handle: "#8B4513", head: "#708090" },
  diamond: { handle: "#8B4513", head: "#00CED1" },
  legendary: { handle: "#FFD700", head: "#FF4500" },
};

const _ = null;
const Y = "#F5A623"; // yellow helmet
const C = "#2E7D32"; // green cross on helmet
const S = "#FFDAB3"; // skin tone
const E = "#000000"; // eyes
const W = "#FFFFFF"; // white teeth / big grin
const B = "#E65100"; // orange outfit
const G = "#F5A623"; // yellow gloves (matches helmet)
const O = "#5D4037"; // brown boots

export function getMiner(pickaxe) {
  const c = PICKAXE_COLORS[pickaxe] || PICKAXE_COLORS.wood;
  const K = c.head;    // pickaxe head
  const L = c.handle;  // pickaxe handle

  // 16x16 굴착소년쿵-style miner: yellow helmet, green cross, big grin
  return [
    [_, _, _, _, _, Y, Y, Y, Y, Y, Y, _, _, _, _, _],
    [_, _, _, _, Y, Y, Y, Y, Y, Y, Y, Y, _, _, _, _],
    [_, _, _, Y, Y, Y, C, C, C, Y, Y, Y, Y, _, _, _],
    [_, _, Y, Y, Y, Y, C, C, C, Y, Y, Y, Y, Y, _, _],
    [_, _, _, S, S, S, S, S, S, S, S, S, S, _, _, _],
    [_, _, _, S, E, E, S, S, S, E, E, S, _, _, _, _],
    [_, _, _, S, W, W, W, W, W, W, W, S, _, _, _, _],
    [_, _, _, _, S, W, W, W, W, W, S, _, _, _, _, _],
    [_, _, _, _, B, B, B, B, B, B, B, _, _, _, _, _],
    [_, _, G, G, B, B, B, B, B, B, B, G, G, _, _, _],
    [_, _, G, G, B, B, B, B, B, B, B, G, L, _, _, _],
    [_, _, _, _, B, B, B, B, B, B, B, _, L, _, _, _],
    [_, _, _, _, _, B, B, _, B, B, _, _, L, _, _, _],
    [_, _, _, _, _, B, B, _, B, B, _, K, K, K, _, _],
    [_, _, _, _, O, O, O, _, O, O, O, _, _, _, _, _],
    [_, _, _, _, O, O, O, _, O, O, O, _, _, _, _, _],
  ];
}
