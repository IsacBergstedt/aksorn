export interface ExerciseOutcome {
  characterId: string;
  correct: boolean;
}

export type OnExerciseComplete = (outcomes: ExerciseOutcome[]) => void;
