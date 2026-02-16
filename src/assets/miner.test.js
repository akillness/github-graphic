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
      // All rows same width
      const width = sprite[0].length;
      for (const row of sprite) {
        assert.equal(row.length, width, "all rows must be same width");
      }
      // Values are hex strings or null
      for (const row of sprite) {
        for (const cell of row) {
          if (cell !== null) {
            assert.match(cell, /^#[0-9a-fA-F]{6}$/, `invalid color: ${cell}`);
          }
        }
      }
    });
  }
});
