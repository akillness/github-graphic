import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getTier } from "./tiers.js";

describe("getTier", () => {
  it("returns tier 1 for 0 commits", () => {
    assert.equal(getTier(0).level, 1);
  });

  it("returns tier 1 for 499 commits", () => {
    assert.equal(getTier(499).level, 1);
  });

  it("returns tier 2 for 500 commits", () => {
    assert.equal(getTier(500).level, 2);
  });

  it("returns tier 3 for 2000 commits", () => {
    assert.equal(getTier(2000).level, 3);
  });

  it("returns tier 4 for 5000 commits", () => {
    assert.equal(getTier(5000).level, 4);
  });

  it("returns tier 5 for 10000 commits", () => {
    assert.equal(getTier(10000).level, 5);
  });

  it("returns tier 5 for 99999 commits", () => {
    assert.equal(getTier(99999).level, 5);
  });

  it("includes a description", () => {
    const tier = getTier(3000);
    assert.ok(tier.description.length > 0);
  });

  it("includes mine depth", () => {
    const t1 = getTier(100);
    const t5 = getTier(15000);
    assert.ok(t5.mineDepth > t1.mineDepth);
  });

  it("includes nextLevelMinCommits for non-max tiers", () => {
    const t1 = getTier(0);
    assert.equal(t1.nextLevelMinCommits, 500);

    const t2 = getTier(500);
    assert.equal(t2.nextLevelMinCommits, 2000);

    const t3 = getTier(2000);
    assert.equal(t3.nextLevelMinCommits, 5000);

    const t4 = getTier(5000);
    assert.equal(t4.nextLevelMinCommits, 10000);
  });

  it("returns null nextLevelMinCommits for tier 5", () => {
    const t5 = getTier(10000);
    assert.equal(t5.nextLevelMinCommits, null);
  });

  it("includes minCommits in return value", () => {
    assert.equal(getTier(0).minCommits, 0);
    assert.equal(getTier(500).minCommits, 500);
    assert.equal(getTier(10000).minCommits, 10000);
  });
});
