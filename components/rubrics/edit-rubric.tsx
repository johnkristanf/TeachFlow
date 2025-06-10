'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
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

import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { essay_categories, grade, intensities, languages } from '@/constants/rubrics'

const EditRubric = ({ data, onSubmit }: { data: Rubric; onSubmit: (data: Rubric) => void }) => {
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
        <Dialog>
            <DialogTrigger asChild>
                <PrimaryButton type="button" variant="solid" color="blue" size="sm">
                    Edit Rubric
                </PrimaryButton>
            </DialogTrigger>

            <DialogContent className="max-h-[600px] w-full md:max-w-4xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Preview and Edit Rubric</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="font-semibold text-sm">Rubric Name</label>
                        <Input {...register('name')} />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="font-semibold text-sm block mb-2">Category</label>
                        <Controller
                            control={control}
                            name="category"
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex flex-wrap gap-2"
                                >
                                    {essay_categories.map((cat) => (
                                        <div key={cat}>
                                            <RadioGroupItem
                                                value={cat}
                                                id={`cat-${cat}`}
                                                className="peer sr-only"
                                            />
                                            <label
                                                htmlFor={`cat-${cat}`}
                                                className="peer-checked:bg-blue-500 peer-checked:text-white px-4 py-2 rounded-md border border-blue-500 text-blue-600 text-sm font-medium cursor-pointer transition-colors"
                                            >
                                                {cat}
                                            </label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )}
                        />
                    </div>

                    {/* Grade */}
                    <div>
                        <label className="font-semibold text-sm block mb-2">Grade Level</label>
                        <Controller
                            control={control}
                            name="grade"
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex flex-wrap gap-2"
                                >
                                    {grade.map((level) => (
                                        <div key={level}>
                                            <RadioGroupItem
                                                value={level}
                                                id={`grade-${level}`}
                                                className="peer sr-only"
                                            />
                                            <label
                                                htmlFor={`grade-${level}`}
                                                className="peer-checked:bg-blue-500 peer-checked:text-white px-4 py-2 rounded-md border border-blue-500 text-blue-600 text-sm font-medium cursor-pointer transition-colors"
                                            >
                                                {level}
                                            </label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )}
                        />
                    </div>

                    {/* Intensity */}
                    <div>
                        <label className="font-semibold text-sm block mb-2">Intensity</label>
                        <Controller
                            control={control}
                            name="intensity"
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex flex-wrap gap-2"
                                >
                                    {intensities.map(({ label, icon }) => (
                                        <div key={label}>
                                            <RadioGroupItem
                                                value={label}
                                                id={`intensity-${label}`}
                                                className="peer sr-only"
                                            />
                                            <label
                                                htmlFor={`intensity-${label}`}
                                                className="peer-checked:bg-blue-500 peer-checked:text-white px-4 py-2 rounded-md border border-blue-500 text-blue-600 text-sm font-medium cursor-pointer transition-colors flex items-center gap-1"
                                            >
                                                <span>{icon}</span> {label}
                                            </label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )}
                        />
                    </div>

                    {/* Language */}
                    <div>
                        <label className="font-semibold text-sm block mb-2">Language</label>
                        <Controller
                            control={control}
                            name="language"
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex flex-wrap gap-2"
                                >
                                    {languages.map((lang) => (
                                        <div key={lang}>
                                            <RadioGroupItem
                                                value={lang}
                                                id={`lang-${lang}`}
                                                className="peer sr-only"
                                            />
                                            <label
                                                htmlFor={`lang-${lang}`}
                                                className="peer-checked:bg-blue-500 peer-checked:text-white px-4 py-2 rounded-md border border-blue-500 text-blue-600 text-sm font-medium cursor-pointer transition-colors"
                                            >
                                                {lang}
                                            </label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )}
                        />
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
                                    levels: [{ label: 'Excellent', score: 5, description: '' }],
                                })
                            }
                            className="text-blue-600 text-sm font-medium hover:underline hover:cursor-pointer"
                        >
                            + Add Criterion
                        </h1>
                    </div>

                    <DialogFooter className="pt-4">
                        <DialogClose>
                            <PrimaryButton type="button" color="black" variant="solid" size="md">
                                Cancel
                            </PrimaryButton>
                        </DialogClose>
                        <PrimaryButton type="submit" color="blue" variant="solid" size="md">
                            Save Changes
                        </PrimaryButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditRubric
