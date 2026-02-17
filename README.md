# GitHub Miner

**English** | [한국어](README_ko.md)

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

If you use [Claude Code](https://claude.com/claude-code), copy the prompt below and paste it into your terminal. Claude will handle everything — even if you've never used GitHub before.

<details>
<summary>Copy this prompt</summary>

```
Set up GitHub Miner on my profile. Handle everything autonomously. Explain each step in plain language and only ask me when browser action is required.

IMPORTANT RULES:
- After each step, tell me what you just did in simple, friendly language.
- If any step fails, provide a browser-based fallback with click-by-click instructions.
- Never show my token value in messages after storing it.

PHASE 0 — PREREQUISITES:

0-1. Check if gh CLI is installed: `gh --version`
     If NOT installed, tell me:
       "First, we need to install the GitHub CLI tool. Please run this in your terminal:"
       - macOS: `brew install gh`
       - Windows: `winget install --id GitHub.cli`
       - Linux: see https://github.com/cli/cli/blob/trunk/docs/install_linux.md
     Wait for me to confirm, then re-check.

0-2. Check if gh is authenticated: `gh auth status`
     If NOT authenticated, tell me:
       "I need to connect your terminal to GitHub. I'll run a command that will:"
       "1) Show a one-time code  2) Open your browser  3) Ask you to paste the code and click Authorize"
     Then run: `gh auth login --web --git-protocol https`
     Wait for completion, then verify with `gh auth status`.

0-3. Extract my username: `gh api user --jq '.login'` → store as {me}.

PHASE 1 — GET THE REPOSITORY:

1-1. Check if I already have it: `gh repo view {me}/github-graphic --json name 2>&1`
     If exists → skip to Phase 2.

1-2. Fork: `gh repo fork tmdgusya/github-graphic --clone=false --remote=false`
     Verify: `gh repo view {me}/github-graphic --json name,url`
     If fork fails, tell me to open https://github.com/tmdgusya/github-graphic/fork and click "Create fork".

1-3. Enable Actions: `gh api -X PUT repos/{me}/github-graphic/actions/permissions -f enabled=true -f allowed_actions=all`
     If fails, tell me to open https://github.com/{me}/github-graphic/actions and click the green enable button.

PHASE 2 — CREATE A SECURITY TOKEN:

Tell me:
  "Now I need you to create an access key so the miner can read your GitHub activity."
  "Please open this link: https://github.com/settings/tokens/new?scopes=read:user&description=github-miner"
  ""
  "On that page:"
  "1. 'Note' field → should already say 'github-miner' (don't change it)"
  "2. 'Expiration' dropdown → select 'No expiration' so your miner never stops"
  "3. 'Select scopes' → 'read:user' should already be checked (don't check anything else)"
  "4. Scroll down → click the green 'Generate token' button"
  "5. You'll see a code starting with ghp_ → copy it immediately (GitHub won't show it again!)"
  "6. Paste it here"

When I provide the token:
- Validate it starts with `ghp_` and is 30+ characters. If not, ask me to try again.
- Verify it works: `gh api -H "Authorization: token {token}" user --jq '.login'`
- If 401 error, tell me the token might be wrong and ask to recreate it.

PHASE 3 — STORE THE TOKEN:

3-1. `gh secret set GH_TOKEN --repo {me}/github-graphic --body "{token}"`
3-2. Verify: `gh secret list --repo {me}/github-graphic` → should show GH_TOKEN.
     If fails, guide me to https://github.com/{me}/github-graphic/settings/secrets/actions/new
     with Name: GH_TOKEN and Secret: the token I pasted.

PHASE 4 — SET UP PROFILE PAGE:

4-1. Check if profile repo exists: `gh repo view {me}/{me} --json name 2>&1`
     If not, create it: `gh repo create {me}/{me} --public --add-readme --description "My GitHub profile"`
     If creation fails, guide me to https://github.com/new with repository name = my username.

4-2. Detect branches:
     `gh repo view {me}/github-graphic --json defaultBranchRef --jq '.defaultBranchRef.name'` → {branch}
     `gh repo view {me}/{me} --json defaultBranchRef --jq '.defaultBranchRef.name'` → {profile_branch}

4-3. Check if miner is already embedded:
     `gh api repos/{me}/{me}/contents/README.md --jq '.content' | base64 --decode 2>/dev/null`
     If it contains "github-miner.svg" → skip to Phase 5.

4-4. Clone profile repo to /tmp, read existing README.md, and APPEND (do NOT replace existing content):

---

<a href="https://github.com/{me}/github-graphic">
  <img src="https://raw.githubusercontent.com/{me}/github-graphic/{branch}/github-miner.svg" alt="GitHub Miner" width="800" />
</a>

<sub>⛏️ This pixel art miner evolves as I commit code. <a href="https://github.com/tmdgusya/github-graphic">Get your own!</a></sub>

     Commit, push, and clean up the temp clone.

PHASE 5 — START THE MINER:

5-1. `gh workflow run generate.yml --repo {me}/github-graphic`
5-2. Wait ~30s, then poll: `gh run list --repo {me}/github-graphic --limit 1 --json status,conclusion,databaseId`
     If in_progress, wait and re-check. If failed, show logs with `gh run view {id} --repo {me}/github-graphic --log-failed`.
5-3. Verify SVG: `curl -s -o /dev/null -w "%{http_code}" "https://raw.githubusercontent.com/{me}/github-graphic/{branch}/github-miner.svg"` → expect 200.

PHASE 6 — DONE!

Tell me: "Your GitHub Miner is live! Open https://github.com/{me} to see it. It updates every 6 hours automatically. The more you commit, the deeper your mine gets!"
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

| State | Condition | Visual Effect | Preview |
|-------|-----------|---------------|---------|
| **Active** | Committed today | Pickaxe swings (–40° rotation, 1.2s cycle). Anime-style swoosh arcs flash on the downstroke. Spark particles burst at impact. | ![Active](docs/images/state-active.svg) |
| **Normal** | Last commit 1–6 days ago | Default static pose. No animation. | ![Normal](docs/images/state-normal.svg) |
| **Idle** | No commits for 7+ days | Closed eyes, pickaxe resting on ground, muted opacity (65%), floating "zzz" text with pulse. | ![Idle](docs/images/state-idle.svg) |

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
