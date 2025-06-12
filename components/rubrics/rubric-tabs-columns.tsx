'use client'

import { Badge } from '@/components/ui/badge'
import { PrimaryButton } from '@/components/ui/primary-button'
import { useRubricStore } from '@/store/useStoreRubric'
import { Rubric } from '@/types/rubrics'
import { ColumnDef } from '@tanstack/react-table'

export const rubric_tabs_columns: ColumnDef<Rubric>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },

    {
        accessorKey: 'created_by',
        header: 'Created By',
        cell: ({ getValue }) => {
            const value = getValue() as string
            const isTeachFlow = value === 'teachflow_rubrics'
            const label = isTeachFlow ? 'TeachFlow' : 'Me'
            const color = isTeachFlow ? 'bg-blue-600' : 'bg-yellow-600'
            return <Badge className={`${color} text-white`}>{label}</Badge>
        },
    },

    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const rubric = row.original
            const setCriteria = useRubricStore((state) => state.setCriteria)
            const setRubric = useRubricStore((state) => state.setRubric)

            const isSelectedRubric = useRubricStore((state) => state.rubric.id) == rubric.id

            const handleSelectRubric = () => {
                setCriteria(rubric.criteria)
                setRubric({
                    id: rubric.id,
                    name: rubric.name,
                    category: rubric.category,
                    grade: rubric.grade,
                    intensity: rubric.intensity,
                    language: rubric.language,
                    created_by: rubric.created_by,
                })
            }

            return (
                <PrimaryButton
                    color="blue"
                    variant="outline"
                    onClick={handleSelectRubric}
                    disabled={isSelectedRubric}
                >
                    {isSelectedRubric ? 'Selected' : 'Select'}
                </PrimaryButton>
            )
        },
    },
]
