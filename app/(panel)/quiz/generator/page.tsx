'use client'

import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QuizGeneratorData } from '@/types/quiz'
import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { handleDownloadQuizToDocx } from '@/lib/utils'

export default function QuizGeneratorPage() {
    const [quizResponse, setQuizResponse] = useState<any[] | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<QuizGeneratorData>({
        defaultValues: {
            multiple_choice: 0,
            fill_in_blank: 0,
            true_or_false: 0,
        },
    })

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await fetch('/api/quiz', {
                method: 'POST',
                body: formData,
            })
            if (!res.ok) {
                const error = await res.json()
                throw new Error(error?.message || 'Failed to submit feedback')
            }

            return res.json()
        },

        onSuccess: (response) => {
            const parsed = typeof response === 'string' ? JSON.parse(response) : response
            const quizArray = Array.isArray(parsed) ? parsed : [parsed]

            setQuizResponse(quizArray)

            console.log('Generate quiz response: ', response)
            toast.success('Quiz Generated Successfully!')
            reset()
        },
        onError: (error) => {
            console.error('Error in generating quiz: ', error)
            toast.error('Failed to generate quiz. Please try again.')
        },
    })

    const onSubmit = (data: QuizGeneratorData) => {
        console.log('quiz generator data: ', data)

        if (data.sourceFile.length <= 0) {
            toast.warning('You must upload question source file.')
            return
        }

        const formData = new FormData()
        formData.append('multiple_choice', data.multiple_choice.toString())
        formData.append('fill_in_blank', data.fill_in_blank.toString())
        formData.append('true_or_false', data.true_or_false.toString())
        if (data.sourceFile?.[0]) {
            formData.append('source_file', data.sourceFile[0])
        }

        mutation.mutate(formData)
    }

    return (
        <>
            {!quizResponse ? (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full mx-auto p-6 border-l-4 border-blue-400 border rounded-lg space-y-6"
                >
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-blue-600">Quiz Generator</h1>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            To generate your quiz automatically, please upload a source file
                            containing your learning material. Accepted formats are{' '}
                            <strong>.pdf</strong> and <strong>.docx</strong>.
                            <br />
                            Then, specify how many questions you'd like for each type:
                            <strong> Multiple Choice</strong>, <strong>Fill-in-the-Blank</strong>,
                            and <strong>True or False</strong>.
                            <br />
                            Once submitted, the system will analyze your uploaded content and
                            generate questions accordingly.
                        </p>
                    </div>

                    {/* Multiple Choice */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Multiple Choice Questions
                        </label>
                        <input
                            type="number"
                            step={1}
                            min={0}
                            {...register('multiple_choice', {
                                required: 'Please enter a number (use 0 if none)',
                                min: {
                                    value: 0,
                                    message: 'Value cannot be negative',
                                },
                                valueAsNumber: true,
                            })}
                            className="w-full p-2 rounded-md border border-blue-200"
                            placeholder="e.g., 5"
                        />
                        {errors.multiple_choice && (
                            <p className="text-red-600 text-sm">{errors.multiple_choice.message}</p>
                        )}
                    </div>

                    {/* Fill in the Blank */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Fill-in-the-Blank Questions
                        </label>
                        <input
                            type="number"
                            step={1}
                            min={0}
                            {...register('fill_in_blank', {
                                required: 'Please enter a number (use 0 if none)',
                                min: {
                                    value: 0,
                                    message: 'Value cannot be negative',
                                },
                                valueAsNumber: true,
                            })}
                            className="w-full p-2 rounded-md border border-blue-200"
                            placeholder="e.g., 3"
                        />
                        {errors.fill_in_blank && (
                            <p className="text-red-600 text-sm">{errors.fill_in_blank.message}</p>
                        )}
                    </div>

                    {/* True or False */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            True or False Questions
                        </label>
                        <input
                            type="number"
                            step={1}
                            min={0}
                            {...register('true_or_false', {
                                required: 'Please enter a number (use 0 if none)',
                                min: {
                                    value: 0,
                                    message: 'Value cannot be negative',
                                },
                                valueAsNumber: true,
                            })}
                            className="w-full p-2 rounded-md border border-blue-200"
                            placeholder="e.g., 3"
                        />

                        {errors.true_or_false && (
                            <p className="text-red-600 text-sm">{errors.true_or_false.message}</p>
                        )}
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Upload Source File (.pdf or .docx)
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.docx"
                            {...register('sourceFile')}
                            className="w-full p-2 rounded-md border border-blue-200 bg-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white py-2 rounded-md font-medium disabled:opacity-50"
                    >
                        {mutation.isPending ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            ) : (
                <div className="w-full mx-auto p-6 border-l-4 border-blue-500 border rounded-lg space-y-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-blue-600">Quiz Generated</h1>
                        <p className="text-sm text-gray-600">
                            Below are multiple quiz sets generated from your material. You may
                            choose the set that best fits your needs.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 overflow-y-auto py-4">
                        {quizResponse.map((set, idx) => (
                            <div
                                key={idx}
                                className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6 space-y-4 flex-shrink-0"
                            >
                                <div className="flex justify-between">
                                    <h3 className="text-lg font-semibold text-blue-700">
                                        Set {idx + 1}
                                    </h3>

                                    <FileDown
                                        onClick={() => handleDownloadQuizToDocx(set, idx)}
                                        className="hover:text-blue-600 cursor-pointer"
                                    />
                                </div>

                                <div>
                                    {/* MCQ */}
                                    {set.multiple_choice?.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-blue-600 mb-2">
                                                Multiple Choice
                                            </h4>
                                            <ul className="list-disc pl-6 space-y-2">
                                                {set.multiple_choice.map((q: any, i: number) => (
                                                    <li key={i}>
                                                        <p>
                                                            <strong>Q{i + 1}:</strong> {q.question}
                                                        </p>
                                                        <ul className="pl-4 list-decimal">
                                                            {q.choices.map(
                                                                (choice: string, j: number) => (
                                                                    <li key={j}>{choice}</li>
                                                                )
                                                            )}
                                                        </ul>
                                                        <p className="text-green-600">
                                                            Answer: {q.answer}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Fill in the Blank */}
                                    {set.fill_in_blank?.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-blue-600 my-2">
                                                Fill in the Blank
                                            </h4>
                                            <ul className="list-disc pl-6 space-y-2">
                                                {set.fill_in_blank.map((q: any, i: number) => (
                                                    <li key={i}>
                                                        <p>
                                                            <strong>Q{i + 1}:</strong> {q.question}
                                                        </p>
                                                        <p className="text-green-600">
                                                            Answer: {q.answer}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* True or False */}
                                    {set.true_or_false?.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-blue-600 my-2">
                                                True or False
                                            </h4>
                                            <ul className="list-disc pl-6 space-y-2">
                                                {set.true_or_false.map((q: any, i: number) => (
                                                    <li key={i}>
                                                        <p>
                                                            <strong>Q{i + 1}:</strong> {q.question}
                                                        </p>
                                                        <p className="text-green-600">
                                                            Answer: {q.answer ? 'True' : 'False'}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => setQuizResponse(null)}
                    >
                        Generate Another Quiz
                    </button>
                </div>
            )}
        </>
    )
}
