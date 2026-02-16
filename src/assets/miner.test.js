import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getMiner } from "./miner.js";

describe("getMiner", () => {
  for (const pickaxe of ["wood", "iron", "steel", "diamond", "legendary"]) {
    it(`returns a 2D pixel array for ${pickaxe} tier`, () => {
      const sprite = getMiner(pickaxe);
      assert.ok(Array.isArray(sprite));
      assert.ok(sprite.length > 0, "sprite has rows");
      assert.ok(sprite[0].length > 0, "sprite has columns");
      const width = sprite[0].length;
      for (const row of sprite) {
        assert.equal(row.length, width, "all rows must be same width");
      }
      for (const row of sprite) {
        for (const cell of row) {
          if (cell !== null) {
            assert.match(cell, /^#[0-9a-fA-F]{6}$/, `invalid color: ${cell}`);
          }
        }
      }
    });
  }

  it("uses more than 8 unique colors for detailed sprite", () => {
    const sprite = getMiner("wood");
    const colors = new Set(sprite.flat().filter((c) => c !== null));
    assert.ok(colors.size > 8, `expected more than 8 colors, got ${colors.size}`);
  });

  it("has sprite height of 16 rows or less (max 20 for scene compatibility)", () => {
    const sprite = getMiner("wood");
    assert.ok(sprite.length <= 20, `sprite height ${sprite.length} exceeds max 20 rows`);
    assert.equal(sprite.length, 16, "sprite should be 16 rows for proper proportions");
  });
});
