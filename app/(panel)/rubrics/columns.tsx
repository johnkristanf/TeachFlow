'use client'

import DeleteRubric from '@/components/rubrics/delete-rubric'
import EditRubric from '@/components/rubrics/edit-rubric'
import { Badge } from '@/components/ui/badge'
import { Rubric } from '@/types/rubrics'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { toast } from 'sonner'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EllipsisVerticalIcon } from 'lucide-react'

export const columns: ColumnDef<Rubric>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },

    {
        accessorKey: 'category',
        header: 'Category',
    },
    {
        accessorKey: 'grade',
        header: 'Grade',
    },
    {
        accessorKey: 'intensity',
        header: 'Intensity',
    },
    {
        accessorKey: 'language',
        header: 'Language',
    },
    {
        accessorKey: 'created_by',
        header: 'Created By',
        cell: ({ getValue }) => {
            const value = getValue() as string
            const isTeachFlow = value === 'teachflow_rubrics'
            const label = isTeachFlow ? 'TeachFlow' : 'Me'
            const color = isTeachFlow ? 'bg-blue-600' : 'bg-yellow-600'
            const textColor = 'text-white'

            return <Badge className={`${color} ${textColor}`}>{label}</Badge>
        },
    },

    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const rubric = row.original
            const queryClient = useQueryClient()
            const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
            const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)

            const editRubricMutation = useMutation({
                mutationFn: async (data: Rubric) => {
                    const res = await fetch(`/api/rubrics/${data.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    })

                    if (!res.ok) {
                        const error = await res.json()
                        throw new Error(error?.message || 'Failed to create rubric')
                    }

                    return res.json()
                },

                onSuccess: (response) => {
                    console.log('Rubric saved:', response)
                    queryClient.invalidateQueries({ queryKey: ['rubrics'] })
                    toast.success('Rubric Edited Successfully!')
                    setOpenEditDialog(false)
                },

                onError: (err) => {
                    console.error('Error editing rubric:', err)
                    toast.error('Failed to edit rubric, please try again.')
                    setOpenEditDialog(false)
                },
            })

            const deleteRubricMutation = useMutation({
                mutationFn: async (rubricId: number) => {
                    const res = await fetch(`/api/rubrics/${rubricId}`, {
                        method: 'DELETE',
                    })

                    if (!res.ok) {
                        const error = await res.json()
                        throw new Error(error?.message || 'Failed to delete rubric')
                    }

                    return res.json()
                },

                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['rubrics'] })
                    toast.success('Rubric deleted successfully!')
                    setOpenDeleteDialog(false)
                },

                onError: (err: any) => {
                    console.error('Error deleting rubric:', err)
                    toast.error('Failed to delete rubric, please try again.')
                    setOpenDeleteDialog(false)
                },
            })

            const handleEditRubric = (data: Rubric) => {
                editRubricMutation.mutate(data)
            }

            const handleDeleteRubric = () => {
                deleteRubricMutation.mutate(rubric.id)
            }

            return (
                <div className="flex items-center gap-2">
                    <EditRubric
                        data={rubric}
                        onSubmit={handleEditRubric}
                        isPending={editRubricMutation.isPending}
                        openDialog={openEditDialog}
                        setOpenDialog={setOpenEditDialog}
                    />

                    <DeleteRubric
                        onDelete={handleDeleteRubric}
                        isPending={deleteRubricMutation.isPending}
                        openDialog={openDeleteDialog}
                        setOpenDialog={setOpenDeleteDialog}
                    />
                </div>
            )
        },
    },
]
