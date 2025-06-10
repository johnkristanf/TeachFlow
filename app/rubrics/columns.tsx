'use client'

import EditRubric from '@/components/rubrics/edit-rubric'
import { Badge } from '@/components/ui/badge'
import { PrimaryButton } from '@/components/ui/primary-button'
import { Rubric } from '@/types/rubrics'
import { ColumnDef } from '@tanstack/react-table'

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

            const handlePreview = () => {
                
            }

            return (
                <div className="flex items-center gap-3">
                    <EditRubric data={rubric} onSubmit={handlePreview} />

                    <PrimaryButton color="red" variant="solid" onClick={handlePreview}>
                        Delete
                    </PrimaryButton>
                </div>
            )
        },
    },
]
