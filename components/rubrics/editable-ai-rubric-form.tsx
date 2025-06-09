import { useForm, useFieldArray } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PrimaryButton } from '../ui/primary-button'
import { BuildWithAIRubric } from '@/types/rubrics'
import { Button } from '@/components/ui/button' // You can use your own button component
import { Trash2Icon } from 'lucide-react'
import CrtiterionItem from './crtiterion-field'

const EditableAIRubricForm = ({
    data,
    onSubmit,
}: {
    data: BuildWithAIRubric
    onSubmit: (data: BuildWithAIRubric) => void
}) => {
    const { control, register, handleSubmit } = useForm<BuildWithAIRubric>({
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label className="font-semibold text-sm">Rubric Name</label>
                <Input {...register('name')} />
            </div>

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
                    className=" text-blue-600 text-sm font-medium hover:underline hover:cursor-pointer"
                >
                    + Add Criterion
                </h1>
            </div>

            <div className="flex justify-end">
                <PrimaryButton
                    type="submit"
                    variant="solid"
                    color="blue"
                    size="md"
                    className="mt-4"
                >
                    Save Rubric
                </PrimaryButton>
            </div>
        </form>
    )
}

export default EditableAIRubricForm
