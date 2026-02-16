# GitHub Miner Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a pixel art miner SVG that evolves based on GitHub commit activity, auto-updated via GitHub Actions for display in a profile README.

**Architecture:** Node.js script fetches commit data from GitHub GraphQL API, calculates a tier (1-5), selects pixel art assets for that tier, and renders them as SVG `<rect>` elements with CSS animations. GitHub Actions runs this every 6 hours.

**Tech Stack:** Node.js 20+, native fetch, GitHub GraphQL API, pure SVG string templating, GitHub Actions

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `src/index.js` (placeholder)

**Step 1: Initialize package.json**

```bash
cd /home/roach/github-graphic
```

Create `package.json`:
```json
{
  "name": "github-miner",
  "version": "1.0.0",
  "description": "Pixel art miner SVG that evolves based on GitHub commit activity",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "generate": "node src/index.js",
    "test": "node --test"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

**Step 2: Create placeholder entry point**

Create `src/index.js`:
```js
console.log("github-miner: not yet implemented");
```

**Step 3: Verify it runs**

Run: `node src/index.js`
Expected: prints "github-miner: not yet implemented"

**Step 4: Commit**

```bash
git add package.json src/index.js
git commit -m "chore: scaffold project with package.json and entry point"
```

---

### Task 2: GitHub API Client

**Files:**
- Create: `src/github-api.js`
- Create: `src/github-api.test.js`

**Step 1: Write the failing test**

Create `src/github-api.test.js`:
```js
import { describe, it, mock } from "node:test";
import assert from "node:assert/strict";

describe("fetchContributions", () => {
  it("returns total commit count from GitHub GraphQL response", async () => {
    const mockResponse = {
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: 1234,
              weeks: [
                {
                  contributionDays: [
                    { contributionCount: 5, date: "2025-02-16" },
                    { contributionCount: 3, date: "2025-02-17" },
                  ],
                },
              ],
            },
          },
        },
      },
    };

    // Mock global fetch
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mock.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const { fetchContributions } = await import("./github-api.js");
    const result = await fetchContributions("testuser", "fake-token");

    assert.equal(result.totalContributions, 1234);
    assert.ok(Array.isArray(result.weeks));
    assert.equal(result.weeks[0].contributionDays[0].contributionCount, 5);

    globalThis.fetch = originalFetch;
  });
});
```

**Step 2: Run test to verify it fails**

Run: `node --test src/github-api.test.js`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

Create `src/github-api.js`:
```js
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

const CONTRIBUTIONS_QUERY = `
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}`;

export async function fetchContributions(username, token) {
  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CONTRIBUTIONS_QUERY,
      variables: { username },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(`GraphQL error: ${json.errors[0].message}`);
  }

  return json.data.user.contributionsCollection.contributionCalendar;
}
```

**Step 4: Run test to verify it passes**

Run: `node --test src/github-api.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add src/github-api.js src/github-api.test.js
git commit -m "feat: add GitHub GraphQL API client for contribution data"
```

---

### Task 3: Tier Calculation

**Files:**
- Create: `src/tiers.js`
- Create: `src/tiers.test.js`

**Step 1: Write the failing test**

Create `src/tiers.test.js`:
```js
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
});
```

**Step 2: Run test to verify it fails**

Run: `node --test src/tiers.test.js`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

Create `src/tiers.js`:
```js
const TIERS = [
  { level: 1, minCommits: 0, description: "Surface mine, basic pickaxe", mineDepth: 3, pickaxe: "wood", gemCount: 0 },
  { level: 2, minCommits: 500, description: "Shallow mine, iron pickaxe, few gems", mineDepth: 5, pickaxe: "iron", gemCount: 3 },
  { level: 3, minCommits: 2000, description: "Deep mine, steel pickaxe, gems and gold", mineDepth: 8, pickaxe: "steel", gemCount: 6 },
  { level: 4, minCommits: 5000, description: "Very deep mine, diamond pickaxe, abundant resources", mineDepth: 12, pickaxe: "diamond", gemCount: 10 },
  { level: 5, minCommits: 10000, description: "Massive cavern, legendary gear, treasure hoard", mineDepth: 16, pickaxe: "legendary", gemCount: 15 },
];

