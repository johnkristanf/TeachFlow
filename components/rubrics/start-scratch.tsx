'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useState } from 'react'
import { PrimaryButton } from '../ui/primary-button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Switch } from '../ui/switch'
import CrtiterionItem from './crtiterion-field'

const rubricDetails = {
    grade: ['Elementary', 'Middle School', 'High School', 'College'],
    intensity: ['Easy', 'Normal', 'Strict'],
    language: ['US English', 'UK English', 'AUS English'],
    essay_categories: [
        'Argumentative',
        'Descriptive',
        'Expository',
        'Narrative',
        'Analytical',
        'Reflective',
        'Compare & Contrast',
    ],
}

const StartScratchRubric = () => {
    const { register, control, handleSubmit, watch } = useForm({
        defaultValues: {
            name: '',
            grade: 'College',
            intensity: 'Strict',
            language: 'US English',
            type: 'advanced',
            criteria: [
                {
                    title: '',
                    levels: [{ label: 'Excellent', score: 5, description: '' }],
                },
            ],
        },
    })

    const {
        fields: criteriaFields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: 'criteria',
    })

    const queryyClient = useQueryClient()


    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch('/api/rubrics', {
                method: 'POST',
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
            queryyClient.invalidateQueries({ queryKey: ['rubrics'] })
            toast.success('Rubric Created Successfully!')
        },
        onError: (err) => {
            console.error('Error saving rubric:', err)
        },
    })


    const onSubmit = (data: any) => {
        console.log('data rubric: ', data)
        mutation.mutate(data)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <PrimaryButton color="blue" variant="outline">
                    Start Scratch
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] max-h-[600px] overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Rubric Settings</DialogTitle>
                        <DialogDescription>
                            Set the grading options and click save when you're done.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div>
                            <label className="block font-medium mb-1">Rubric name *</label>
                            <input
                                {...register('name')}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Name"
                            />
                        </div>

                        {/* Rubric Details Sections */}
                        <div className="grid grid-cols-1  gap-6">
                            {(['grade', 'intensity', 'language'] as const).map((key) => (
                                <div key={key}>
                                    <label className="block font-semibold mb-2 capitalize">
                                        {key.replace('_', ' ')} *
                                    </label>

                                    <div className="flex flex-wrap gap-2">
                                        {rubricDetails[key].map((opt) => (
                                            <label key={opt}>
                                                <input
                                                    type="radio"
                                                    value={opt}
                                                    {...register(key)}
                                                    className="peer hidden"
                                                />
                                                <div className="peer-checked:border-blue-600 peer-checked:text-blue-600 border px-3 py-1 rounded-full cursor-pointer text-sm">
                                                    {opt}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rubric Criteria */}
                    {criteriaFields.map((field, index) => (
                        <CrtiterionItem
                            key={field.id}
                            index={index}
                            control={control}
                            register={register}
                            remove={remove}
                        />
                    ))}

                    <button
                        type="button"
                        onClick={() =>
                            append({
                                title: '',
                                levels: [{ label: 'Excellent', score: 5, description: '' }],
                            })
                        }
                        className="text-sm text-blue-600 font-medium hover:underline hover:cursor-pointer"
                    >
                        + Add criteria
                    </button>

                    <DialogFooter>
                        <DialogClose asChild>
                            <PrimaryButton color="black" variant="solid" size="md">
                                Cancel
                            </PrimaryButton>
                        </DialogClose>
                        <PrimaryButton type="submit" color="blue" variant="solid" size="md">
                            Save changes
                        </PrimaryButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default StartScratchRubric
