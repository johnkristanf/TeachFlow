import { useForm, useFieldArray } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PrimaryButton } from '../ui/primary-button'
import CrtiterionItem from './crtiterion-field'
import { Rubric } from '@/types/rubrics'
import { DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

const EditableAIRubricForm = ({
    data,
    onSubmit,
}: {
    data: Rubric
    onSubmit: (data: Rubric) => void
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
        <>
            <DialogHeader>
                <DialogTitle>Rubric Settings</DialogTitle>
                <DialogDescription>
                    Set the grading options for AI rubric building basis.
                </DialogDescription>
            </DialogHeader>

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
                        variant="outline"
                        color="blue"
                        size="md"
                        className="mt-4"
                    >
                        Save Rubric
                    </PrimaryButton>
                </div>
            </form>
        </>
    )
}

export default EditableAIRubricForm