export function getTier(commitCount) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (commitCount >= TIERS[i].minCommits) {
      return { ...TIERS[i] };
    }
  }
  return { ...TIERS[0] };
}
```

**Step 4: Run test to verify it passes**

Run: `node --test src/tiers.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add src/tiers.js src/tiers.test.js
git commit -m "feat: add tier calculation based on commit thresholds"
```

---

### Task 4: Pixel Art Assets — Miner Character

**Files:**
- Create: `src/assets/miner.js`
- Create: `src/assets/miner.test.js`

Each asset is a 2D array where each cell is a hex color string or `null` (transparent). The miner has variants per pickaxe tier.

**Step 1: Write the failing test**

Create `src/assets/miner.test.js`:
```js
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
```

**Step 2: Run test to verify it fails**

Run: `node --test src/assets/miner.test.js`
Expected: FAIL — module not found

**Step 3: Write implementation**

Create `src/assets/miner.js`. This defines a 16x16 pixel miner character with pickaxe color varying by tier.

```js
const PICKAXE_COLORS = {
  wood: { handle: "#8B4513", head: "#A0522D" },
  iron: { handle: "#8B4513", head: "#A8A8A8" },
  steel: { handle: "#8B4513", head: "#708090" },
  diamond: { handle: "#8B4513", head: "#00CED1" },
  legendary: { handle: "#FFD700", head: "#FF4500" },
};

const _ = null;
const S = "#F5DEB3"; // skin
const H = "#4A3728"; // hair
const B = "#1E90FF"; // blue shirt
const P = "#2F4F4F"; // pants
const E = "#000000"; // eyes
const O = "#8B4513"; // boots

export function getMiner(pickaxe) {
  const c = PICKAXE_COLORS[pickaxe] || PICKAXE_COLORS.wood;
  const K = c.head;    // pickaxe head
  const L = c.handle;  // pickaxe handle

  // 16x16 miner sprite facing right, holding pickaxe
  return [
    [_, _, _, _, _, H, H, H, H, _, _, _, _, _, _, _],
    [_, _, _, _, H, H, H, H, H, H, _, _, _, _, _, _],
    [_, _, _, _, H, H, H, H, H, H, _, _, _, _, _, _],
    [_, _, _, _, S, S, S, S, S, S, _, _, _, _, _, _],
    [_, _, _, _, S, E, S, S, E, S, _, _, _, _, _, _],
    [_, _, _, _, S, S, S, S, S, S, _, _, _, _, _, _],
    [_, _, _, _, _, S, S, S, S, _, _, _, _, _, _, _],
    [_, _, _, B, B, B, B, B, B, B, B, _, L, _, _, _],
    [_, _, _, B, B, B, B, B, B, B, B, _, L, _, _, _],
    [_, _, _, _, B, B, B, B, B, B, _, _, L, _, _, _],
    [_, _, _, _, S, B, B, B, B, S, _, L, _, _, _, _],
    [_, _, _, _, _, P, P, P, P, _, K, K, K, _, _, _],
    [_, _, _, _, _, P, P, P, P, _, _, _, _, _, _, _],
    [_, _, _, _, _, P, _, _, P, _, _, _, _, _, _, _],
    [_, _, _, _, _, P, _, _, P, _, _, _, _, _, _, _],
    [_, _, _, _, O, O, _, _, O, O, _, _, _, _, _, _],
  ];
}
```

**Step 4: Run test to verify it passes**

Run: `node --test src/assets/miner.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add src/assets/miner.js src/assets/miner.test.js
git commit -m "feat: add pixel art miner character with pickaxe tier variants"
```

---

### Task 5: Pixel Art Assets — Mine & Gems

**Files:**
- Create: `src/assets/mine.js`
- Create: `src/assets/gems.js`
- Create: `src/assets/mine.test.js`

**Step 1: Write the failing test**

Create `src/assets/mine.test.js`:
```js
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
```

**Step 2: Run test to verify it fails**

Run: `node --test src/assets/mine.test.js`
Expected: FAIL — modules not found

**Step 3: Write mine background implementation**

Create `src/assets/mine.js`:
```js
const SKY = "#87CEEB";
const GRASS = "#228B22";
const DIRT_LIGHT = "#5D4037";
const DIRT_DARK = "#3E2723";
const STONE = "#696969";

