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

import { EllipsisVertical, Loader2 } from 'lucide-react'
import DeleteEssay from '@/components/essays/delete-essay'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import PreviewEvaluation from '@/components/essays/preview-evaluation'

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
                failed: 'bg-red-100 text-red-800',
            }
            const pendingLoaderColor = '#3b82f6'
            const badgeClass = colorMap[status] || 'bg-gray-100 text-gray-800'

            return (
                <div className="flex items-center gap-2">
                    {status === 'pending' && (
                        <Badge className={badgeClass} variant="outline">
                            <div className="flex items-center gap-2">
                                <Loader2
                                    className={`w-4 h-4 animate-spin text-[${pendingLoaderColor}]`}
                                />
                                EVALUATING
                            </div>
                        </Badge>
                    )}

                    {status === 'failed' && (
                        <Badge className={badgeClass} variant="default">
                            FAILED
                        </Badge>
                    )}

                    {status === 'graded' && (
                        <Badge className={badgeClass} variant="default">
                            GRADED
                        </Badge>
                    )}
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

            const regradeEssayMutation = useMutation({
                mutationFn: async (formData: FormData) => {
                    // Assuming you have a regrade API endpoint
                    const res = await fetch(`/api/essay/re-grade`, {
                        method: 'POST',
                        body: formData,
                    })

                    const data = await res.json()

                    if (!res.ok) {
                        throw new Error(data?.message || 'Failed to regrade essay')
                    }

                    return data
                },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['essays'] })
                    toast.success('Essay sent for regrading!')
                },
                onError: (err: any) => {
                    console.error('Error regrading essay:', err)
                    toast.error('Failed to regrade essay, please try again.')
                },
            })

            const handleDeleteEssay = () => {
                deleteEssayMutation.mutate(essay.id)
            }

            const handleRegradeEssay = (essayID: string, essayText: string, rubricUsed: string) => {
                const formData = new FormData()
                formData.append('essay_id', essayID)
                formData.append('essay_text', essayText)
                formData.append('rubric_used', rubricUsed)

                regradeEssayMutation.mutate(formData)
            }

            return (
                <div className="flex items-center gap-2">
                    {essay.status !== 'pending' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <EllipsisVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {/* PREVIEW DROPDOWN MENU */}
                                {essay.status !== 'failed' && essay.status !== 'pending' && (
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <PreviewEvaluation essay={essay} />
                                    </DropdownMenuItem>
                                )}

                                {/* REGRADE DROPDOWN MENU */}
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    onClick={() =>
                                        handleRegradeEssay(
                                            essay.id,
                                            essay.essay_text,
                                            essay.rubric_used
                                        )
                                    }
                                >
                                    Re-Grade
                                </DropdownMenuItem>

                                {/* DELETE DROPDOWN MENU */}
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    {' '}
                                    <DeleteEssay
                                        onDelete={handleDeleteEssay}
                                        isPending={deleteEssayMutation.isPending}
                                        isGraded={!isGradingStatusPending}
                                        openDialog={openDeleteDialog}
                                        setOpenDialog={setOpenDeleteDialog}
                                    />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            )
        },
    },
]
