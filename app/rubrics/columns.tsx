'use client'

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

        return (
            <Badge className={`${color} ${textColor}`}>
                {label}
            </Badge>
        )
    },
    },

    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const rubric = row.original

            const handlePreview = () => {
                // For now, just log. Replace with modal logic later
                console.log('Preview rubric:', rubric)
                alert(`Previewing rubric: ${rubric.name}`)
            }

            return (
                <div className="flex items-center gap-3">
                    <PrimaryButton color="black" variant="solid" onClick={handlePreview}>
                        Preview
                    </PrimaryButton>

                    <PrimaryButton color="red" variant="solid" onClick={handlePreview}>
                        Delete
                    </PrimaryButton>
                </div>
            )
        },
    },
]
