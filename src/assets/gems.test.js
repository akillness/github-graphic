import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getGem, getGemTypes } from "./gems.js";

describe("getGem", () => {
  it("returns a 2D sprite array for ruby", () => {
    const gem = getGem("ruby");
    assert.ok(Array.isArray(gem));
    assert.ok(gem.length > 0);
    assert.ok(Array.isArray(gem[0]));
  });

  it("returns a 2D sprite array for emerald", () => {
    const gem = getGem("emerald");
    assert.ok(Array.isArray(gem));
    assert.ok(gem.length > 0);
  });

  it("returns a 2D sprite array for diamond", () => {
    const gem = getGem("diamond");
    assert.ok(Array.isArray(gem));
    assert.ok(gem.length > 0);
  });

  it("returns a 2D sprite array for gold", () => {
    const gem = getGem("gold");
    assert.ok(Array.isArray(gem));
    assert.ok(gem.length > 0);
  });

  it("returns default gem for unknown type", () => {
    const gem = getGem("unknown");
    const ruby = getGem("ruby");
    assert.deepEqual(gem, ruby);
  });

  it("uses only allowed gem colors", () => {
    const allowed = [
      null,
      "#8B0000", "#DC143C", "#FF0000", "#FF6B6B", "#FFB3B3",
      "#004d00", "#228B22", "#00CC00", "#66FF66", "#B3FFB3",
      "#4682B4", "#87CEEB", "#00FFFF", "#E0FFFF", "#F0FFFF",
      "#8B6914", "#DAA520", "#FFD700", "#FFEC8B", "#FFFACD",
    ];
    for (const type of getGemTypes()) {
      const gem = getGem(type);
      for (const row of gem) {
        for (const pixel of row) {
          assert.ok(allowed.includes(pixel), `unexpected color: ${pixel}`);
        }
      }
    }
  });

  it("gems are 5x5 or smaller", () => {
    for (const type of getGemTypes()) {
      const gem = getGem(type);
      assert.ok(gem.length <= 5, `${type} has more than 5 rows`);
      for (const row of gem) {
        assert.ok(row.length <= 5, `${type} row has more than 5 columns`);
      }
    }
  });

  it("each gem has at least 4 colors", () => {
    for (const type of getGemTypes()) {
      const gem = getGem(type);
      const colors = new Set(gem.flat().filter(c => c !== null));
      assert.ok(colors.size >= 4, `${type} should have at least 4 colors but has ${colors.size}`);
    }
  });
});

describe("getGemTypes", () => {
  it("returns all 4 gem types", () => {
    const types = getGemTypes();
    assert.equal(types.length, 4);
    assert.ok(types.includes("ruby"));
    assert.ok(types.includes("emerald"));
    assert.ok(types.includes("diamond"));
    assert.ok(types.includes("gold"));
  });
});