export function getMineBackground(depth, width, height) {
  const skyRows = Math.max(2, Math.floor(height * 0.3) - depth);
  const grassRows = 1;
  const dirtRows = Math.min(depth * 2, height - skyRows - grassRows);
  const stoneRows = height - skyRows - grassRows - dirtRows;

  const grid = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      if (y < skyRows) {
        row.push(SKY);
      } else if (y < skyRows + grassRows) {
        row.push(GRASS);
      } else if (y < skyRows + grassRows + dirtRows) {
        row.push(y % 2 === 0 ? DIRT_LIGHT : DIRT_DARK);
      } else {
        row.push(STONE);
      }
    }
    grid.push(row);
  }

  return grid;
}
```

**Step 4: Write gems implementation**

Create `src/assets/gems.js`:
```js
const _ = null;

const GEM_SPRITES = {
  ruby: [
    [_, "#FF0000", _],
    ["#FF0000", "#FF6666", "#FF0000"],
    [_, "#CC0000", _],
  ],
  emerald: [
    [_, "#00FF00", _],
    ["#00FF00", "#66FF66", "#00FF00"],
    [_, "#00CC00", _],
  ],
  diamond: [
    [_, "#00FFFF", _],
    ["#00FFFF", "#FFFFFF", "#00FFFF"],
    [_, "#00CED1", _],
  ],
  gold: [
    [_, "#FFD700", _],
    ["#FFD700", "#FFEC8B", "#FFD700"],
    [_, "#DAA520", _],
  ],
};

export function getGem(type) {
  return GEM_SPRITES[type] || GEM_SPRITES.ruby;
}

export function getGemTypes() {
  return Object.keys(GEM_SPRITES);
}
```

**Step 5: Run tests to verify they pass**

Run: `node --test src/assets/mine.test.js`
Expected: PASS

**Step 6: Commit**

```bash
git add src/assets/mine.js src/assets/gems.js src/assets/mine.test.js
git commit -m "feat: add mine background and gem pixel art assets"
```

---

### Task 6: SVG Renderer

**Files:**
- Create: `src/svg-renderer.js`
- Create: `src/svg-renderer.test.js`

This converts 2D pixel arrays into SVG `<rect>` strings and wraps them in a complete SVG document.

**Step 1: Write the failing test**

Create `src/svg-renderer.test.js`:
```js
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spriteToRects, wrapSvg } from "./svg-renderer.js";

describe("spriteToRects", () => {
  it("converts a 2D array to SVG rect elements", () => {
    const sprite = [
      ["#FF0000", null],
      [null, "#00FF00"],
    ];
    const result = spriteToRects(sprite, 0, 0, 4);
    assert.ok(result.includes('<rect x="0" y="0" width="4" height="4" fill="#FF0000"'));
    assert.ok(result.includes('<rect x="4" y="4" width="4" height="4" fill="#00FF00"'));
    assert.ok(!result.includes("null"));
  });

  it("applies x and y offsets", () => {
    const sprite = [["#FF0000"]];
    const result = spriteToRects(sprite, 10, 20, 4);
    assert.ok(result.includes('x="10"'));
    assert.ok(result.includes('y="20"'));
  });

  it("accepts a CSS class", () => {
    const sprite = [["#FF0000"]];
    const result = spriteToRects(sprite, 0, 0, 4, "sparkle");
    assert.ok(result.includes('class="sparkle"'));
  });
});

describe("wrapSvg", () => {
  it("wraps content in SVG document with viewBox", () => {
    const result = wrapSvg('<rect x="0" y="0" width="4" height="4" fill="red"/>', 800, 400);
    assert.ok(result.includes("<svg"));
    assert.ok(result.includes('viewBox="0 0 800 400"'));
    assert.ok(result.includes("</svg>"));
    assert.ok(result.includes("fill=\"red\""));
  });

  it("includes embedded CSS for animations", () => {
    const result = wrapSvg("", 800, 400);
    assert.ok(result.includes("<style>"));
    assert.ok(result.includes("@keyframes"));
  });
});
```

**Step 2: Run test to verify it fails**

Run: `node --test src/svg-renderer.test.js`
Expected: FAIL — module not found

**Step 3: Write implementation**

Create `src/svg-renderer.js`:
```js
export function spriteToRects(sprite, offsetX, offsetY, pixelSize, cssClass) {
  const rects = [];
  for (let y = 0; y < sprite.length; y++) {
    for (let x = 0; x < sprite[y].length; x++) {
      const color = sprite[y][x];
      if (color === null) continue;
      const classAttr = cssClass ? ` class="${cssClass}"` : "";
      rects.push(
        `<rect x="${offsetX + x * pixelSize}" y="${offsetY + y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${color}"${classAttr}/>`
      );
    }
  }
  return rects.join("\n");
}

