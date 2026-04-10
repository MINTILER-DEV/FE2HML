const DIFFICULTY_MIN = 6;
const DIFFICULTY_MAX = 9.99;

export function normalizeDifficultyScore(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return Math.min(DIFFICULTY_MAX, Math.max(DIFFICULTY_MIN, rounded));
}

export function isValidDifficultyScore(value: number) {
  return value >= DIFFICULTY_MIN && value <= DIFFICULTY_MAX;
}

export function getDifficultyLabel(value: number) {
  if (value >= 9) {
    return "Cataclysmic";
  }

  if (value >= 8) {
    return "Legendary";
  }

  if (value >= 7) {
    return "Extreme";
  }

  return "Crazy+";
}

export { DIFFICULTY_MAX, DIFFICULTY_MIN };
