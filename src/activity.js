/**
 * Parses GitHub contribution calendar data into activity metrics
 * used by gamification features (streak HUD, miner state, petroglyphs, heatmap).
 */

const MILESTONES = [
  { id: "first_steps",    icon: "pickaxe",        condition: (s) => s.totalContributions >= 50 },
  { id: "century",        icon: "star",           condition: (s) => s.totalContributions >= 100 },
  { id: "dedicated",      icon: "double_pickaxe", condition: (s) => s.totalContributions >= 500 },
  { id: "veteran",        icon: "diamond",        condition: (s) => s.totalContributions >= 1000 },
  { id: "master",         icon: "crown",          condition: (s) => s.totalContributions >= 2500 },
  { id: "legend",         icon: "trophy",         condition: (s) => s.totalContributions >= 5000 },
  { id: "streak_starter", icon: "small_flame",    condition: (s) => s.longestStreak >= 7 },
  { id: "streak_master",  icon: "large_flame",    condition: (s) => s.longestStreak >= 30 },
];

/**
 * Flatten weeks[].contributionDays[] into a single sorted array of { date, count }.
 */
function flattenDays(weeks) {
  const days = [];
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      days.push({ date: day.date, count: day.contributionCount });
    }
  }
  // Already chronological from the API, but sort to be safe
  days.sort((a, b) => a.date.localeCompare(b.date));
  return days;
}

/**
 * Parse the contribution calendar into activity metrics.
 *
 * @param {{ totalContributions: number, weeks: Array }} calendar
 * @returns {{ currentStreak, longestStreak, isActiveToday, daysSinceLastCommit, weeklyHeatmap, milestones }}
 */
export function parseActivity(calendar) {
  const days = flattenDays(calendar.weeks);
  if (days.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      isActiveToday: false,
      daysSinceLastCommit: null,
      weeklyHeatmap: [],
      milestones: [],
    };
  }

  const today = new Date().toISOString().slice(0, 10);
  const lastDay = days[days.length - 1];

  // isActiveToday: last day in calendar is today and has commits
  const isActiveToday = lastDay.date === today && lastDay.count > 0;

  // daysSinceLastCommit: walk backwards to find most recent commit day
  let daysSinceLastCommit = null;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) {
      const commitDate = new Date(days[i].date + "T00:00:00");
      const todayDate = new Date(today + "T00:00:00");
      daysSinceLastCommit = Math.floor((todayDate - commitDate) / (1000 * 60 * 60 * 24));
      break;
    }
  }

  // currentStreak: consecutive days with >= 1 commit, counting back from today
  // If today has no commits yet, start counting from yesterday
  let currentStreak = 0;
  let startIdx = days.length - 1;

  // Find today or the most recent day in the calendar
  if (lastDay.date === today && lastDay.count === 0) {
    // Today exists but no commits — start streak check from yesterday
    startIdx = days.length - 2;
  }

  for (let i = startIdx; i >= 0; i--) {
    if (days[i].count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  // longestStreak: max consecutive days with commits across the entire calendar
  let longestStreak = 0;
  let runLength = 0;
  for (const day of days) {
    if (day.count > 0) {
      runLength++;
      if (runLength > longestStreak) longestStreak = runLength;
    } else {
      runLength = 0;
    }
  }

  // weeklyHeatmap: last 12 weeks of daily commit counts
  const weeks = calendar.weeks;
  const last12 = weeks.slice(-12);
  const weeklyHeatmap = last12.map((w) =>
    w.contributionDays.map((d) => d.contributionCount)
  );

  // milestones: evaluate each condition against computed stats
  const stats = {
    totalContributions: calendar.totalContributions,
    longestStreak,
  };
  const achievedMilestones = MILESTONES.filter((m) => m.condition(stats)).map(
    (m) => ({ id: m.id, icon: m.icon })
  );

  return {
    currentStreak,
    longestStreak,
    isActiveToday,
    daysSinceLastCommit,
    weeklyHeatmap,
    milestones: achievedMilestones,
  };
}