export function wrapSvg(content, width, height, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
<style>
  @keyframes swing {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-15deg); }
  }
  @keyframes sparkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .pickaxe { animation: swing 2s ease-in-out infinite; }
  .gem { animation: sparkle 1.5s ease-in-out infinite; }
</style>
${content}
${title ? `<text x="10" y="20" font-family="monospace" font-size="14" fill="#FFFFFF">${title}</text>` : ""}
</svg>`;
}
```

**Step 4: Run test to verify it passes**

Run: `node --test src/svg-renderer.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add src/svg-renderer.js src/svg-renderer.test.js
git commit -m "feat: add SVG renderer for pixel art sprites"
```

---

### Task 7: Scene Builder

**Files:**
- Create: `src/scene-builder.js`
- Create: `src/scene-builder.test.js`

This orchestrates all assets into a complete scene based on tier.

**Step 1: Write the failing test**

Create `src/scene-builder.test.js`:
```js
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
    assert.ok(svg.includes("15000"));
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
```

**Step 2: Run test to verify it fails**

Run: `node --test src/scene-builder.test.js`
Expected: FAIL — module not found

**Step 3: Write implementation**

Create `src/scene-builder.js`:
```js
import { getMiner } from "./assets/miner.js";
import { getMineBackground } from "./assets/mine.js";
import { getGem, getGemTypes } from "./assets/gems.js";
import { spriteToRects, wrapSvg } from "./svg-renderer.js";

const SVG_WIDTH = 800;
const SVG_HEIGHT = 400;
const PIXEL_SIZE = 4;

// Grid dimensions in "pixels"
const GRID_W = SVG_WIDTH / PIXEL_SIZE;  // 200
const GRID_H = SVG_HEIGHT / PIXEL_SIZE; // 100

export function buildScene(tier, commitCount) {
  const parts = [];

  // 1. Mine background
  const bg = getMineBackground(tier.mineDepth, GRID_W, GRID_H);
  parts.push(spriteToRects(bg, 0, 0, PIXEL_SIZE));

  // 2. Miner character — placed on ground level
  const miner = getMiner(tier.pickaxe);
  const groundY = Math.max(2, Math.floor(GRID_H * 0.3) - tier.mineDepth);
  const minerX = (GRID_W / 2 - miner[0].length / 2) * PIXEL_SIZE;
  const minerY = (groundY - miner.length + 1) * PIXEL_SIZE;
  parts.push(spriteToRects(miner, minerX, minerY, PIXEL_SIZE));

  // 3. Gems — scatter in underground area
  if (tier.gemCount > 0) {
    const gemTypes = getGemTypes();
    const undergroundStartY = groundY + 2;
    for (let i = 0; i < tier.gemCount; i++) {
      const gemType = gemTypes[i % gemTypes.length];
      const gem = getGem(gemType);
      // Deterministic placement using index
      const gx = ((i * 37 + 13) % (GRID_W - 10)) * PIXEL_SIZE;
      const gy = (undergroundStartY + (i * 7) % (GRID_H - undergroundStartY - 5)) * PIXEL_SIZE;
      parts.push(spriteToRects(gem, gx, gy, PIXEL_SIZE, "gem"));
    }
  }

  // 4. Commit count text overlay
  const title = `⛏ ${commitCount.toLocaleString()} commits — ${tier.description}`;

  return wrapSvg(parts.join("\n"), SVG_WIDTH, SVG_HEIGHT, title);
}
```

**Step 4: Run test to verify it passes**

Run: `node --test src/scene-builder.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add src/scene-builder.js src/scene-builder.test.js
git commit -m "feat: add scene builder that composes full miner scene from tier"
```

---

### Task 8: Main Entry Point

**Files:**
- Modify: `src/index.js`

**Step 1: Write the main script**

