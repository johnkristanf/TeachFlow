import { Rubric } from "./rubrics"

export type Essay = {
    name?: string
    rubricID: number
    classId?: number | null
    sourceType: string
    essayText: string
    status: string
}

export interface Evaluation {
    evaluation_id: string
    criterion?: string
    matched_label?: string
    score?: number
    max_score?: number
    reason?: string
    suggestion?: string
    evaluation_created_at?: Date
}

export interface Summary {
    summary_id: string
    total_score?: number
    max_total_score?: number
    overall_feedback?: string
}

export interface ErrorGradingLog {
    id: number // Assuming 'id' is serial/integer in essayGradingLogs
    logged_at: Date
    failure_type: string
    error_message: string
    error_details: Record<string, any> | null // JSONB can be any valid JSON, so Record<string, any> or a more specific type if known
}

export interface EssayWithEvalSummary {
    id: string
    name: string | null
    source_type: string
    essay_text: string
    status: string
    class_name: string
    created_at: Date

    evaluations: Evaluation[] 
    summary?: Summary 
    error_grading_log?: ErrorGradingLog
    rubric: Rubric,
}
