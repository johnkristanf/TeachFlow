'use client'

import { PrimaryButton } from '@/components/ui/primary-button'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { EssayGradingForm } from '@/components/essays/grading-form'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { columns } from './columns'
import { DataTable } from '@/components/data-table'
import { EssayWithEvalSummary } from '@/types/essay'
import { Classes } from '@/types/classes'

export default function EssayPage() {
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [timer, setTimer] = useState<number>(30) // countdown in seconds
    const [pollingInterval, setPollingInterval] = useState<false | number>(false)
    const [hasPendingStatus, setHasPendingStatus] = useState<boolean>(false)
    const [selectClassFilter, setSelectClassFilter] = useState<number | null>(null)

    // FETCH ESSAYS
    const { data = [], isLoading } = useQuery<EssayWithEvalSummary[], Error>({
        queryKey: ['essays', selectClassFilter],
        queryFn: async () => {
            const res = await fetch(`/api/essay?selectClassFilter=${selectClassFilter}`)
            if (!res.ok) {
                throw new Error('Failed to fetch essays')
            }

            return res.json()
        },
        refetchInterval: pollingInterval,
    })

    // Timer countdown logic - reset on every fetch/refetch
    useEffect(() => {
        if (!data) return

        console.log('essay new: ', data)

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

    // CLASSES
    const {
        data: classes,
        isLoading: isClassesLoading,
        isError: isClassesError,
        error: classesError,
    } = useQuery<Classes[], Error>({
        queryKey: ['essay_class_filter'], // Unique key for full class data
        queryFn: async () => {
            const response = await fetch('/api/classes?component=dropdown')
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch classes with projection')
            }

            return data
        },
    })

    return (
        <div className="mt-5">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-5">Essays</h1>

                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <PrimaryButton color="blue" variant="solid">
                            Grade New Essay
                        </PrimaryButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[1000px] max-h-[600px] overflow-y-auto">
                        <EssayGradingForm onCloseDialog={() => setOpenDialog(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* NEXT UPDATE TIMER COUNT DOWN */}
            {data && hasPendingStatus && (
                <div className="mb-3 text-gray-600 font-medium">
                    Next Update in {timer} second{timer !== 1 ? 's' : ''}
                </div>
            )}


            {/* CLASS FILTER DROPDOWN */}
            <Select
                value={selectClassFilter === null ? '' : selectClassFilter.toString()}
                onValueChange={(value) => {
                    // Update the classId in your formData state
                    setSelectClassFilter(() =>
                        value === 'all_class' || value === '' ? null : Number(value)
                    )
                }}
            >
                <SelectTrigger className="mb-3">
                    <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                    {isClassesLoading && (
                        <SelectItem value="loading" disabled>
                            Loading classes...
                        </SelectItem>
                    )}
                    {isClassesError && (
                        <SelectItem value="error" disabled className="text-red-500">
                            Error: {classesError?.message || 'Failed to load classes'}
                        </SelectItem>
                    )}
                    {!isClassesLoading && !isClassesError && (
                        <SelectGroup>
                            <SelectItem value={'all_class'}>All Classes</SelectItem>

                            {classes &&
                                classes.length > 0 &&
                                classes.map((cls) => (
                                    <SelectItem
                                        key={cls.id}
                                        value={cls.id?.toString() ?? ''}
                                    >
                                        {cls.name}
                                    </SelectItem>
                                ))}
                        </SelectGroup>
                    )}
                </SelectContent>
            </Select>

            <DataTable columns={columns} data={data ?? []} isLoading={isLoading} />
        </div>
    )
}
