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
import { DialogDescription } from '@radix-ui/react-dialog'
import DeleteEssay from '@/components/essays/delete-essay'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
                        {status === 'pending' ? 'EVALUATING' : status.toUpperCase()}
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
            const isGradingStatusPending = essay.status === 'pending'

            const queryClient = useQueryClient()
            const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)

            const closeDialog = () => setOpenDeleteDialog(false)

            const deleteEssayMutation = useMutation({
                mutationFn: async (essayID: string) => {
                    const res = await fetch(`/api/essay/${essayID}`, {
                        method: 'DELETE',
                    })
                    const data = await res.json()

                    if (!res.ok) {
                        throw new Error(data?.message || 'Failed to delete essay')
                    }

                    return data
                },

                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['essays'] })
                    toast.success('Essay deleted successfully!')
                    closeDialog()
                },

                onError: (err: any) => {
                    console.error('Error deleting essay:', err)
                    toast.error('Failed to delete essay, please try again.')
                    closeDialog()
                },
            })

            const handleDeleteEssay = () => {
                deleteEssayMutation.mutate(essay.id)
            }

            return (
                <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <PrimaryButton
                                color="blue"
                                size="sm"
                                disabled={isGradingStatusPending}
                                className={
                                    isGradingStatusPending ? 'opacity-50 cursor-not-allowed' : ''
                                }
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
                                        {essay.summary &&
                                            essay.summary.overall_feedback &&
                                            essay.summary.total_score &&
                                            essay.summary.max_total_score && (
                                                <div className="bg-blue-600 text-white border rounded-lg p-4 shadow-sm space-y-3">
                                                    <h1 className="text-xl font-semibold">
                                                        Overall Evaluation
                                                    </h1>

                                                    <p className="text-md mb-2">
                                                        Total Score: {essay.summary.total_score} /{' '}
                                                        {essay.summary.max_total_score}{' '}
                                                        {/* PERCENTAGE */}
                                                        {(
                                                            (essay.summary.total_score /
                                                                essay.summary.max_total_score) *
                                                            100
                                                        ).toFixed(1)}
                                                        %
                                                    </p>

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

                    <DeleteEssay
                        onDelete={handleDeleteEssay}
                        isPending={deleteEssayMutation.isPending}
                        isGraded={!isGradingStatusPending}
                        openDialog={openDeleteDialog}
                        setOpenDialog={setOpenDeleteDialog}
                    />
                </div>
            )
        },
    },
]
