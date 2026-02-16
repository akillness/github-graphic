import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getCloud, getCloudPositions } from "./clouds.js";

describe("getCloud", () => {
  it("returns a 2D sprite array for index 0", () => {
    const cloud = getCloud(0);
    assert.ok(Array.isArray(cloud));
    assert.ok(cloud.length > 0);
    assert.ok(Array.isArray(cloud[0]));
  });

  it("returns a 2D sprite array for index 1", () => {
    const cloud = getCloud(1);
    assert.ok(Array.isArray(cloud));
    assert.ok(cloud.length > 0);
  });

  it("wraps index for out-of-bounds", () => {
    const c0 = getCloud(0);
    const c2 = getCloud(2);
    assert.deepEqual(c0, c2);
  });

  it("uses only white and light gray colors", () => {
    const allowed = [null, "#F8F8FF", "#FFFFFF", "#D0D0D0", "#C0C0C0"];
    for (let i = 0; i < 2; i++) {
      const cloud = getCloud(i);
      for (const row of cloud) {
        for (const pixel of row) {
          assert.ok(allowed.includes(pixel), `unexpected color: ${pixel}`);
        }
      }
    }
  });
});

describe("getCloudPositions", () => {
  it("returns empty array when skyRows < 4", () => {
    const positions = getCloudPositions(3, 200);
    assert.deepEqual(positions, []);
  });

  it("returns positions when skyRows >= 4", () => {
    const positions = getCloudPositions(20, 200);
    assert.ok(positions.length > 0);
  });

  it("each position has spriteIndex, x, y", () => {
    const positions = getCloudPositions(20, 200);
    for (const p of positions) {
      assert.ok("spriteIndex" in p);
      assert.ok("x" in p);
      assert.ok("y" in p);
      assert.ok(p.x >= 0);
      assert.ok(p.y >= 0);
    }
  });

  it("is deterministic", () => {
    const a = getCloudPositions(20, 200);
    const b = getCloudPositions(20, 200);
    assert.deepEqual(a, b);
  });
});
