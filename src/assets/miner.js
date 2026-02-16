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
const MB = "#8B4513"; // Mouth interior (brown)

// Body (orange jumpsuit)
const BY = "#E65100"; // Body Yellow-orange (main)
const BH = "#FF6D00"; // Body Highlight
const BD = "#BF360C"; // Body Dark/shadow

// Belt
const BL = "#3D2817"; // Belt (dark brown)

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
    // Row 0: Very top of helmet dome
    [_, _, _, _, _, _, OL, HH, HH, HH, HH, HH, HH, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 1: Helmet dome widens
    [_, _, _, _, _, OL, HH, HY, HY, HY, HY, HY, HY, HH, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 2: Helmet dome with highlight
    [_, _, _, _, OL, HH, HY, HY, HY, HY, HY, HY, HY, HY, HH, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 3: Helmet top with cross appearing
    [_, _, _, OL, HH, HY, HY, HY, HL, HC, HC, HL, HY, HY, HY, HH, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 4: Helmet body with full cross
    [_, _, OL, HH, HY, HY, HY, HY, HC, HC, HC, HC, HY, HY, HY, HY, HH, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 5: Helmet widest part
    [_, OL, HH, HY, HY, HY, HY, HY, HC, HL, HC, HC, HY, HY, HY, HY, HY, HH, OL, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 6: Helmet lower edge, face starts
    [_, _, OL, SH, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SH, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 7: Upper face - eyebrows area
    [_, _, OL, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 8: Big eyes row 1 (eyebrows/upper eye)
    [_, _, OL, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 9: Big eyes row 2 - eye whites/upper pupils (3px wide each eye, spaced)
    [_, _, OL, SK, EK, EW, SK, SK, SK, SK, SK, SK, SK, EK, EW, SK, SK, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 10: Big eyes row 3 - full pupils (3px wide each)
    [_, _, OL, SK, EK, EK, SK, SK, SK, SK, SK, SK, SK, EK, EK, SK, SK, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 11: Eye lower / cheek transition
    [_, _, _, OL, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 12: Cheeks - smile starts
    [_, _, _, OL, SH, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SH, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 13: Wide smile with teeth (굴착소년 쿵 style)
    [_, _, _, _, OL, SH, SK, SK, TW, TW, TW, TW, SK, SK, SH, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 14: Open mouth with teeth row 2, tongue
    [_, _, _, _, OL, SH, SK, MB, TW, TW, TW, TW, MB, SK, SH, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 15: Lower mouth/tongue
    [_, _, _, _, _, OL, SK, MB, ML, ML, ML, ML, MB, SK, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 16: Chin
    [_, _, _, _, _, _, OL, SK, SK, SK, SK, SK, SK, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 17: Neck
    [_, _, _, _, _, _, OL, SD, SD, SD, SD, SD, SD, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 18: Neck/upper body
    [_, _, _, _, _, OL, BD, BY, BY, BY, BY, BY, BY, BD, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 19: Body upper - shoulders
    [_, _, _, _, OL, BD, BH, BY, BY, BY, BY, BY, BY, BH, BD, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 20: Body - arms start (left arm out, right arm holds pickaxe)
    [_, _, _, OL, BV, BY, BY, BY, BY, BY, BY, BY, BY, BY, BV, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 21: Body with belt line starting
    [_, _, _, OL, BT, BY, BY, BY, BY, BY, BY, BY, BY, BY, BT, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 22: Belt row (left arm down, right arm holds pickaxe handle)
    [_, _, OL, BV, BL, BL, BL, BL, BL, BL, BL, BL, BL, BL, L, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 23: Lower body / pickaxe handle continues
    [_, _, OL, BK, BD, BY, BY, BY, BY, BY, BY, BY, BY, BD, L, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 24: Lower body, pickaxe handle L-shape bend
    [_, _, _, OL, BV, BD, BY, BY, BY, BY, BY, BY, BD, BV, K, K, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 25: Upper boots, pickaxe head
    [_, _, _, _, OL, BK, BD, BD, BD, BD, BD, BD, BK, OL, K, K, K, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 26: Boots row 1
    [_, _, _, _, OL, BV, BT, BT, BT, BT, BT, BT, BV, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 27: Boots row 2
    [_, _, _, _, OL, BK, BV, BV, BV, BV, BV, BV, BK, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 28: Boots row 3 (sole)
    [_, _, _, _, _, OL, BK, BK, BK, BK, BK, BK, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 29: Boots bottom
    [_, _, _, _, _, _, OL, OL, OL, OL, OL, OL, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 30: Empty
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    // Row 31: Empty
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ];
}
