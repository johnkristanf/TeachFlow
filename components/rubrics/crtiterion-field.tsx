import { Trash2Icon } from 'lucide-react'
import { useFieldArray } from 'react-hook-form'

const CrtiterionItem = ({ control, register, index, remove }: any) => {
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
                <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500"
                >
                    <Trash2Icon size={18} />
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
                            <Trash2Icon size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() =>
                        append({
                            label: 'Excellent',
                            score: 5,
                            description: '',
                        })
                    }
                    className="text-sm text-blue-600 font-medium mt-2 hover:underline hover:cursor-pointer"
                >
                    + Add Level
                </button>
            </div>
        </div>
    )
}

export default CrtiterionItem
