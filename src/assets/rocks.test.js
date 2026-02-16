import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getRock, getRockPositions } from "./rocks.js";

describe("getRock", () => {
  it("returns a 2D sprite array for index 0", () => {
    const rock = getRock(0);
    assert.ok(Array.isArray(rock));
    assert.ok(rock.length > 0);
    assert.ok(Array.isArray(rock[0]));
  });

  it("returns a 2D sprite array for index 1", () => {
    const rock = getRock(1);
    assert.ok(Array.isArray(rock));
    assert.ok(rock.length > 0);
  });

  it("wraps index for out-of-bounds", () => {
    const r0 = getRock(0);
    const r2 = getRock(2);
    assert.deepEqual(r0, r2);
  });

  it("uses only gray colors", () => {
    const allowed = [null, "#696969", "#808080", "#A0A0A0"];
    for (let i = 0; i < 2; i++) {
      const rock = getRock(i);
      for (const row of rock) {
        for (const pixel of row) {
          assert.ok(allowed.includes(pixel), `unexpected color: ${pixel}`);
        }
      }
    }
  });
});

describe("getRockPositions", () => {
  it("returns positions for given width", () => {
    const positions = getRockPositions(200);
    assert.ok(positions.length > 0);
  });

  it("each position has spriteIndex and x", () => {
    const positions = getRockPositions(200);
    for (const p of positions) {
      assert.ok("spriteIndex" in p);
      assert.ok("x" in p);
      assert.ok(p.x >= 0);
    }
  });

  it("positions are evenly spaced", () => {
    const positions = getRockPositions(200);
    if (positions.length >= 2) {
      const gap1 = positions[1].x - positions[0].x;
      // Gaps should be roughly equal (within sprite width difference)
      for (let i = 2; i < positions.length; i++) {
        const gap = positions[i].x - positions[i - 1].x;
        assert.ok(Math.abs(gap - gap1) < 20);
      }
    }
  });
});
