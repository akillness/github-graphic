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

## Setup with Claude Code

If you use [Claude Code](https://claude.com/claude-code), copy the prompt below and paste it into your terminal. Claude will handle the rest.

<details>
<summary>Copy this prompt</summary>

```
Set up GitHub Miner on my profile. Run each step using gh CLI. Only ask me when you need my PAT.

1. Run `gh auth status` to confirm I'm logged in. Extract my username.
2. Fork tmdgusya/github-graphic to my account: `gh repo fork tmdgusya/github-graphic --clone=false --remote=false`
3. Enable Actions on the fork: `gh api -X PUT repos/{me}/github-graphic/actions/permissions -f enabled=true -f allowed_actions=all`
4. Ask me to create a PAT at https://github.com/settings/tokens/new?scopes=read:user&description=github-miner and paste it here.
5. Store the token: `gh secret set GH_TOKEN --repo {me}/github-graphic --body "{token}"`
6. Detect the default branch: `gh repo view {me}/github-graphic --json defaultBranchRef --jq '.defaultBranchRef.name'`
7. Trigger the workflow: `gh workflow run generate.yml --repo {me}/github-graphic`
8. Poll until the run completes: `gh run list --repo {me}/github-graphic --limit 1 --json status,conclusion`. If it fails, show the logs with `gh run view {id} --repo {me}/github-graphic --log-failed`.
9. Create my profile repo if it doesn't exist: `gh repo create {me}/{me} --public --add-readme --description "My GitHub profile"`
10. Clone the profile repo to /tmp, read the existing README.md, and APPEND (do NOT replace existing content) this block at the end:

---

<a href="https://github.com/{me}/github-graphic">
  <img src="https://raw.githubusercontent.com/{me}/github-graphic/{branch}/github-miner.svg" alt="GitHub Miner" width="800" />
</a>

<sub>⛏️ This pixel art miner evolves as I commit code. <a href="https://github.com/tmdgusya/github-graphic">Get your own!</a></sub>

11. Commit and push the profile README change, then clean up the temp clone.
12. Verify the SVG is accessible: `curl -s -o /dev/null -w "%{http_code}" "https://raw.githubusercontent.com/{me}/github-graphic/{branch}/github-miner.svg"`
```

</details>

## Local Development

```bash
export GITHUB_USERNAME=your-username
export GH_TOKEN=your-token
node src/index.js
```

## Gamification Features

Your miner reacts to your GitHub activity in real time. All data is computed from the existing contribution calendar API — no extra API calls needed.

### Streak HUD

Displays your current consecutive commit streak below the COMMITS counter.

| Streak | Visual |
|--------|--------|
| 0 days | Hidden |
| 1–6 days | `STREAK: 3d` in white |
| 7–29 days | `STREAK: 14d` in gold |
| 30+ days | `STREAK: 45d` in gold with pulse animation |

### Miner State

The miner changes appearance based on recent activity.

| State | Condition | Visual Effect |
|-------|-----------|---------------|
| **Active** | Committed today | Pickaxe swings (–40° rotation, 1.2s cycle). Anime-style swoosh arcs flash on the downstroke. Spark particles burst at impact. |
| **Normal** | Last commit 1–6 days ago | Default static pose. No animation. |
| **Idle** | No commits for 7+ days | Closed eyes, pickaxe resting on ground, muted opacity (65%), floating "zzz" text with pulse. |

### Achievement Alcove

A carved stone panel on the left underground wall displays earned milestones in a 4×2 grid. Earned slots show a carved icon; unearned slots show blank dark stone.

| Slot | Milestone | Icon | Condition |
|------|-----------|------|-----------|
| 1 | First Steps | Pickaxe | 50+ contributions |
| 2 | Century | Star | 100+ contributions |
| 3 | Dedicated | Double Pickaxe | 500+ contributions |
| 4 | Veteran | Diamond | 1,000+ contributions |
| 5 | Master | Crown | 2,500+ contributions |
| 6 | Legend | Trophy | 5,000+ contributions |
| 7 | Streak Starter | Small Flame | Longest streak ≥ 7 days |
| 8 | Streak Master | Large Flame | Longest streak ≥ 30 days |

### Pickaxe Swing Detail

When the miner is in **Active** state, the pickaxe animation has three layers:

1. **Swing** — The pickaxe pixels (handle + head) rotate –40° around the grip point using SVG `<animateTransform>`. Eased with cubic-bezier for a natural arc.
2. **Swoosh arcs** — Three white speed lines at radii 10/14/18px trace the swing path. Opacity is synced to the **downstroke** (invisible on upswing, flash on downswing).
3. **Impact sparks** — Six colored particles (#FFD700, #FF6B35, #FFA500, #FFFFFF) burst near the pickaxe head, also timed to the downstroke.

## Tier Gallery

| Tier | Commits | Description | Preview |
|------|---------|-------------|---------|
| **1** | 0+ | **Surface Mine:** Just breaking ground. Roots visible near the surface. Wooden pickaxe. | ![Tier 1](docs/images/tier-1.svg) |
| **2** | 250+ | **Shallow Mine:** Digging deeper. Vertical wooden supports appear. Iron pickaxe. Some gems. | ![Tier 2](docs/images/tier-2.svg) |
| **3** | 1,000+ | **Deep Mine:** Established shaft. Horizontal beams and lanterns light the way. Steel pickaxe. Gold and gems. | ![Tier 3](docs/images/tier-3.svg) |
| **4** | 2,500+ | **Very Deep Mine:** Magical depths. Glowing mushrooms and complex structures. Diamond pickaxe. Abundant resources. | ![Tier 4](docs/images/tier-4.svg) |
| **5** | 5,000+ | **Massive Cavern:** The motherlode. Legendary gear and a hoard of treasure. | ![Tier 5](docs/images/tier-5.svg) |
