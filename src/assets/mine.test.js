import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getMineBackground } from "./mine.js";
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
    // Count brown/dark rows (underground)
    const countDark = (grid) =>
      grid.filter((row) => row[0] === "#3E2723" || row[0] === "#5D4037").length;
    assert.ok(countDark(deep) > countDark(shallow));
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
