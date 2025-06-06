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
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Switch } from '../ui/switch'

const rubricDetails = {
    grade: ['Elementary', 'Middle School', 'High School', 'College'],
    intensity: ['Easy', 'Normal', 'Strict'],
    language: ['US English', 'UK English', 'AUS English'],
}

const CriteriaItem = ({ control, register, index, remove }: any) => {
    const {
        fields,
        append,
        remove: removeLevel,
    } = useFieldArray({
        control,
        name: `criteria.${index}.levels`,
    })

    return (
        <div className="border rounded p-4">
            <div className="flex gap-2 items-center">
                <input
                    {...register(`criteria.${index}.title`)}
                    placeholder="Criteria Title - for example, Evidence"
                    className="w-full border px-2 py-1 rounded"
                />
                <button type="button" onClick={() => remove(index)} className="text-red-500">
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {fields.map((field, levelIndex) => (
                    <div key={field.id} className="border p-3 rounded relative pt-8">
                        <input
                            {...register(`criteria.${index}.levels.${levelIndex}.label`)}
                            className="w-full mb-1 px-2 py-1 border rounded"
                            placeholder="Label"
                        />
                        <input
                            type="number"
                            {...register(`criteria.${index}.levels.${levelIndex}.score`, {
                                valueAsNumber: true,
                            })}
                            className="w-full mb-1 px-2 py-1 border rounded"
                            placeholder="Score"
                        />
                        <textarea
                            {...register(`criteria.${index}.levels.${levelIndex}.description`)}
                            rows={4}
                            placeholder={`Enter requirements the student needs to demonstrate to get this score. 
                                \n Ex: Presents clear, convincing, and relevant evidence that fully supports the argument. Sources are accurately cited, thoroughly analyzed, and seamlessly integrated into the writing.`}
                            className="w-full px-2 py-1 border rounded"
                        />
                        <button
                            type="button"
                            onClick={() => removeLevel(levelIndex)}
                            className="absolute top-2 right-2 text-red-500"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={() =>
                    append({
                        label: 'Excellent',
                        score: 5,
                        description: '',
                    })
                }
                className="text-sm text-blue-600 font-medium mt-2"
            >
                + Add Level
            </button>
        </div>
    )
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
    })

    const onSubmit = (data: any) => {
        console.log("data rubric: ", data);
        
        mutation.mutate(data, {
            onSuccess: (response) => {
                console.log('Rubric saved:', response)
                toast.success('Rubric Created Successfully!')
            },
            onError: (err) => {
                console.error('Error saving rubric:', err)
            },
        })
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
                        <CriteriaItem
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
                        className="text-sm text-blue-600 font-medium"
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
