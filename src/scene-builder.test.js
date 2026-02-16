import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildScene } from "./scene-builder.js";

describe("buildScene", () => {
  it("returns a valid SVG string for tier 1", () => {
    const svg = buildScene({ level: 1, mineDepth: 3, pickaxe: "wood", gemCount: 0, description: "test" }, 100);
    assert.ok(svg.startsWith("<svg"));
    assert.ok(svg.includes("</svg>"));
    assert.ok(svg.includes("100")); // commit count in text
  });

  it("returns a valid SVG string for tier 5", () => {
    const svg = buildScene({ level: 5, mineDepth: 16, pickaxe: "legendary", gemCount: 15, description: "test" }, 15000);
    assert.ok(svg.startsWith("<svg"));
    assert.ok(svg.includes("</svg>"));
    assert.ok(svg.includes("15,000"));
  });

  it("includes gem elements when gemCount > 0", () => {
    const svg = buildScene({ level: 3, mineDepth: 8, pickaxe: "steel", gemCount: 6, description: "test" }, 3000);
    assert.ok(svg.includes('class="gem"'));
  });

  it("has no gem elements for tier 1", () => {
    const svg = buildScene({ level: 1, mineDepth: 3, pickaxe: "wood", gemCount: 0, description: "test" }, 100);
    assert.ok(!svg.includes('class="gem"'));
  });
});
