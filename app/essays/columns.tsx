'use client'

import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { PrimaryButton } from '@/components/ui/primary-button'
import { EssayWithEvalSummary } from '@/types/essay'

import { Loader2 } from 'lucide-react'

export type Essay = {
    id: string
    name: string
    rubric_used: string
    source_type: string
    essay_text: string
    status: string
    created_at: string
    evaluations?: Evaluation[]
}

type Evaluation = {
    criterion: string
    matched_label?: string
    score?: number
    max_score?: number
    reason?: string
    suggestion?: string
    overall_feedback?: string
    total_score?: number
    max_total_score?: number
    created_at?: string
}

// Define the columns for the table
export const columns: ColumnDef<EssayWithEvalSummary>[] = [
    {
        accessorKey: 'name',
        header: 'Essay Name',
    },

    {
        accessorKey: 'rubric_used',
        header: 'Rubric',
    },

    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string

            const colorMap: Record<string, string> = {
                graded: 'bg-green-100 text-green-800',
                pending: 'bg-yellow-100 text-yellow-800',
            }

            const badgeClass = colorMap[status] || 'bg-gray-100 text-gray-800'

            return (
                <div className="flex items-center gap-2">
                    {status === 'pending' && (
                        <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
                    )}
                    <Badge className={badgeClass} variant="outline">
                        {status === 'pending' ? "EVALUATING" : status.toUpperCase()}
                    </Badge>
                </div>
            )
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const essay = row.original
            const [open, setOpen] = useState<boolean>(false)
            const isPending = essay.status === 'pending'

            return (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <PrimaryButton
                            color="blue"
                            size="sm"
                            disabled={isPending}
                            className={isPending ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                            Preview
                        </PrimaryButton>
                    </DialogTrigger>
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
                                    {essay.summary && essay.summary.overall_feedback && (
                                        <div className="bg-blue-600 text-white border rounded-lg p-4 shadow-sm space-y-3">
                                            <h1 className="text-xl font-semibold">
                                                Overall Feedback
                                            </h1>
                                            <p className="text-md">
                                                {essay.summary.overall_feedback}
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
            )
        },
    },
]
