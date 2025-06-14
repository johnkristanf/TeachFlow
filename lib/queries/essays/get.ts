import { db } from '@/database'

export async function getEssays() {
    const result = await db.execute(`

        WITH LatestGradingLog AS (
            SELECT
                id,
                essay_id,
                logged_at,
                failure_type,
                error_message,
                error_details,
                ROW_NUMBER() OVER (PARTITION BY essay_id ORDER BY logged_at DESC) as rn
            FROM
                essay_grading_logs
        )

       SELECT 
            e.id,
            e.name,
            e.rubric_id,
            e.source_type,
            e.essay_text,
            e.status,
            e.created_at,
            to_jsonb(es) - 'essay_id' AS summary,

            COALESCE(
                json_agg(
                    json_build_object(
                        'id', ev.id,
                        'criterion', ev.criterion,
                        'matched_label', ev.matched_label,
                        'score', ev.score,
                        'max_score', ev.max_score,
                        'reason', ev.reason,
                        'suggestion', ev.suggestion,
                        'created_at', ev.created_at
                    )
                ) FILTER (WHERE ev.id IS NOT NULL), '[]'
            ) AS evaluations,


            CASE
                WHEN e.status = 'failed' AND lgl.id IS NOT NULL THEN
                    json_build_object(
                        'id', lgl.id,
                        'logged_at', lgl.logged_at,
                        'failure_type', lgl.failure_type,
                        'error_message', lgl.error_message,
                        'error_details', lgl.error_details
                    )
                ELSE NULL
            END AS error_grading_log,


            CASE
                WHEN r.id IS NOT NULL THEN
                    json_build_object(
                        'id', r.id,
                        'name', r.name
                    )
                ELSE NULL
            END AS rubric

        FROM essay e
        LEFT JOIN essay_evaluations ev ON e.id = ev.essay_id
        LEFT JOIN essay_summaries es ON e.id = es.essay_id
        LEFT JOIN LatestGradingLog lgl ON e.id = lgl.essay_id AND lgl.rn = 1 
        LEFT JOIN rubrics r ON e.rubric_id = r.id
        GROUP BY e.id, es.id, r.id, lgl.id, lgl.logged_at, lgl.failure_type, lgl.error_message, lgl.error_details 
        ORDER BY e.created_at DESC;
    `)

    // Return an array of rows (objects)
    return result.rows
}

