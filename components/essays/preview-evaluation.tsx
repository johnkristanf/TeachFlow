import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { EssayWithEvalSummary } from '@/types/essay'

interface PreviewEvaluationProps {
    essay: EssayWithEvalSummary
}

export default function PreviewEvaluation({essay}: PreviewEvaluationProps) {
    return (
        <div>
            <Dialog>
                <DialogTrigger>Preview</DialogTrigger>
                <DialogContent className="md:!max-w-3xl lg:!max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Evaluations for "{essay.name}"</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
                        {essay.evaluations?.length ? (
                            <>
                                {essay.evaluations.map((evalItem, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border rounded-lg p-4 shadow-sm space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-md font-semibold">
                                                {evalItem.criterion} ({evalItem.score}/
                                                {evalItem.max_score})
                                            </h3>
                                            {/* Optional Edit/Delete buttons here */}
                                        </div>

                                        <div className="text-sm text-gray-600">
                                            <p>{evalItem.reason}</p>
                                        </div>

                                        {evalItem.suggestion && (
                                            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 text-sm rounded-md">
                                                <strong className="text-blue-700">
                                                    Suggestion:
                                                </strong>{' '}
                                                {evalItem.suggestion}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Overall Grade Section */}
                                {essay.summary &&
                                    essay.summary.overall_feedback &&
                                    essay.summary.total_score &&
                                    essay.summary.max_total_score && (
                                        <div className="border-l-4 border-blue-400 border rounded-lg p-4 shadow-sm space-y-3">
                                            <h1 className="text-xl font-semibold text-blue-500">
                                                Overall Evaluation ({/* TOTAL SCORE */}
                                                {essay.summary.total_score} /{' '}
                                                {essay.summary.max_total_score}){' '}
                                                {/* TOTAL SCORE PERCENTAGE */}
                                                {(
                                                    (essay.summary.total_score /
                                                        essay.summary.max_total_score) *
                                                    100
                                                ).toFixed(1)}
                                                %
                                            </h1>

                                            <p className="text-md">
                                                Feedback: {essay.summary.overall_feedback}
                                            </p>
                                        </div>
                                    )}
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No evaluations available.
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
