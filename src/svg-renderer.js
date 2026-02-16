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

export function wrapSvg(content, width, height, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
<style>
  @keyframes swing {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-15deg); }
  }
  @keyframes sparkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .pickaxe { animation: swing 2s ease-in-out infinite; }
  .gem { animation: sparkle 1.5s ease-in-out infinite; }
</style>
${content}
${title ? `<text x="10" y="20" font-family="monospace" font-size="14" fill="#FFFFFF">${title}</text>` : ""}
</svg>`;
}
