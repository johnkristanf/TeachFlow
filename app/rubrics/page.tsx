'use client'

import { DataTable } from '@/components/data-table'
import { columns } from './columns'
import { PrimaryButton } from '@/components/ui/primary-button'
import StartScratchRubric from '@/components/rubrics/start-scratch'
import { useQuery } from '@tanstack/react-query'
import BuildWithAI from '@/components/rubrics/build-with-ai'

export default function RubricsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['rubrics'],
        queryFn: async () => {
            const res = await fetch('/api/rubrics')
            if (!res.ok) throw new Error('Failed to fetch rubrics')
            return res.json()
        },
    })

    console.log('Rubrics Data: ', data)

    return (
        <div className="mt-5">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-4xl font-bold text-blue-600">Rubrics</h1>

                {/* <StartScratchRubric /> */}

                <BuildWithAI />

                {/* <PrimaryButton color="blue" variant="solid">
                            Use Template
                        </PrimaryButton> */}
            </div>

            <DataTable columns={columns} data={data ?? []} isLoading={isLoading} />
        </div>
    )
}
