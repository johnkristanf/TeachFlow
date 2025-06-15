'use client'

import { useForm } from 'react-hook-form'
import { Star } from 'lucide-react'
import clsx from 'clsx'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

type FeedbackData = {
    rating: number
    liked: string
    bugs: string
    confusing?: string
    suggestions: string
    contact?: string
    easeOfUse: number
    wouldUseAgain: string
    willingToPay: string
    performance: 'fast' | 'acceptable' | 'slow'
}

export default function FeedbackForm() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm<FeedbackData>()

    const rating = watch('rating', 0)

    // React Query mutation to send feedback data to API
    const mutation = useMutation({
        mutationFn: async (data: FeedbackData) => {
            const res = await fetch('/api/feedback', {
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

        onSuccess: () => {
            toast.success('Feedback submitted successfully!')
            reset()
        },
        onError: (error) => {
            console.error('Error in submitting feedback: ', error)
            toast.error('Failed to submit feedback. Please try again.')
        },
    })

    const onSubmit = (data: FeedbackData) => {
        mutation.mutate(data)
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full mx-auto p-6 border-l-4 border-blue-400 border rounded-lg space-y-6"
        >
            <div className="flex flex-col">
                <h1 className="text-4xl font-bold text-blue-600">Feedback Form</h1>

                <p className="text-gray-400 text-sm">
                    - We genuinely value your honest feedback — the more real, the better.{' '}
                    <br />- Don’t hesitate to be critical if something isn’t working well.{' '}
                    <br />
                </p>
            </div>

            {/* Ease of Use */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    How easy was it to navigate and use the system? (1 = very hard, 5 =
                    very easy)
                </label>
                <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                        <label key={val} className="flex items-center space-x-1 text-sm">
                            <input
                                type="radio"
                                value={val}
                                {...register('easeOfUse', { required: true })}
                            />
                            <span>{val}</span>
                        </label>
                    ))}
                </div>
                {errors.easeOfUse && (
                    <p className="text-red-600 text-sm">Please select a value</p>
                )}
            </div>

            {/* Performance */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Did the system feel fast and responsive?
                </label>
                <div className="space-y-1 text-sm">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            value="fast"
                            {...register('performance', { required: true })}
                        />
                        <span>Yes, very fast</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            value="acceptable"
                            {...register('performance')}
                        />
                        <span>Acceptable</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" value="slow" {...register('performance')} />
                        <span>Slow or laggy</span>
                    </label>
                </div>
                {errors.performance && (
                    <p className="text-red-600 text-sm">Please choose one</p>
                )}
            </div>

            {/* Liked Features */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    What did you like most about the system?
                </label>
                <textarea
                    {...register('liked', { required: true })}
                    rows={3}
                    placeholder="E.g., Accurate grading and easy rubric setup."
                    className="w-full p-2 rounded-md border border-blue-200 bg-white"
                />
                {errors.liked && (
                    <p className="text-red-600 text-sm">This field is required</p>
                )}
            </div>

            {/* Bugs */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Did you encounter any bugs or issues?
                </label>
                <textarea
                    {...register('bugs')}
                    rows={3}
                    placeholder="Optional"
                    className="w-full p-2 rounded-md border border-blue-200 bg-white"
                />
            </div>

            {/* Confusing Parts */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Was anything confusing or unclear?
                </label>
                <textarea
                    {...register('confusing')}
                    rows={3}
                    placeholder="E.g., Rubric criteria or grading steps."
                    className="w-full p-2 rounded-md border border-blue-200 bg-white"
                />
            </div>

            {/* Suggestions */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Any missing features? Share your ideas!
                </label>
                <textarea
                    {...register('suggestions')}
                    rows={3}
                    placeholder="E.g., Upload images or record webcam for essays."
                    className="w-full p-2 rounded-md border border-blue-200 bg-white"
                />
            </div>

            {/* Contact */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Your email (optional)
                </label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    {...register('contact')}
                    className="w-full p-2 rounded-md border border-blue-200 bg-white"
                />
            </div>

            {/* Would Use Again */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Would you use this product again?
                </label>
                <div className="space-y-1 text-sm">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            value="yes"
                            {...register('wouldUseAgain', { required: true })}
                        />
                        <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            value="maybe"
                            {...register('wouldUseAgain')}
                        />
                        <span>Maybe</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" value="no" {...register('wouldUseAgain')} />
                        <span>No</span>
                    </label>
                </div>
                {errors.wouldUseAgain && (
                    <p className="text-red-600 text-sm">Please choose one</p>
                )}
            </div>

            {/* Willingness to Pay */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Would you be willing to pay for this product?
                </label>
                <div className="space-y-1 text-sm">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            value="yes"
                            {...register('willingToPay', { required: true })}
                        />
                        <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" value="maybe" {...register('willingToPay')} />
                        <span>Maybe (Depends on the pricing)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" value="no" {...register('willingToPay')} />
                        <span>No</span>
                    </label>
                </div>
                {errors.willingToPay && (
                    <p className="text-red-600 text-sm">Please choose one</p>
                )}
            </div>

            {/* Overall Experience Rating */}
            <div className="flex flex-col items-center">
                <label className="block text-sm font-medium mb-1">
                    Overall Experience
                </label>
                <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setValue('rating', value)}
                            className={clsx(
                                'p-1',
                                rating >= value ? 'text-yellow-400' : 'text-blue-300'
                            )}
                        >
                            <Star
                                className="w-6 h-6"
                                fill={rating >= value ? 'currentColor' : 'none'}
                            />
                        </button>
                    ))}
                </div>
                {errors.rating && (
                    <p className="text-red-600 text-sm">Rating is required</p>
                )}
                <input type="hidden" {...register('rating', { required: true })} />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium disabled:opacity-50"
            >
                {mutation.isPending ? 'Submitting...' : 'Submit Feedback'}
            </button>
        </form>
    )
}
