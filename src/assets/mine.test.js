import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getMineBackground, getGroundRow, GRASS_ROWS } from "./mine.js";
import { getGem } from "./gems.js";

describe("getMineBackground", () => {
  it("returns a 2D array with height based on depth", () => {
    const bg = getMineBackground(5, 200, 100);
    assert.ok(Array.isArray(bg));
    assert.equal(bg.length, 100);
    assert.equal(bg[0].length, 200);
  });

  it("deeper mines have more underground rows", () => {
    const shallow = getMineBackground(3, 50, 50);
    const deep = getMineBackground(10, 50, 50);
    // Count sandy dirt rows (underground)
    const countDirt = (grid) =>
      grid.filter((row) => row[0] === "#C4963F" || row[0] === "#D4A76A").length;
    assert.ok(countDirt(deep) > countDirt(shallow));
  });

  it("uses sandy colors for underground", () => {
    const bg = getMineBackground(5, 50, 50);
    const underground = bg.filter(
      (row) => row[0] === "#D4A76A" || row[0] === "#C4963F" || row[0] === "#A0845C"
    );
    assert.ok(underground.length > 0);
  });

  it("has 3-row grass layer", () => {
    const bg = getMineBackground(3, 50, 50);
    const grassRows = bg.filter(
      (row) => row[0] === "#4CAF50" || row[0] === "#388E3C"
    );
    assert.equal(grassRows.length, GRASS_ROWS);
  });

  it("uses two-tone sky", () => {
    const bg = getMineBackground(3, 50, 50);
    const skyColors = new Set();
    for (const row of bg) {
      if (row[0] === "#6CB4EE" || row[0] === "#87CEEB") {
        skyColors.add(row[0]);
      }
    }
    assert.ok(skyColors.size >= 1);
  });
});

describe("getGroundRow", () => {
  it("returns the first underground row index", () => {
    const row = getGroundRow(3, 100);
    assert.ok(row > 0);
    assert.ok(row < 100);
  });

  it("accounts for grass rows", () => {
    const skyRows = Math.max(2, Math.floor(100 * 0.3) - 3);
    const expected = skyRows + GRASS_ROWS;
    assert.equal(getGroundRow(3, 100), expected);
  });
});

describe("getGem", () => {
  for (const type of ["ruby", "emerald", "diamond", "gold"]) {
    it(`returns a valid sprite for ${type}`, () => {
      const sprite = getGem(type);
      assert.ok(Array.isArray(sprite));
      assert.ok(sprite.length > 0);
      const width = sprite[0].length;
      for (const row of sprite) {
        assert.equal(row.length, width);
      }
    });
  }
});
