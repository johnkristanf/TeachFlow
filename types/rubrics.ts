export type Rubric = {
    id: number
    name: string
    grade: string
    intensity: string
    language: string
    created_by: string
    createdAt: string
}


export interface Level {
  id: number;
  criterionId: number;
  label: string;
  score: number;
  description: string;
}

export interface Criterion {
  id: number;
  rubricId: number;
  title: string;
  levels: Level[];
}

export interface RubricWithDetails {
  id: number;
  name: string;
  created_by: string;
  criteria: Criterion[];
}
