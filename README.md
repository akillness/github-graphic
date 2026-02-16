# GitHub Miner

A pixel art miner inspired by 굴착소년 쿵 (Under Attack) that evolves based on your GitHub commit activity.

![GitHub Miner](github-miner.svg)

## How It Works

A Node.js script fetches your GitHub contribution data and generates a pixel art SVG featuring:
- An orange-bodied miner standing on green grass with clouds drifting overhead
- Sandy underground that deepens as you make more commits
- Gray boulders scattered along the surface
- Pickaxe upgrades through 5 tiers
- Gems and resources accumulating underground
- A game-style HUD showing your commit count, current tier, depth, and progress toward the next tier

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
| 1 | 0-249 | Surface mine, wooden pickaxe |
| 2 | 250-999 | Shallow mine, iron pickaxe, few gems |
| 3 | 1000-2499 | Deep mine, steel pickaxe, gems and gold |
| 4 | 2500-4999 | Very deep mine, diamond pickaxe, abundant resources |
| 5 | 5000+ | Massive cavern, legendary gear, treasure hoard |
