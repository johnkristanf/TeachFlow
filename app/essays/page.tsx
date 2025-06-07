'use client'

import { PrimaryButton } from '@/components/ui/primary-button'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { EssayGradingForm } from '@/components/essays/grading-form'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { columns } from './columns'
import { DataTable } from '@/components/data-table'

export default function EssayPage() {
    const [openDialog, setOpenDialog] = useState<boolean>(false)

    const { data, isLoading, error } = useQuery({
        queryKey: ['essays'],
        queryFn: async () => {
            try {
                const res = await fetch('http://localhost:8000/api/v1/get/essays')
                return res.json()
            } catch (error: any) {
                throw new Error('Failed to fetch essays: ', error)
            }
        },
    })

    console.log('Essays Data: ', data)

    return (
        <div className="mt-5">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl text-blue-500 mb-5">Essays</h1>

                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <PrimaryButton color="blue" variant="outline">
                            Grade New Essay
                        </PrimaryButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[1000px] max-h-[600px] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Start Grading</DialogTitle>
                            <DialogDescription>
                                Please select the assessment attributes to guide the automated
                                evaluation. The grading process will proceed based on the criteria
                                you define.
                            </DialogDescription>
                        </DialogHeader>

                        <EssayGradingForm onCloseDialog={() => setOpenDialog(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable columns={columns} data={data ?? []} isLoading={isLoading} />
        </div>
    )
}
