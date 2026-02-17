const PICKAXE_COLORS = {
  wood: { handle: "#8B4513", head: "#A0522D" },
  iron: { handle: "#8B4513", head: "#A8A8A8" },
  steel: { handle: "#8B4513", head: "#708090" },
  diamond: { handle: "#8B4513", head: "#00CED1" },
  legendary: { handle: "#FFD700", head: "#FF4500" },
};

const _ = null;

// Outline
const OL = "#1A1A1A"; 

// Helmet (Yellow)
const HY = "#FDD835"; // Main Yellow
const HL = "#FFF176"; // Highlight
const HD = "#FBC02D"; // Shadow

// Wings (White)
const WN = "#FFFFFF";
const WG = "#E0E0E0"; // Wing Grey/Shadow

// Green Cross
const GC = "#43A047"; // Green
const CP = "#FFF9C4"; // Cross Plate (Pale Yellow/White background)

// Skin
const SK = "#FFCCBC"; // Skin base
const CH = "#FF8A65"; // Cheek Blush (Pinkish/Orange)

// Face features
const EY = "#000000"; // Eyes
const MO = "#000000"; // Mouth (Open black oval)

// Body (Brown/Orange)
const BO = "#8D6E63"; // Brown Outfit
const BD = "#5D4037"; // Dark Brown Shadow
const PK = "#EF6C00"; // Pocket Orange

// Shoes (Yellow)
const SY = "#FDD835";
const SD = "#F9A825";

