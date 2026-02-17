const TIERS = [
  { level: 1, minCommits: 0, description: "Surface mine, basic pickaxe", mineDepth: 3, pickaxe: "wood", gemCount: 0 },
  { level: 2, minCommits: 250, description: "Shallow mine, iron pickaxe, few gems", mineDepth: 5, pickaxe: "iron", gemCount: 3 },
  { level: 3, minCommits: 1000, description: "Deep mine, steel pickaxe, gems and gold", mineDepth: 8, pickaxe: "steel", gemCount: 6 },
  { level: 4, minCommits: 2500, description: "Very deep mine, diamond pickaxe, abundant resources", mineDepth: 12, pickaxe: "diamond", gemCount: 10 },
  { level: 5, minCommits: 5000, description: "Massive cavern, legendary gear, treasure hoard", mineDepth: 16, pickaxe: "legendary", gemCount: 15 },
];

/**
 * Tier별 asset 밀도 설정
 * - targetCount: 목표 생성 개수 (adaptive threshold 사용)
 * - maxCount: 최대 생성 개수 (하드 제한)
 * - minDistance: asset 간 최소 거리 (픽셀 단위, 0 = 무시)
 */
export const ASSET_DENSITY = {
  // Roots: 지표면 근처 뿌리 (Tier 1+) - 장식용, 적당히 유지
  roots: {
    tierScaling: true,
    byLevel: {
      1: { targetCount: 5, maxCount: 8, minDistance: 10 },
      2: { targetCount: 6, maxCount: 10, minDistance: 9 },
      3: { targetCount: 8, maxCount: 12, minDistance: 8 },
      4: { targetCount: 10, maxCount: 14, minDistance: 7 },
      5: { targetCount: 12, maxCount: 16, minDistance: 6 },
    },
  },
  // Gems: 지하 광물 - 메인 자원, 가장 많이 생성되어야 함!
  gems: {
    tierScaling: true,
    byLevel: {
      1: { targetCount: 0, maxCount: 0, minDistance: 5 },
      2: { targetCount: 15, maxCount: 20, minDistance: 5 },
      3: { targetCount: 25, maxCount: 35, minDistance: 4 },
      4: { targetCount: 40, maxCount: 55, minDistance: 3 },
      5: { targetCount: 55, maxCount: 70, minDistance: 3 },
    },
  },
  // Mushrooms: 깊은 곳의 발광 버섯 (Tier 4+) - 희귀 장식
  mushrooms: {
    tierScaling: true,
    byLevel: {
      1: { targetCount: 0, maxCount: 0, minDistance: 10 },
      2: { targetCount: 0, maxCount: 0, minDistance: 10 },
      3: { targetCount: 0, maxCount: 0, minDistance: 8 },
      4: { targetCount: 4, maxCount: 6, minDistance: 10 },    // 8 → 4
      5: { targetCount: 6, maxCount: 8, minDistance: 8 },     // 15 → 6
    },
  },
  // Beams: 지지대 (Tier 2+) - 구조물
  beams: {
    tierScaling: true,
    byLevel: {
      1: { vertical: 0, horizontal: 0, maxTotal: 0 },
      2: { vertical: 3, horizontal: 0, maxTotal: 3 },         // 4 → 3
      3: { vertical: 5, horizontal: 2, maxTotal: 7 },         // 6+3 → 5+2
      4: { vertical: 6, horizontal: 3, maxTotal: 9 },         // 8+4 → 6+3
      5: { vertical: 8, horizontal: 4, maxTotal: 12 },        // 10+6 → 8+4
    },
  },
  // Bats: 박쥐 (Tier 2+) - 희귀 생물
  bats: {
    tierScaling: true,
    byLevel: {
      1: { maxCount: 0 },
      2: { maxCount: 1 },   // 2 → 1
      3: { maxCount: 2 },   // 3 → 2
      4: { maxCount: 3 },   // 4 → 3
      5: { maxCount: 4 },   // 6 → 4
    },
  },
  // Skulls: 해골 (Tier 3+) - 매우 희귀
  skulls: {
    tierScaling: true,
    byLevel: {
      1: { maxCount: 0 },
      2: { maxCount: 0 },
      3: { maxCount: 1 },   // 2 → 1
      4: { maxCount: 2 },   // 3 → 2
      5: { maxCount: 3 },   // 5 → 3
    },
  },
};

/**
 * 주어진 tier level에 해당하는 asset 밀도 설정을 반환
 */
export function getAssetDensity(assetType, tierLevel) {
  const config = ASSET_DENSITY[assetType];
  if (!config) return null;

  if (config.tierScaling) {
    return config.byLevel[tierLevel] || config.byLevel[1];
  }
  return config;
}

export function getTier(commitCount) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (commitCount >= TIERS[i].minCommits) {
      const nextLevelMinCommits = i < TIERS.length - 1 ? TIERS[i + 1].minCommits : null;
      return { ...TIERS[i], nextLevelMinCommits };
    }
  }
  return { ...TIERS[0], nextLevelMinCommits: TIERS[1].minCommits };
}
