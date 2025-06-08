import { db } from '@/database'

export async function getEssays() {
    const result = await db.execute(`
       SELECT 
            e.id,
            e.name,
            e.rubric_used,
            e.source_type,
            e.essay_text,
            e.status,
            e.created_at,

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

            to_jsonb(es) - 'essay_id' AS summary

        FROM essay e
        LEFT JOIN essay_evaluations ev ON e.id = ev.essay_id
        LEFT JOIN essay_summaries es ON e.id = es.essay_id
        GROUP BY e.id, es.id
        ORDER BY e.created_at DESC;
    `)

    // Return an array of rows (objects)
    return result.rows
}