Replace `src/index.js` with:
```js
import { writeFileSync } from "node:fs";
import { fetchContributions } from "./github-api.js";
import { getTier } from "./tiers.js";
import { buildScene } from "./scene-builder.js";

const USERNAME = process.env.GITHUB_USERNAME;
const TOKEN = process.env.GH_TOKEN;
const OUTPUT_FILE = "github-miner.svg";

async function main() {
  if (!USERNAME || !TOKEN) {
    console.error("Error: GITHUB_USERNAME and GH_TOKEN environment variables are required.");
    process.exit(1);
  }

  console.log(`Fetching contributions for ${USERNAME}...`);
  const calendar = await fetchContributions(USERNAME, TOKEN);
  const totalCommits = calendar.totalContributions;

  console.log(`Total contributions: ${totalCommits}`);
  const tier = getTier(totalCommits);
  console.log(`Tier: ${tier.level} — ${tier.description}`);

  const svg = buildScene(tier, totalCommits);
  writeFileSync(OUTPUT_FILE, svg);
  console.log(`Generated ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

**Step 2: Verify syntax is valid**

Run: `node --check src/index.js`
Expected: no output (syntax OK)

**Step 3: Commit**

```bash
git add src/index.js
git commit -m "feat: wire up main entry point to fetch, tier, and render"
```

---

### Task 9: GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/generate.yml`

**Step 1: Write the workflow**

Create `.github/workflows/generate.yml`:
```yaml
name: Generate GitHub Miner

on:
  schedule:
    - cron: "0 */6 * * *"  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  generate:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Generate SVG
        env:
          GITHUB_USERNAME: ${{ github.repository_owner }}
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
        run: node src/index.js

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add github-miner.svg
          git diff --staged --quiet || git commit -m "chore: update github-miner.svg"
          git push
```

**Step 2: Verify YAML syntax**

Run: `node -e "const fs = require('fs'); fs.readFileSync('.github/workflows/generate.yml', 'utf8'); console.log('YAML file is readable')"`
Expected: "YAML file is readable"

**Step 3: Commit**

```bash
git add .github/workflows/generate.yml
git commit -m "ci: add GitHub Actions workflow for SVG auto-generation"
```

---

### Task 10: README & Local Test Generation

**Files:**
- Create: `README.md`

**Step 1: Write README**

Create `README.md`:
```markdown
# GitHub Miner ⛏

A pixel art miner that evolves based on your GitHub commit activity.

![GitHub Miner](github-miner.svg)

## How It Works

A Node.js script fetches your GitHub contribution data and generates a pixel art SVG where:
- The mine gets deeper as you make more commits
- Your pickaxe upgrades through 5 tiers
- Gems and resources accumulate underground

Updated automatically every 6 hours via GitHub Actions.

## Setup

1. Create a GitHub Personal Access Token with `read:user` scope
2. Add it as a repository secret named `GH_TOKEN`
3. The GitHub Actions workflow handles the rest

## Local Development

```bash
export GITHUB_USERNAME=your-username
export GH_TOKEN=your-token
node src/index.js
```

## Tiers

| Tier | Commits | Scene |
|------|---------|-------|
| 1 | 0-499 | Surface mine, wooden pickaxe |
| 2 | 500-1999 | Shallow mine, iron pickaxe, few gems |
| 3 | 2000-4999 | Deep mine, steel pickaxe, gems and gold |
| 4 | 5000-9999 | Very deep mine, diamond pickaxe, abundant resources |
| 5 | 10000+ | Massive cavern, legendary gear, treasure hoard |
```

**Step 2: Generate a test SVG with mock data**

Run: `node -e "import('./src/tiers.js').then(({getTier}) => import('./src/scene-builder.js').then(({buildScene}) => { const fs = require('fs'); const tier = getTier(3500); fs.writeFileSync('github-miner.svg', buildScene(tier, 3500)); console.log('Test SVG generated'); }))"`
Expected: "Test SVG generated" and `github-miner.svg` created

**Step 3: Commit**

```bash
git add README.md github-miner.svg
git commit -m "docs: add README and initial test SVG"
```

---

### Task 11: Run All Tests

**Step 1: Run the full test suite**

Run: `node --test src/**/*.test.js`
Expected: All tests PASS

**Step 2: Fix any failures**

If any test fails, fix and re-run until all pass.

**Step 3: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: resolve test failures"
```
