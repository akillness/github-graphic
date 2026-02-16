import { PRESS_START_2P_BASE64 } from "./assets/fonts/press-start-2p.js";

export function spriteToRects(sprite, offsetX, offsetY, pixelSize, cssClass) {
  const rects = [];
  for (let y = 0; y < sprite.length; y++) {
    for (let x = 0; x < sprite[y].length; x++) {
      const color = sprite[y][x];
      if (color === null) continue;
      const classAttr = cssClass ? ` class="${cssClass}"` : "";
      rects.push(
        `<rect x="${offsetX + x * pixelSize}" y="${offsetY + y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${color}"${classAttr}/>`
      );
    }
  }
  return rects.join("\n");
}

export function wrapSvg(content, width, height) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
<style>
  @font-face {
    font-family: 'Press Start 2P';
    src: url('data:font/truetype;charset=utf-8;base64,${PRESS_START_2P_BASE64}') format('truetype');
    font-weight: 400;
    font-style: normal;
  }
  @keyframes swing {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-15deg); }
  }
  @keyframes sparkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes drift {
    0% { transform: translateX(0); }
    50% { transform: translateX(8px); }
    100% { transform: translateX(0); }
  }
  .pickaxe { animation: swing 2s ease-in-out infinite; }
  .gem { animation: sparkle 1.5s ease-in-out infinite; }
  .cloud { animation: drift 6s ease-in-out infinite; }
</style>
${content}
</svg>`;
}
