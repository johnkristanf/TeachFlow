'use client'

import {
    assessmentFocusOptions,
    availableResources,
    gradeLevels,
    studentProfiles,
    teacherExperienceOptions,
    teachingPhilosophies,
} from '@/constants/dlp'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function PPTGenerationPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            subject: '', // Changed to empty string for text input
            gradeLevel: '', // Changed to empty string for text input
            topic: '',
            learningCompetency: '',
            timeAllotment: 60,
            teachingPhilosophy: '4As',
            studentProfile: [],
            availableResources: [],
            assessmentFocus: 'Formative',
            valuesIntegration: '',
            teacherExperience: 'new',
            specificFormat: '',
        },
    })

    const [otherResource, setOtherResource] = useState<string>('')

    const onSubmit = (data) => {
        const updatedResources = [...data.availableResources]

        if (otherResource.trim() !== '') {
            updatedResources.push(otherResource.trim())
        }

        const finalData = {
            ...data,
            availableResources: updatedResources,
        }

        console.log('DLP Form Data:', finalData)
        alert('DLP data submitted! Check console for details.')
    }

    const FieldError = ({ message }: { message: string | undefined }) => (
        <p className="mt-1 text-sm text-red-400">{message}</p>
    )

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 rounded-md">
            <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg p-8 max-w-3xl w-full">
                <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
                    Daily Lesson Plan (DLP) Generator
                </h2>

                {/* Section: Basic Lesson Details */}
                <div className="mb-6 border-b pb-4 border-blue-200">
                    <h3 className="text-xl font-semibold text-blue-700 mb-4">
                        I. Basic Lesson Details
                    </h3>

                    <div className="mb-4">
                        <label
                            htmlFor="subject"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Subject/Learning Area:
                        </label>
                        <input
                            type="text"
                            id="subject"
                            {...register('subject', { required: 'Subject is required' })}
                            className="shadow appearance-none border border-blue-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Science, Filipino, English"
                        />
                        {errors.subject && <FieldError message={errors.subject.message} />}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="gradeLevel"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Grade Level:
                        </label>
                        <select
                            id="gradeLevel"
                            {...register('gradeLevel', { required: 'Grade Level is required' })}
                            className="shadow border border-blue-300 rounded w-full py-2 pl-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select a grade level
                            </option>
                            {gradeLevels.map((level) => (
                                <option key={level.value} value={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </select>
                        {errors.gradeLevel && <FieldError message={errors.gradeLevel.message} />}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="topic"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Specific Topic/Content:
                        </label>
                        <input
                            type="text"
                            id="topic"
                            {...register('topic', { required: 'Topic is required' })}
                            className="shadow appearance-none border border-blue-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Photosynthesis, Solving Quadratic Equations"
                        />
                        {errors.topic && <FieldError message={errors.topic.message} />}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="learningCompetency"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Learning Competency (DepEd Code or Statement):
                        </label>
                        <textarea
                            id="learningCompetency"
                            {...register('learningCompetency', {
                                required: 'Learning Competency is required',
                            })}
                            rows={3}
                            className="shadow appearance-none border border-blue-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., M5NS-IIc-68: Adds and subtracts fractions and mixed fractions..."
                        ></textarea>
                        {errors.learningCompetency && (
                            <FieldError message={errors.learningCompetency.message} />
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="timeAllotment"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Time Allotment (in minutes):
                        </label>
                        <input
                            type="number"
                            id="timeAllotment"
                            {...register('timeAllotment', {
                                required: 'Time allotment is required',
                                min: 10,
                            })}
                            className="shadow appearance-none border border-blue-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="10"
                        />
                        {errors.timeAllotment && (
                            <FieldError message={errors.timeAllotment.message} />
                        )}
                    </div>
                </div>

                {/* Section: Pedagogical Approach & Differentiation */}
                <div className="mb-6 border-b pb-4 border-blue-200">
                    <h3 className="text-xl font-semibold text-blue-700 mb-4">
                        II. Pedagogical Approach & Differentiation
                    </h3>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Desired Teaching Philosophy/Approach:
                        </label>
                        {teachingPhilosophies.map((philosophy) => (
                            <div key={philosophy.value} className="mb-2">
                                <input
                                    type="radio"
                                    id={`philosophy-${philosophy.value}`}
                                    value={philosophy.value}
                                    {...register('teachingPhilosophy', {
                                        required: 'Please select a teaching philosophy',
                                    })}
                                    className="mr-2 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={`philosophy-${philosophy.value}`}
                                    className="text-gray-700 text-sm"
                                >
                                    {philosophy.label}
                                </label>
                            </div>
                        ))}
                        {errors.teachingPhilosophy && (
                            <FieldError message={errors.teachingPhilosophy.message} />
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Student Profile/Characteristics (Select all that apply):
                        </label>
                        {studentProfiles.map((profile) => (
                            <div key={profile.value} className="mb-2">
                                <input
                                    type="checkbox"
                                    id={`profile-${profile.value}`}
                                    value={profile.value}
                                    {...register('studentProfile')}
                                    className="mr-2 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={`profile-${profile.value}`}
                                    className="text-gray-700 text-sm"
                                >
                                    {profile.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section: Resources & Environment */}
                <div className="mb-6 border-b pb-4 border-blue-200">
                    <h3 className="text-xl font-semibold text-blue-700 mb-4">
                        III. Resources & Environment
                    </h3>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Available Resources/Technology (Select all that apply):
                        </label>
                        {availableResources.map((resource) => (
                            <div key={resource.value} className="mb-2">
                                <input
                                    type="checkbox"
                                    id={`resource-${resource.value}`}
                                    value={resource.value}
                                    {...register('availableResources')}
                                    className="mr-2 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={`resource-${resource.value}`}
                                    className="text-gray-700 text-sm"
                                >
                                    {resource.label}
                                </label>
                            </div>
                        ))}
                        <div className="mt-2">
                            <label
                                htmlFor="availableResources"
                                className="block text-gray-700 text-sm font-bold mb-2"
                            >
                                Other Resources (optional):
                            </label>
                            <input
                                type="text"
                                id="otherResource"
                                value={otherResource}
                                onChange={(e) => setOtherResource(e.target.value)}
                                className="shadow appearance-none border border-blue-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Community guest speaker, Local museum access"
                            />
                        </div>
                    </div>
                </div>

                {/* Section: Assessment & Integration */}
                <div className="mb-6 border-b pb-4 border-blue-200">
                    <h3 className="text-xl font-semibold text-blue-700 mb-4">
                        IV. Assessment & Integration
                    </h3>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Primary Assessment Focus:
                        </label>
                        {assessmentFocusOptions.map((option) => (
                            <div key={option.value} className="mb-2">
                                <input
                                    type="radio"
                                    id={`assessment-${option.value}`}
                                    value={option.value}
                                    {...register('assessmentFocus', {
                                        required: 'Please select an assessment focus',
                                    })}
                                    className="mr-2 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={`assessment-${option.value}`}
                                    className="text-gray-700 text-sm"
                                >
                                    {option.label}
                                </label>
                            </div>
                        ))}
                        {errors.assessmentFocus && (
                            <FieldError message={errors.assessmentFocus.message} />
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="valuesIntegration"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Values Integration / Interdisciplinary Links (optional):
                        </label>
                        <textarea
                            id="valuesIntegration"
                            {...register('valuesIntegration')}
                            rows={2}
                            className="shadow appearance-none border border-blue-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Promote critical thinking; Connect to historical events"
                        ></textarea>
                    </div>
                </div>

                {/* Section: Output Customization */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-blue-700 mb-4">
                        V. Output Customization
                    </h3>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Teacher's Experience Level:
                        </label>
                        {teacherExperienceOptions.map((option) => (
                            <div key={option.value} className="mb-2">
                                <input
                                    type="radio"
                                    id={`experience-${option.value}`}
                                    value={option.value}
                                    {...register('teacherExperience', {
                                        required: 'Please select teacher experience level',
                                    })}
                                    className="mr-2 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={`experience-${option.value}`}
                                    className="text-gray-700 text-sm"
                                >
                                    {option.label}
                                </label>
                            </div>
                        ))}
                        {errors.teacherExperience && (
                            <FieldError message={errors.teacherExperience.message} />
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="specificFormat"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Specific Format/Section Requirements (optional):
                        </label>
                        <textarea
                            id="specificFormat"
                            {...register('specificFormat')}
                            rows={3}
                            className="shadow appearance-none border border-blue-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 'Ensure the following sections are present: I. Objectives, II. Content, III. Learning Resources...'"
                        ></textarea>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-center">
                    <button
                        type="submit"
                        className="w-full   bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline "
                    >
                        Generate
                    </button>
                </div>
            </form>
        </div>
    )
}
