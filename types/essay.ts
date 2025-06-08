
export type Essay = {
  name?: string;              
  rubricUsed: string;
  sourceType: string;
  essayText: string;
  status: string;
};


export interface Evaluation {
  evaluation_id: string;
  criterion?: string;
  matched_label?: string;
  score?: number;
  max_score?: number;
  reason?: string;
  suggestion?: string;
  evaluation_created_at?: Date;
}

export interface Summary {
  summary_id: string;
  total_score?: number;
  max_total_score?: number;
  overall_feedback?: string;
}

export interface EssayWithEvalSummary {
  id: string;
  name: string | null;
  rubric_used: string;
  source_type: string;
  essay_text: string;
  status: string;
  created_at: Date;

  evaluations: Evaluation[]; // array of evaluations
  summary?: Summary;         // optional summary object
}
