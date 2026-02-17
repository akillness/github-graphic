import { writeFileSync } from "node:fs";
import { fetchContributions } from "./github-api.js";
import { getTier } from "./tiers.js";
import { buildScene } from "./scene-builder.js";
import { parseActivity } from "./activity.js";

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

  const activity = parseActivity(calendar);
  console.log(`Streak: ${activity.currentStreak}d | Active today: ${activity.isActiveToday} | Milestones: ${activity.milestones.length}`);

  const svg = buildScene(tier, totalCommits, activity);
  writeFileSync(OUTPUT_FILE, svg);
  console.log(`Generated ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
