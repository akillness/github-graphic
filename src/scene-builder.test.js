import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildScene } from "./scene-builder.js";

describe("buildScene", () => {
  it("returns a valid SVG string for tier 1", () => {
    const svg = buildScene(
      { level: 1, mineDepth: 3, pickaxe: "wood", gemCount: 0, description: "test", minCommits: 0, nextLevelMinCommits: 250 },
      100
    );
    assert.ok(svg.startsWith("<svg"));
    assert.ok(svg.includes("</svg>"));
    assert.ok(svg.includes("100")); // commit count in HUD
  });

  it("returns a valid SVG string for tier 5", () => {
    const svg = buildScene(
      { level: 5, mineDepth: 16, pickaxe: "legendary", gemCount: 15, description: "test", minCommits: 5000, nextLevelMinCommits: null },
      6000
    );
    assert.ok(svg.startsWith("<svg"));
    assert.ok(svg.includes("</svg>"));
    assert.ok(svg.includes("6,000"));
  });

  it("includes gem elements when gemCount > 0", () => {
    const svg = buildScene(
      { level: 3, mineDepth: 8, pickaxe: "steel", gemCount: 6, description: "test", minCommits: 1000, nextLevelMinCommits: 2500 },
      1500
    );
    assert.ok(svg.includes('class="gem"'));
  });

  it("has no gem elements for tier 1", () => {
    const svg = buildScene(
      { level: 1, mineDepth: 3, pickaxe: "wood", gemCount: 0, description: "test", minCommits: 0, nextLevelMinCommits: 250 },
      100
    );
    assert.ok(!svg.includes('class="gem"'));
  });

  it("includes cloud elements", () => {
    const svg = buildScene(
      { level: 1, mineDepth: 3, pickaxe: "wood", gemCount: 0, description: "test", minCommits: 0, nextLevelMinCommits: 250 },
      100
    );
    assert.ok(svg.includes('class="cloud"'));
  });

  it("includes HUD with COMMITS label", () => {
    const svg = buildScene(
      { level: 2, mineDepth: 5, pickaxe: "iron", gemCount: 3, description: "test", minCommits: 250, nextLevelMinCommits: 1000 },
      1278
    );
    assert.ok(svg.includes("COMMITS:"));
    assert.ok(svg.includes("1,278"));
  });

  it("includes TIER label in HUD", () => {
    const svg = buildScene(
      { level: 3, mineDepth: 8, pickaxe: "steel", gemCount: 6, description: "test", minCommits: 1000, nextLevelMinCommits: 2500 },
      1500
    );
    assert.ok(svg.includes("TIER 3"));
  });

  it("includes progress bar for non-max tiers", () => {
    const svg = buildScene(
      { level: 2, mineDepth: 5, pickaxe: "iron", gemCount: 3, description: "test", minCommits: 250, nextLevelMinCommits: 1000 },
      1000
    );
    assert.ok(svg.includes('class="progress-bar"'));
    assert.ok(svg.includes('fill="#4CAF50"'));
  });

  it("shows MAX TIER badge for tier 5", () => {
    const svg = buildScene(
      { level: 5, mineDepth: 16, pickaxe: "legendary", gemCount: 15, description: "test", minCommits: 5000, nextLevelMinCommits: null },
      6000
    );
    assert.ok(svg.includes("MAX TIER"));
    assert.ok(!svg.includes('class="progress-bar"'));
  });

  it("includes depth indicator", () => {
    const svg = buildScene(
      { level: 3, mineDepth: 8, pickaxe: "steel", gemCount: 6, description: "test", minCommits: 1000, nextLevelMinCommits: 2500 },
      1500
    );
    assert.ok(svg.includes("DEPTH: 8m"));
  });
});
