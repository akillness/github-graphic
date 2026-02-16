const PICKAXE_COLORS = {
  wood: { handle: "#8B4513", head: "#A0522D" },
  iron: { handle: "#8B4513", head: "#A8A8A8" },
  steel: { handle: "#8B4513", head: "#708090" },
  diamond: { handle: "#8B4513", head: "#00CED1" },
  legendary: { handle: "#FFD700", head: "#FF4500" },
};

const _ = null;

// Outline
const OL = "#2A1A0E"; // Dark border outline

// Helmet colors (yellow family)
const HY = "#F5A623"; // Helmet Yellow (main)
const HH = "#FFD54F"; // Helmet Highlight (top shine)
const HD = "#E09100"; // Helmet Dark (shadow)
const HC = "#2E7D32"; // Helmet Cross (dark green)
const HL = "#4CAF50"; // Helmet Cross Light (bright green)

// Skin colors
const SK = "#FFDAB3"; // Skin base
const SH = "#FFE4C4"; // Skin Highlight
const SD = "#E8C4A0"; // Skin Dark/shadow

// Eyes
const EK = "#000000"; // Eye black (pupil)
const EW = "#FFFFFF"; // Eye white (highlight dot)

// Mouth
const TW = "#FFFFFF"; // Teeth white
const ML = "#CC3333"; // Mouth line / tongue

// Body (orange jumpsuit)
const BY = "#E65100"; // Body Yellow-orange (main)
const BH = "#FF6D00"; // Body Highlight
const BD = "#BF360C"; // Body Dark/shadow

// Belt
const BL = "#000000"; // Belt (black)
const BC = "#FFD700"; // Belt Buckle (gold)

// Boots (brown family)
const BT = "#5D4037"; // Boot base
const BV = "#795548"; // Boot mid
const BK = "#3E2723"; // Boot dark

// Pickaxe colors (dynamic - set in getMiner)
// K = pickaxe head color
// L = pickaxe handle color

export function getMiner(pickaxe) {
  const p = PICKAXE_COLORS[pickaxe] || PICKAXE_COLORS.wood;
  const K = p.head;
  const L = p.handle;

  return [
    //         0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31
    /* R00 */ [_, _, _, _, _, _, _, _, _, _, _, _, OL, HH, HH, HH, HH, HH, HH, OL, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R01 */ [_, _, _, _, _, _, _, _, _, _, _, OL, HH, HY, HY, HY, HY, HY, HY, HY, HH, OL, _, _, _, _, _, _, _, _, _, _],
    /* R02 */ [_, _, _, _, _, _, _, _, _, _, OL, HH, HY, HY, HY, HY, HY, HY, HY, HY, HY, HH, OL, _, _, _, _, _, _, _, _, _],
    /* R03 */ [_, _, _, _, _, _, _, _, _, OL, HH, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HH, OL, _, _, _, _, _, _, _, _],
    /* R04 */ [_, _, _, _, _, _, _, _, OL, HH, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HH, OL, _, _, _, _, _, _, _],
    /* R05 */ [_, _, _, _, _, _, _, OL, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, OL, _, _, _, _, _, _, _],
    /* R06 */ [_, _, _, _, _, _, OL, HY, HY, HY, HY, HY, HY, HL, HC, HC, HC, HL, HY, HY, HY, HY, HY, HY, HY, OL, _, _, _, _, _, _],
    /* R07 */ [_, _, _, _, _, OL, HY, HY, HY, HY, HY, HY, HL, HC, HC, HC, HC, HC, HL, HY, HY, HY, HY, HY, HY, HY, OL, _, _, _, _, _],
    /* R08 */ [_, _, _, _, _, OL, HY, HY, HY, HY, HY, HY, HY, HC, HC, HC, HC, HC, HY, HY, HY, HY, HY, HY, HY, OL, _, _, _, _, _, _],
    /* R09 */ [_, _, _, _, _, OL, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, HY, OL, _, _, _, _, _, _],
    /* R10 */ [_, _, _, _, _, _, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, _, _, _, _, _, _, _],
    // Simple face with dot eyes - reduced height
    /* R11 */ [_, _, _, _, _, _, _, OL, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, OL, _, _, _, _, _, _, _],
    /* R12 */ [_, _, _, _, _, _, _, OL, SK, SK, SK, SK, EK, SK, SK, SK, SK, SK, EK, SK, SK, SK, SK, SK, OL, _, _, _, _, _, _, _],
    /* R13 */ [_, _, _, _, _, _, _, OL, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, OL, _, _, _, _, _, _, _],
    /* R14 */ [_, _, _, _, _, _, _, OL, SK, SK, SK, SK, SK, SK, SK, ML, ML, SK, SK, SK, SK, SK, SK, SK, OL, _, _, _, _, _, _, _],
    /* R15 */ [_, _, _, _, _, _, _, _, OL, SK, SK, SK, SK, ML, ML, ML, ML, ML, ML, SK, SK, SK, SK, OL, _, _, _, _, _, _, _, _],
    /* R16 */ [_, _, _, _, _, _, _, _, _, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, OL, _, _, _, _, _, _, _, _, _],
    // Compact chibi body - connects from face outline at R16
    /* R17 */ [_, _, _, _, _, _, _, _, _, OL, SH, SK, SK, SK, SK, SK, SK, SK, SK, SK, SH, OL, _, _, _, _, _, _, _, _, _, _],
    /* R18 */ [_, _, _, _, _, _, _, _, _, OL, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, OL, _, _, _, _, _, _, _, _, _, _],
    /* R19 */ [_, _, _, _, _, _, _, _, OL, BH, BY, BY, BY, BY, BY, BY, BY, BY, BY, BY, BH, OL, L, _, _, _, _, _, _, _, _, _],
    /* R20 */ [_, _, _, _, _, _, _, _, OL, BY, BY, BY, BY, BY, BY, BY, BY, BY, BY, BY, BY, OL, L, L, _, _, _, _, _, _, _, _],
    /* R21 */ [_, _, _, _, _, _, _, _, _, OL, BL, BL, BL, BC, BC, BC, BC, BL, BL, BL, OL, _, K, L, _, _, _, _, _, _, _, _],
    /* R22 */ [_, _, _, _, _, _, _, _, _, OL, BD, BY, BY, BY, BY, BY, BY, BY, BY, BD, OL, _, K, K, OL, _, _, _, _, _, _, _],
    /* R23 */ [_, _, _, _, _, _, _, _, _, _, OL, BV, BT, BT, BT, BT, BT, BT, BV, OL, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R24 */ [_, _, _, _, _, _, _, _, _, _, OL, BK, BV, BT, BT, BT, BT, BV, BK, OL, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R25 */ [_, _, _, _, _, _, _, _, _, _, _, OL, BK, BK, OL, _, OL, BK, BK, OL, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R26 */ [_, _, _, _, _, _, _, _, _, _, _, _, OL, OL, _, _, _, OL, OL, _, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R27 */ [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R28 */ [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R29 */ [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R30 */ [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    /* R31 */ [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ];
}
