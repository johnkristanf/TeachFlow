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
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { columns } from './columns'
import { DataTable } from '@/components/data-table'
import { EssayWithEvalSummary } from '@/types/essay'

export default function EssayPage() {
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [timer, setTimer] = useState<number>(30) // countdown in seconds
    const [pollingInterval, setPollingInterval] = useState<false | number>(false)
    const [hasPendingStatus, setHasPendingStatus] = useState<boolean>(false)

    const {
        data = [],
        isLoading,
    } = useQuery<EssayWithEvalSummary[], Error>({
        queryKey: ['essays'],
        queryFn: async () => {
            const res = await fetch('/api/essay')
            if (!res.ok) throw new Error('Failed to fetch essays')
            return res.json()
        },
        refetchInterval: pollingInterval,
    })

    console.log('Essays Data 123: ', data)

    // Timer countdown logic - reset on every fetch/refetch
    useEffect(() => {
        if (!data) return

        const hasPending = data.some((essay) => essay.status === 'pending')

        if (hasPending) {
            setHasPendingStatus(true)
            setPollingInterval(hasPending ? 30000 : false)
            setTimer(30)

            // Create interval to count down every second
            const intervalId = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) return 30 // reset after 0, since fetch will happen
                    return prev - 1
                })
            }, 1000)

            return () => clearInterval(intervalId)
        } else {
            setHasPendingStatus(false)
        }
        
    }, [data])

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

            {data && hasPendingStatus && (
                <div className="mb-3 text-gray-600 font-medium">
                    Next Update in {timer} second{timer !== 1 ? 's' : ''}
                </div>
            )}

            <DataTable columns={columns} data={data ?? []} isLoading={isLoading} />
        </div>
    )
}
