export type LearnerPresentation = "story" | "balanced" | "direct";
export type LearnerPace = "calm" | "steady" | "intensive";
export type LearnerSupport = "light" | "standard" | "guided";
export type TrialResult = "too-easy" | "right" | "too-hard";

export type LearnerChoice = {
  presentation: LearnerPresentation;
  pace: LearnerPace;
  support: LearnerSupport;
};

export type ProfileAdjustment = {
  selected: LearnerChoice;
  recommended: LearnerChoice;
  changed: boolean;
  reason: string;
};

export function normalizeLearnerChoice(choice?: Partial<LearnerChoice>): LearnerChoice;

export function recommendProfileAdjustment(
  choice: Partial<LearnerChoice>,
  trialResult: TrialResult,
): ProfileAdjustment;