export function getMiner(pickaxe, state = "normal") {
  const p = PICKAXE_COLORS[pickaxe] || PICKAXE_COLORS.wood;
  const K = p.head;   // Pickaxe Head
  const L = p.handle; // Pickaxe Handle

  const sprite = [
    //         0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31
    /* R00 */ [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R01 */ [_, _, _, _, _, _, _, _, _, _, _, OL, OL, OL, OL, OL, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R02 */ [_, _, _, _, _, _, _, _, _, OL, OL, HY, HY, HY, HL, HL, HY, OL, OL, _, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R03 */ [_, _, _, _, _, _, _, _, OL, HY, HY, HY, HY, HY, HL, HL, HY, HY, HY, OL, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R04 */ [_, _, _, _, _, _, OL, OL, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, OL, OL, _, _, _, _, _, _, _, _, _, _, _],
    /* R05 */ [_, _, _, _, _, OL, WN, WN, OL, HY, HY, CP, CP, CP, CP, HY, HY, HY, OL, WN, WN, OL, _, _, _, _, _, _, _, _, _, _],
    /* R06 */ [_, _, _, _, OL, WN, WN, WN, OL, HY, CP, CP, GC, GC, CP, CP, HY, HY, OL, WN, WN, WN, OL, _, _, _, _, _, _, _, _, _],
    /* R07 */ [_, _, _, _, OL, WN, WN, WN, OL, HY, CP, GC, GC, GC, GC, CP, HY, HY, OL, WN, WN, WN, OL, _, _, _, _, _, _, _, _, _],
    /* R08 */ [_, _, _, _, OL, WN, WG, WN, OL, HY, CP, GC, GC, GC, GC, CP, HY, HY, OL, WN, WG, WN, OL, _, _, _, _, _, _, _, _, _],
    /* R09 */ [_, _, _, _, OL, WG, WG, WG, OL, HY, CP, CP, GC, GC, CP, CP, HY, HY, OL, WG, WG, WG, OL, _, _, _, _, _, _, _, _, _],
    /* R10 */ [_, _, _, _, _, OL, OL, OL, HY, HY, HY, CP, CP, CP, CP, HY, HY, HY, HY, OL, OL, OL, _, _, _, _, _, _, _, _, _, _],
    /* R11 */ [_, _, _, _, _, _, _, OL, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, OL, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R12 */ [_, _, _, _, _, _, OL, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, OL, _, _, _, _, _, _, _, _, _, _, _],
    /* R13 */ [_, _, _, _, _, _, OL, HD, HD, HY, HY, HY, HY, HY, HY, HY, HY, HY, HD, HD, OL, _, _, _, _, _, _, _, _, _, _, _],
    /* R14 */ [_, _, _, _, _, _, _, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, _, _, _, _, _, _, _, _, _, _, _, _],
    // Face
    /* R15 */ [_, _, _, _, _, _, _, OL, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, OL, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R16 */ [_, _, _, _, _, _, _, OL, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, OL, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R17 */ [_, _, _, _, _, _, _, OL, SK, SK, EY, SK, SK, SK, SK, EY, SK, SK, SK, OL, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R18 */ [_, _, _, _, _, _, _, OL, SK, CH, CH, SK, MO, MO, SK, CH, CH, SK, SK, OL, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R19 */ [_, _, _, _, _, _, _, OL, SK, CH, CH, SK, MO, MO, SK, CH, CH, SK, SK, OL, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R20 */ [_, _, _, _, _, _, _, OL, SK, SK, SK, SK, MO, MO, SK, SK, SK, SK, SK, OL, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R21 */ [_, _, _, _, _, _, _, _, OL, SK, SK, SK, SK, SK, SK, SK, SK, SK, OL, _, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R22 */ [_, _, _, _, _, _, _, _, _, OL, OL, SK, SK, SK, SK, SK, OL, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Body (with pickaxe hand logic inserted)
    /* R23 */ [_, _, _, _, _, _, _, _, _, OL, BO, BO, BO, BO, BO, BO, BO, OL, _, _, L, _, _, _, _, _, _, _, _, _, _, _],
    /* R24 */ [_, _, _, _, _, _, _, _, OL, BO, BO, BO, PK, PK, PK, BO, BO, BO, OL, _, L, L, _, _, _, _, _, _, _, _, _, _],
    /* R25 */ [_, _, _, _, _, _, _, _, OL, BO, BO, PK, PK, OL, PK, PK, BO, BO, OL, K, L, _, _, _, _, _, _, _, _, _, _, _],
    /* R26 */ [_, _, _, _, _, _, _, _, OL, BO, BO, PK, OL, OL, OL, PK, BO, BO, OL, K, K, OL, _, _, _, _, _, _, _, _, _, _],
    /* R27 */ [_, _, _, _, _, _, _, _, OL, BO, BO, PK, PK, PK, PK, PK, BO, BO, OL, _, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R28 */ [_, _, _, _, _, _, _, _, OL, BD, BD, BO, BO, BO, BO, BO, BD, BD, OL, _, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R29 */ [_, _, _, _, _, _, _, _, _, OL, OL, OL, OL, _, OL, OL, OL, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Shoes
    /* R30 */ [_, _, _, _, _, _, _, _, OL, SY, SY, SY, OL, _, OL, SY, SY, SY, OL, _, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R31 */ [_, _, _, _, _, _, _, _, OL, SY, SY, SY, OL, _, OL, SY, SY, SY, OL, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ];

  if (state === "idle") {
    applyIdleState(sprite, K, L);
  }

  return sprite;
}

function applyIdleState(sprite, K, L) {
  // Close eyes → horizontal dashes (sleeping)
  sprite[17][11] = EY;  // extend left eye into a dash
  sprite[17][16] = EY;  // extend right eye into a dash

  // Close mouth (replace open mouth with skin)
  for (let r = 18; r <= 20; r++) {
    sprite[r][12] = SK;
    sprite[r][13] = SK;
  }

  // Clear held pickaxe from raised position
  sprite[23][20] = null;
  sprite[24][20] = null;
  sprite[24][21] = null;
  sprite[25][19] = null;
  sprite[25][20] = null;
  sprite[26][19] = null;
  sprite[26][20] = null;
  sprite[26][21] = null;

  // Rest pickaxe on ground (handle vertical, head at bottom)
  sprite[27][20] = L;
  sprite[28][20] = L;
  sprite[29][20] = L;
  sprite[30][19] = K;
  sprite[30][20] = L;
  sprite[31][19] = K;
  sprite[31][20] = K;
}