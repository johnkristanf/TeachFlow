'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { PrimaryButton } from '../ui/primary-button'
import { Rubric } from '@/types/rubrics'
import CrtiterionItem from './crtiterion-field'

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog'

import {
    essay_categories,
    grade,
    intensities,
    languages,
} from '@/constants/rubrics'
import { SkeletonLoader } from '../skeleton-loading'
import { Dispatch, SetStateAction } from 'react'

const EditRubric = ({
    data,
    onSubmit,
    isPending,
    openDialog,
    setOpenDialog,
}: {
    data: Rubric
    onSubmit: (data: Rubric) => void
    isPending: boolean
    openDialog: boolean
    setOpenDialog: Dispatch<SetStateAction<boolean>>
}) => {
    const { control, register, handleSubmit } = useForm<Rubric>({
        defaultValues: data,
    })

    const {
        fields: criteriaFields,
        append: appendCriterion,
        remove: removeCriterion,
    } = useFieldArray({
        control,
        name: 'criteria',
    })

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger>Edit Rubric</DialogTrigger>

            <DialogContent className="max-h-[600px] w-full md:max-w-4xl overflow-y-auto">
                {isPending ? (
                    <SkeletonLoader msg="Editing rubric..." />
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Preview and Edit Rubric</DialogTitle>
                        </DialogHeader>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div>
                                <label className="font-semibold text-sm">
                                    Rubric Name
                                </label>
                                <Input {...register('name')} />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Essay Category *
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {essay_categories.map((categ) => (
                                        <label
                                            key={categ}
                                            className="cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                value={categ}
                                                {...register('category', {
                                                    required:
                                                        'Category is required',
                                                })}
                                                className="peer hidden"
                                            />
                                            <div className="px-3 py-1 rounded-md border border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 transition">
                                                {categ}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {/* Grade Level */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Grade Level
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {grade.map((level) => (
                                        <label
                                            key={level}
                                            className="cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                value={level}
                                                {...register('grade', {
                                                    required:
                                                        'Grade is required',
                                                })}
                                                className="peer hidden"
                                            />
                                            <div className="px-3 py-1 rounded-md border border-blue-600  peer-checked:bg-blue-600  peer-checked:text-white peer-checked:border-blue-600 transition">
                                                {level}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Grading Intensity */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Grading Intensity *
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {intensities.map(({ label, icon }) => (
                                        <label
                                            key={label}
                                            className="cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                value={label}
                                                {...register('intensity', {
                                                    required:
                                                        'Intensity is required',
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
                            </div>

                            {/* Language */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Language *
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {languages.map((lang) => (
                                        <label
                                            key={lang}
                                            className="cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                value={lang}
                                                {...register('language', {
                                                    required:
                                                        'Language is required',
                                                })}
                                                className="peer hidden"
                                            />
                                            <div className="px-3 py-1 rounded-md border border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 transition">
                                                {lang}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Criteria Items */}
                            {criteriaFields.map((criterion, index) => (
                                <CrtiterionItem
                                    key={criterion.id}
                                    index={index}
                                    control={control}
                                    register={register}
                                    remove={removeCriterion}
                                />
                            ))}

                            <div>
                                <h1
                                    onClick={() =>
                                        appendCriterion({
                                            title: '',
                                            levels: [
                                                {
                                                    label: 'Excellent',
                                                    score: 5,
                                                    description: '',
                                                },
                                            ],
                                        })
                                    }
                                    className="text-blue-600 text-sm font-medium hover:underline hover:cursor-pointer"
                                >
                                    + Add Criterion
                                </h1>
                            </div>

                            <DialogFooter className="pt-4">
                                <DialogClose>
                                    <PrimaryButton
                                        type="button"
                                        color="black"
                                        variant="outline"
                                        size="md"
                                    >
                                        Cancel
                                    </PrimaryButton>
                                </DialogClose>
                                <PrimaryButton
                                    type="submit"
                                    color="blue"
                                    variant="outline"
                                    size="md"
                                >
                                    Save Changes
                                </PrimaryButton>
                            </DialogFooter>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default EditRubric
