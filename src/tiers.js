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
      const nextLevelMinCommits = i < TIERS.length - 1 ? TIERS[i + 1].minCommits : null;
      return { ...TIERS[i], nextLevelMinCommits };
    }
  }
  return { ...TIERS[0], nextLevelMinCommits: TIERS[1].minCommits };
}
