import { DialogClose } from '@radix-ui/react-dialog'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { PrimaryButton } from '../ui/primary-button'
import { BuildWithAIRubricCreate, Rubric } from '@/types/rubrics'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Dispatch, SetStateAction } from 'react'
import { SkeletonLoader } from '../skeleton-loading'
import { essay_categories, grade, intensities, languages } from '@/constants/rubrics'

const BuildWithAIForm = ({
    setBuildWithAIResponses,
}: {
    setBuildWithAIResponses: Dispatch<SetStateAction<Rubric | undefined>>
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<BuildWithAIRubricCreate>({
        defaultValues: {
            name: '',
            grade: 'Middle School',
            category: 'Expository',
            intensity: 'Normal',
            language: 'US English',
            criteria: [{ title: '' }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'criteria',
    })

    const mutation = useMutation({
        mutationFn: async (data: BuildWithAIRubricCreate) => {
            const res = await fetch('/api/rubrics/ai', {
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
            const parsedResponse = JSON.parse(response)
            setBuildWithAIResponses(parsedResponse)
        },

        onError: (err) => {
            console.error('Error saving rubric:', err)
            toast.error('Failed to create rubric.')
        },
    })

    const onSubmit = (data: BuildWithAIRubricCreate) => {
        mutation.mutate(data)
    }

    return (
        <div>
            {mutation.isPending ? (
                <SkeletonLoader msg="Cooking up your rubric... AI chef at work!" />
            ) : (
                <>
                    <DialogHeader>
                        <DialogTitle>Generated AI Rubric</DialogTitle>
                        <DialogDescription>
                            Modify details that matches your standards
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6 py-4">
                            {/* Rubric Name */}
                            <div>
                                <label className="block font-medium mb-1">Rubric Name *</label>
                                <input
                                    {...register('name', { required: 'Rubric name is required' })}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Rubric name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Grade Level */}
                            <div>
                                <label className="block font-medium mb-1">Grade *</label>
                                <div className="flex gap-2 flex-wrap">
                                    {grade.map((level) => (
                                        <label key={level} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                value={level}
                                                {...register('grade', {
                                                    required: 'Grade is required',
                                                })}
                                                className="peer hidden"
                                            />
                                            <div className="px-3 py-1 rounded-md border border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 transition">
                                                {level}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.grade && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.grade.message}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block font-medium mb-1">Essay Category *</label>
                                <div className="flex gap-2 flex-wrap">
                                    {essay_categories.map((categ) => (
                                        <label key={categ} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                value={categ}
                                                {...register('category', {
                                                    required: 'Category is required',
                                                })}
                                                className="peer hidden"
                                            />
                                            <div className="px-3 py-1 rounded-md border border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 transition">
                                                {categ}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.category && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.category.message}
                                    </p>
                                )}
                            </div>

                            {/* Grading Intensity */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Grading Intensity *
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {intensities.map(({ label, icon }) => (
                                        <label key={label} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                value={label}
                                                {...register('intensity', {
                                                    required: 'Intensity is required',
                                                })}
                                                className="peer hidden"
                                            />
                                            <div
                                                className={`px-3 py-1 rounded-md border flex items-center gap-2
                                                border-blue-600 text-gray-700
                                                peer-checked:text-white 
                                                peer-checked:border-blue-600
                                                peer-checked:bg-blue-600
                                                transition`}
                                            >
                                                <span>{icon}</span>
                                                {label}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.intensity && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.intensity.message}
                                    </p>
                                )}
                            </div>

                            {/* Language */}
                            <div>
                                <label className="block font-medium mb-1">Language *</label>
                                <div className="flex gap-2 flex-wrap">
                                    {languages.map((lang) => (
                                        <label key={lang} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                value={lang}
                                                {...register('language', {
                                                    required: 'Language is required',
                                                })}
                                                className="peer hidden"
                                            />
                                            <div className="px-3 py-1 rounded-md border border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 transition">
                                                {lang}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.language && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.language.message}
                                    </p>
                                )}
                            </div>

                            {/* CRITERIA */}
                            <div>
                                <label className="block font-medium mb-1">Criteria *</label>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-2 mb-2">
                                        <input
                                            {...register(`criteria.${index}.title`, {
                                                required: 'Required',
                                            })}
                                            className="flex-1 border px-3 py-2 rounded"
                                            placeholder={`Evidence & Support`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-red-600 hover:underline hover:cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}

                                <h1
                                    className="text-blue-600 hover:cursor-pointer hover:underline"
                                    onClick={() => append({ title: '' })}
                                >
                                    + Add Criterion
                                </h1>
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <PrimaryButton color="black" variant="solid" size="md">
                                    Cancel
                                </PrimaryButton>
                            </DialogClose>
                            <PrimaryButton type="submit" color="blue" variant="solid" size="md">
                                Build
                            </PrimaryButton>
                        </DialogFooter>
                    </form>
                </>
            )}
        </div>
    )
}

export default BuildWithAIForm
