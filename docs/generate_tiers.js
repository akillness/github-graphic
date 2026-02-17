import { writeFileSync } from "node:fs";
import { buildScene } from "../src/scene-builder.js";
import { getTier } from "../src/tiers.js";

// Representative commit counts for each tier
const TIER_COMMITS = [
  0,      // Tier 1 (Surface)
  250,    // Tier 2 (Shallow)
  1000,   // Tier 3 (Deep)
  2500,   // Tier 4 (Very Deep)
  5000    // Tier 5 (Massive)
];

TIER_COMMITS.forEach((commits, index) => {
  const level = index + 1;
  const tier = getTier(commits);
  const svg = buildScene(tier, commits);
  const fileName = `docs/images/tier-${level}.svg`;
  writeFileSync(fileName, svg);
  console.log(`Generated ${fileName}`);
});
