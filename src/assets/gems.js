const _ = null;

const GEM_SPRITES = {
  ruby: [
    [_, "#FF0000", _],
    ["#FF0000", "#FF6666", "#FF0000"],
    [_, "#CC0000", _],
  ],
  emerald: [
    [_, "#00FF00", _],
    ["#00FF00", "#66FF66", "#00FF00"],
    [_, "#00CC00", _],
  ],
  diamond: [
    [_, "#00FFFF", _],
    ["#00FFFF", "#FFFFFF", "#00FFFF"],
    [_, "#00CED1", _],
  ],
  gold: [
    [_, "#FFD700", _],
    ["#FFD700", "#FFEC8B", "#FFD700"],
    [_, "#DAA520", _],
  ],
};

export function getGem(type) {
  return GEM_SPRITES[type] || GEM_SPRITES.ruby;
}

export function getGemTypes() {
  return Object.keys(GEM_SPRITES);
}
