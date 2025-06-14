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

import { EllipsisVertical, Info, Loader2 } from 'lucide-react'
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
import RegradeDialog from '@/components/essays/regrade-dialog'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
        // NEW COLUMN FOR RUBRIC NAME
        accessorKey: 'rubric.name', // Access the nested property
        header: 'Rubric',
        cell: ({ row }) => {
            const rubric = row.original.rubric
            return rubric ? rubric.name : 'N/A' // Display name if available, else 'N/A'
        },
    },

    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            const latestLog = row.original.error_grading_log

            const colorMap: Record<string, string> = {
                graded: 'bg-green-100 text-green-800',
                pending: 'bg-yellow-100 text-yellow-800',
                failed: 'bg-red-100 text-red-800',
            }
            const pendingLoaderColor = '#3b82f6'
            const badgeClass = colorMap[status] || 'bg-gray-100 text-gray-800'

            let toolTipMessage = 'An unexpected error occurred during grading.'
            if (status === 'failed' && latestLog) {
                switch (latestLog.failure_type) {
                    case 'PERMANENT_ERROR':
                        // Check for specific common permanent errors
                        if (latestLog.error_message.includes('malformed JSON response')) {
                            toolTipMessage =
                                'The AI had trouble understanding the essay or rubric. Please check the content for any unusual characters or try again.'
                        } else {
                            toolTipMessage =
                                'There was a lasting problem with the grading process that we could not fix automatically. Please try submitting the essay again.'
                        }
                        break
                    case 'RETRY_EXHAUSTED':
                        toolTipMessage =
                            'The grading process faced repeated temporary issues, possibly due to internet connection problems or a busy service. Please try again after a short while.'
                        break

                    case 'LLM_API_ERROR':
                        toolTipMessage =
                            'There was a problem communicating with the AI service. This is usually a temporary issue. Please try regrading the essay.'
                        break

                    default:
                        toolTipMessage = `Grading failed: ${
                            latestLog.error_message || 'An unknown issue occurred.'
                        } Please try again.`
                }
            }

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
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="size-3 text-red-900 font-bold" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs break-words">
                                        <p className="font-semibold mb-1">Grading Failed:</p>
                                        <p>{toolTipMessage}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
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
            const queryClient = useQueryClient()
            const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
            const [openRegradeDialog, setOpenRegradeDialog] = useState<boolean>(false)

            const closeDeleteDialog = () => setOpenDeleteDialog(false)
            const closeRegradeDialog = () => setOpenRegradeDialog(false)

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
                    closeDeleteDialog()
                },

                onError: (err: any) => {
                    console.error('Error deleting essay:', err)
                    toast.error('Failed to delete essay, please try again.')
                    closeDeleteDialog()
                },
            })

            const regradeEssayMutation = useMutation({
                mutationFn: async (formData: FormData) => {
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
                    closeRegradeDialog()
                },
                onError: (err: any) => {
                    console.error('Error regrading essay:', err)
                    toast.error('Failed to regrade essay, please try again.')
                    closeRegradeDialog()
                },
            })

            const handleDeleteEssay = () => {
                deleteEssayMutation.mutate(essay.id)
            }

            const handleRegradeEssay = (
                essayID: string,
                essayText: string,
                rubricCategory: string,
                gradeLevel: string,
                gradeIntensity: string,
                rubricUsed: string
            ) => {
                const formData = new FormData()
                formData.append('essay_id', essayID)
                formData.append('essay_text', essayText)
                formData.append('rubric_category', rubricCategory)
                formData.append('grade_level', gradeLevel)
                formData.append('grade_intensity', gradeIntensity)
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
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    {/* <RegradeDialog
                                        onRegrade={() =>
                                            handleRegradeEssay(
                                                essay.id,
                                                essay.essay_text,
                                                
                                                essay.rubric_used
                                            )
                                        }
                                        isPending={regradeEssayMutation.isPending}
                                        openDialog={openRegradeDialog}
                                        setOpenDialog={setOpenRegradeDialog}
                                    /> */}
                                </DropdownMenuItem>

                                {/* DELETE DROPDOWN MENU */}
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    {' '}
                                    <DeleteEssay
                                        onDelete={handleDeleteEssay}
                                        isPending={deleteEssayMutation.isPending}
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
