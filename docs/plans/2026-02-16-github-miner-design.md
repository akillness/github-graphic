# GitHub Miner - Commit Visualization Design

A pixel art miner scene that evolves based on your GitHub commit activity, displayed as an SVG in your GitHub profile README.

## Concept

A mining-themed pixel art scene where:
- The mine gets deeper as you commit more
- The miner's gear upgrades with more activity
- Gems and resources accumulate based on commit count
- Subtle CSS animations bring the scene to life (pickaxe swing, gem sparkle)

## Data Pipeline

**Source:** GitHub GraphQL API (`contributionsCollection.contributionCalendar`)
- Fetches daily commit counts for the past year
- Sums total commits to determine tier
- Requires a PAT with `read:user` scope

**Commit Thresholds:**

| Tier | Commits | Scene |
|------|---------|-------|
| 1 | 0-500 | Surface mine, basic pickaxe, no gems |
| 2 | 500-2000 | Shallow mine, iron pickaxe, few gems |
| 3 | 2000-5000 | Deep mine, steel pickaxe, gems and gold |
| 4 | 5000-10000 | Very deep mine, diamond pickaxe, abundant resources, minecart |
| 5 | 10000+ | Massive cavern, legendary gear, treasure hoard |

The exact commit count is displayed as text in the SVG.

## SVG Architecture

- **Viewport:** ~800x400px with `viewBox` for scaling
- **Pixel size:** Each "pixel" is a 4x4px SVG `<rect>`
- **Layers (back to front):** background (sky/ground) -> mine shaft -> resources/gems -> miner character -> UI overlay (commit count)
- **Format:** Pure SVG with embedded CSS animations — no external dependencies

**CSS Animations:**
- Pickaxe: gentle swinging motion
- Gems: subtle sparkle/glow pulse

**Pixel art definitions:** Each asset (miner, pickaxe, gems, mine walls) stored as a 2D array of hex color values in JS modules.

## Tech Stack

- **Runtime:** Node.js
- **Dependencies:** Minimal — `node-fetch` or native fetch for API calls, pure string templating for SVG
- **Output:** `github-miner.svg` in repo root

## Repository Structure

```
github-graphic/
├── src/
│   ├── index.js          # Main: fetch data -> generate SVG
│   ├── github-api.js     # GitHub GraphQL API client
│   ├── scene-builder.js  # Compose scene based on tier
│   └── assets/           # Pixel art definitions
│       ├── miner.js
│       ├── mine.js
│       └── gems.js
├── .github/
│   └── workflows/
│       └── generate.yml  # GitHub Actions workflow
├── github-miner.svg      # Generated output
├── package.json
└── README.md
```

## GitHub Actions

- **Schedule:** Every 6 hours via cron + manual `workflow_dispatch`
- **Steps:** Checkout -> run Node.js script -> commit updated SVG -> push
- **Secrets:** `GH_TOKEN` (PAT with `read:user` scope) for API access; `GITHUB_TOKEN` for commits

## Profile Integration

Embed in your profile README (`username/username` repo):
```markdown
![GitHub Miner](https://raw.githubusercontent.com/USERNAME/github-graphic/main/github-miner.svg)
```

The SVG updates in-place so the README never needs changing.
