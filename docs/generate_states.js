import { writeFileSync } from "node:fs";
import { buildScene } from "../src/scene-builder.js";
import { getTier } from "../src/tiers.js";

// Use Tier 3 (1000 commits) as the base — enough depth for visual interest
const COMMITS = 1000;
const tier = getTier(COMMITS);

const STATES = [
  {
    name: "active",
    activity: {
      currentStreak: 5,
      longestStreak: 14,
      isActiveToday: true,
      daysSinceLastCommit: 0,
      weeklyHeatmap: [],
      milestones: [
        { id: "first_steps", icon: "pickaxe" },
        { id: "century", icon: "star" },
        { id: "dedicated", icon: "double_pickaxe" },
        { id: "veteran", icon: "diamond" },
        { id: "streak_starter", icon: "small_flame" },
        { id: "streak_master", icon: "large_flame" },
      ],
    },
  },
  {
    name: "normal",
    activity: {
      currentStreak: 0,
      longestStreak: 14,
      isActiveToday: false,
      daysSinceLastCommit: 3,
      weeklyHeatmap: [],
      milestones: [
        { id: "first_steps", icon: "pickaxe" },
        { id: "century", icon: "star" },
        { id: "dedicated", icon: "double_pickaxe" },
        { id: "veteran", icon: "diamond" },
        { id: "streak_starter", icon: "small_flame" },
        { id: "streak_master", icon: "large_flame" },
      ],
    },
  },
  {
    name: "idle",
    activity: {
      currentStreak: 0,
      longestStreak: 14,
      isActiveToday: false,
      daysSinceLastCommit: 10,
      weeklyHeatmap: [],
      milestones: [
        { id: "first_steps", icon: "pickaxe" },
        { id: "century", icon: "star" },
        { id: "dedicated", icon: "double_pickaxe" },
        { id: "veteran", icon: "diamond" },
        { id: "streak_starter", icon: "small_flame" },
        { id: "streak_master", icon: "large_flame" },
      ],
    },
  },
];

STATES.forEach(({ name, activity }) => {
  const svg = buildScene(tier, COMMITS, activity);
  const fileName = `docs/images/state-${name}.svg`;
  writeFileSync(fileName, svg);
  console.log(`Generated ${fileName}`);
});
