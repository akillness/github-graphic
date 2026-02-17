# Gamification Features Design

**Date:** 2026-02-17
**Goal:** Make users feel rewarded for committing more by adding activity-driven visual feedback

## Data Source

The GitHub GraphQL API already returns per-day contribution data (`weeks[].contributionDays[].{ contributionCount, date }`) but only `totalContributions` is currently used. All four features below use this existing data — no additional API calls needed.

New data to compute from `calendar`:
- `currentStreak`: consecutive days with >= 1 commit (counting back from today)
- `longestStreak`: max consecutive days ever in the calendar year
- `isActiveToday`: whether today has >= 1 commit
- `daysSinceLastCommit`: days since most recent commit
- `weeklyHeatmap`: last 12 weeks of daily commit counts (for wall pattern)
- `milestones`: list of achieved milestones (computed from totalContributions + streak data)

## Feature 1: Streak HUD

**Location:** Bottom-left of HUD area (below existing COMMITS panel)
**Format:** `STREAK: 14d` with fire color (#FF6B35) when active
**Behavior:**
- 0 days: hidden (no streak)
- 1-6 days: white text
- 7-29 days: gold text (#FFD700)
- 30+ days: gold text with CSS pulse animation

**Data:** `currentStreak` computed from `calendar.weeks` walking backwards from today.

## Feature 2: Miner State

Three states based on recent activity:

| State | Condition | Visual Change |
|-------|-----------|---------------|
| Active | `isActiveToday === true` | Pickaxe gets `.pickaxe` CSS class (swing animation already exists). Small particle sparks near pickaxe head. |
| Idle | `daysSinceLastCommit >= 7` | "zzz" text floats above miner head. Pickaxe rests on ground (sprite variant). Muted colors (reduced opacity). |
| Normal | Otherwise | Current appearance, no animation |

**Implementation:** New `getMiner(pickaxeType, state)` parameter. The `idle` sprite variant shows the miner leaning/sleeping. The `active` state reuses current sprite but adds the swing class + spark particles.

## Feature 3: Milestone Petroglyphs

**Concept:** Carved symbols on the mine wall — like ancient cave paintings discovered during excavation. Each milestone unlocked adds a petroglyph etched in the underground wall.

**Visual style:** 5x5 pixel sprites using wall-color variations (e.g., underground dirt #C4963F darkened to #A07830 for the carving). Subtle, not flashy — they should feel discovered.

**Placement:** Scattered in the upper-underground area (near surface, first 30% of underground depth) using `generateRandomPositions`. Max 8-10 visible at once.

**Milestones:**

| Milestone | Icon | Condition |
|-----------|------|-----------|
| First Steps | pickaxe | `totalContributions >= 50` |
| Century | star | `totalContributions >= 100` |
| Dedicated | double-pickaxe | `totalContributions >= 500` |
| Veteran | diamond | `totalContributions >= 1000` |
| Master | crown | `totalContributions >= 2500` |
| Legend | trophy | `totalContributions >= 5000` |
| Streak Starter | small flame | `longestStreak >= 7` |
| Streak Master | large flame | `longestStreak >= 30` |

## Feature 4: Commit Heatmap Wall

**Concept:** A section of mine wall shows the last 12 weeks of daily commit activity as a pixel grid, using ore/stone colors instead of GitHub's green palette.

**Visual style:**
- 12 columns (weeks) x 7 rows (days) = 84 cells
- Each cell is 1 grid pixel (4x4 SVG pixels)
- Color palette maps commit intensity to underground stone shades:
  - 0 commits: dark stone (#5C4A3A)
  - 1-2 commits: medium stone (#8B7355)
  - 3-5 commits: copper ore (#B87333)
  - 6+ commits: gold ore (#DAA520)

**Location:** Right side of underground, vertically centered. Looks like a mineral vein pattern in the wall.

**Border:** 1px darker outline to frame it as a distinct wall section.

## Implementation Priority

1. **Data layer** — Parse `calendar` into streak/milestone/heatmap data (prerequisite for all)
2. **Streak HUD** — Smallest change, immediate visual feedback
3. **Miner State** — Core character change, high impact
4. **Milestone Petroglyphs** — New sprite type + placement logic
5. **Heatmap Wall** — Most complex rendering, lowest priority

## Architecture

```
index.js
  fetchContributions() → { totalContributions, calendar }
                                     ↓
  NEW: parseActivity(calendar) → { currentStreak, longestStreak,
                                    isActiveToday, daysSinceLastCommit,
                                    weeklyHeatmap, milestones }
                                     ↓
  buildScene(tier, commitCount, activity)  ← new parameter
```

The `activity` object is optional for backwards compatibility. If absent, all new features degrade gracefully (no streak shown, normal miner state, no petroglyphs, no heatmap).
