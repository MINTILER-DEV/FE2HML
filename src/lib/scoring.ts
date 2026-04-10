export type ScoreFormulaInput = {
  difficultyScore: number;
  placement: number;
  isCompletion: boolean;
  percent: number;
  isTeamMap?: boolean;
};

export function computeRecordPoints({
  difficultyScore,
  placement,
  isCompletion,
  percent,
  isTeamMap = false,
}: ScoreFormulaInput) {
  const placementWeight = Math.max(22, 165 - (placement - 1) * 3.8);
  const difficultyMultiplier = 1 + difficultyScore / 260;
  const percentMultiplier = isCompletion
    ? 1
    : Math.max(0.35, Math.min(0.96, percent / 100));
  const completionBonus = isCompletion ? 1.15 : 1;
  const teamAdjustment = isTeamMap ? 0.92 : 1;

  return Number(
    (
      placementWeight *
      difficultyMultiplier *
      percentMultiplier *
      completionBonus *
      teamAdjustment
    ).toFixed(2),
  );
}
