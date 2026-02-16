import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spriteToRects, wrapSvg } from "./svg-renderer.js";

describe("spriteToRects", () => {
  it("converts a 2D array to SVG rect elements", () => {
    const sprite = [
      ["#FF0000", null],
      [null, "#00FF00"],
    ];
    const result = spriteToRects(sprite, 0, 0, 4);
    assert.ok(result.includes('<rect x="0" y="0" width="4" height="4" fill="#FF0000"'));
    assert.ok(result.includes('<rect x="4" y="4" width="4" height="4" fill="#00FF00"'));
    assert.ok(!result.includes("null"));
  });

  it("applies x and y offsets", () => {
    const sprite = [["#FF0000"]];
    const result = spriteToRects(sprite, 10, 20, 4);
    assert.ok(result.includes('x="10"'));
    assert.ok(result.includes('y="20"'));
  });

  it("accepts a CSS class", () => {
    const sprite = [["#FF0000"]];
    const result = spriteToRects(sprite, 0, 0, 4, "sparkle");
    assert.ok(result.includes('class="sparkle"'));
  });
});

describe("wrapSvg", () => {
  it("wraps content in SVG document with viewBox", () => {
    const result = wrapSvg('<rect x="0" y="0" width="4" height="4" fill="red"/>', 800, 400);
    assert.ok(result.includes("<svg"));
    assert.ok(result.includes('viewBox="0 0 800 400"'));
    assert.ok(result.includes("</svg>"));
    assert.ok(result.includes("fill=\"red\""));
  });

  it("includes embedded CSS for animations", () => {
    const result = wrapSvg("", 800, 400);
    assert.ok(result.includes("<style>"));
    assert.ok(result.includes("@keyframes"));
  });
});
