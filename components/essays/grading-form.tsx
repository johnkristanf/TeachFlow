'use client'

import { useEffect, useRef, useState } from 'react'
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { PrimaryButton } from '../ui/primary-button'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'
import RubricTypeTabs from '../rubrics/rubric-type-tabs'
import { useRubricStore } from '@/store/useStoreRubric'
import { convertBase64ToFile, formatFileSize } from '@/lib/utils'
import { pythonServerBaseURLV1 } from '@/api/base'
import { Criterion } from '@/types/rubrics'

type EssayGradingFormProps = {
    onCloseDialog?: () => void
}

export function EssayGradingForm({ onCloseDialog }: EssayGradingFormProps) {
    // SELECTED RUBRIC BY STATE MANAGEMENT
    const selectedRubricCriteria = useRubricStore((state) => state.criteria)
    const selectedRubric = useRubricStore((state) => state.rubric)

    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        rubric_criteria: [] as Criterion[],
        gradingMethod: 'files',
        files: [] as File[],
        textContent: '',
        capturedImages: [] as string[], // Base64 images from webcam
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setFormData((prev) => ({
                ...prev,
                files: [...prev.files, ...newFiles],
            }))
        }
        // Reset the input so the same file can be selected again
        e.target.value = ''
    }

    // Remove uploaded file
    const removeFile = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            files: prev.files.filter((_, index) => index !== indexToRemove),
        }))
    }

    // Remove captured image
    const removeImage = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            capturedImages: prev.capturedImages.filter((_, index) => index !== indexToRemove),
        }))
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            textContent: e.target.value,
        }))
    }

    const handleDropFile = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()

        const droppedFiles = Array.from(e.dataTransfer.files)
        if (droppedFiles.length) {
            setFormData((prev) => ({
                ...prev,
                files: [...prev.files, ...droppedFiles],
            }))
        }
    }

    const triggerFileInput = () => {
        const fileInput = document.getElementById('hidden-file-input') as HTMLInputElement
        fileInput?.click()
    }

    // WEBCAM FUNCTIONALITIES
    const [webcamActive, setWebcamActive] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const stopWebcam = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
            streamRef.current = null
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        setWebcamActive(false)
    }

    // Start webcam
    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
            })

            streamRef.current = stream
            setWebcamActive(true)
        } catch (error) {
            console.error('Error accessing webcam:', error)
            alert('Unable to access webcam. Please check permissions.')
        }
    }

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current
            const video = videoRef.current
            const context = canvas.getContext('2d')

            if (context) {
                // Set canvas size to match video
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight

                // Draw current video frame to canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height)

                // Convert to base64 image
                const imageData = canvas.toDataURL('image/jpeg', 0.8)

                // Add to captured images
                setFormData((prev) => ({
                    ...prev,
                    capturedImages: [...prev.capturedImages, imageData],
                }))

                toast.success(
                    'Image captured successfully. See the list below for all captured images.'
                )
            }
        }
    }

    const mutation = useMutation({
        mutationFn: async (data: FormData) => {
            const res = await fetch(`/api/essay`, {
                method: 'POST',
                body: data,
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error?.message || 'Failed to create rubric')
            }

            return res.json()
        },

        onSuccess: (response) => {
            console.log('Essay graded:', response)
            queryClient.invalidateQueries({ queryKey: ['essays'] })
            toast.success('Essay Submitted for Evaluation!')

            setTimeout(() => {
                if (onCloseDialog) onCloseDialog()
            }, 1500)
        },

        onError: (err) => {
            console.error('Error grading essay:', err)
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        formData.rubric_criteria = selectedRubricCriteria

        if (selectedRubric.name == '') {
            toast.warning('You must select a grading rubric')
            return
        }

        console.log('formData.rubric_criteria: ', formData.rubric_criteria)

        const submitData = new FormData()
        submitData.append('rubric_name', selectedRubric.name)
        submitData.append('rubric_criteria', JSON.stringify(formData.rubric_criteria))
        submitData.append('gradingMethod', formData.gradingMethod)

        if (formData.gradingMethod === 'files' && formData.files) {
            // Append each uploaded files
            for (let i = 0; i < formData.files.length; i++) {
                submitData.append('files', formData.files[i])
            }
        } else if (formData.gradingMethod === 'text') {
            submitData.append('textContent', formData.textContent)
        } else if (formData.gradingMethod === 'webcam') {
            // Convert base64 images to files
            formData.capturedImages.forEach((imageData, index) => {
                const file = convertBase64ToFile(imageData, index)
                submitData.append('files', file)
            })
        }

        console.log('Submit Data:', Array.from(submitData.entries()))

        // Handle form submission here
        mutation.mutate(submitData)
    }

    // Effect to assign stream to video element when webcam becomes active
    useEffect(() => {
        if (webcamActive && streamRef.current && videoRef.current) {
            videoRef.current.srcObject = streamRef.current
        }
    }, [webcamActive])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopWebcam()
        }
    }, [])

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3 bg-gray-100 p-3 rounded-md">
                <div className="flex items-center justify-between">
                    <label className="text-base font-medium">Rubric</label>

                    <Drawer direction="right">
                        <DrawerTrigger asChild>
                            <PrimaryButton type="button" variant="solid" color="blue" size="sm">
                                Select Essay Rubric
                            </PrimaryButton>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Select Rubric</DrawerTitle>
                            </DrawerHeader>

                            {/* TABS */}
                            <RubricTypeTabs />
                        </DrawerContent>
                    </Drawer>
                </div>

                <div className="flex justify-between p-4 bg-white rounded-lg">
                    {selectedRubricCriteria && selectedRubricCriteria.length > 0 ? (
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                📄
                            </div>
                            <p className="font-medium">{selectedRubric.name}</p>
                        </div>
                    ) : (
                        <h1 className="text-blue-600 font-semibold">No Essay Rubric Selected</h1>
                    )}

                    {selectedRubric?.created_by ? (
                        <p className="text-sm">
                            Created by{' '}
                            <span className="font-semibold">
                                {selectedRubric.created_by === 'teachflow_rubrics'
                                    ? 'TeachFlow'
                                    : 'Me'}
                            </span>
                        </p>
                    ) : (
                        <p className="text-sm">&nbsp;</p> // renders empty line to keep layout consistent
                    )}
                </div>
            </div>

            {/* Upload Method */}

            <div className="space-y-3 bg-gray-100 p-3 rounded-md">
                <label className="text-base font-medium">
                    Upload essay(s) <span className="text-red-500">*</span>
                </label>

                <RadioGroup
                    value={formData.gradingMethod}
                    onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, gradingMethod: value }))
                        // Stop webcam when switching away from it
                        if (value !== 'webcam') {
                            stopWebcam()
                        }
                    }}
                    className="flex space-x-6"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="files" id="files" />
                        <label htmlFor="files">Select files</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="text" id="text" />
                        <label htmlFor="text">Enter text</label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="webcam" id="webcam" />
                        <label htmlFor="webcam">Webcam</label>
                    </div>
                </RadioGroup>

                {/* File Upload Area */}
                {formData.gradingMethod === 'files' && (
                    <div className="space-y-4">
                        {/* Upload Drop Zone - Show when no files or allow adding more */}
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDropFile}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
                        >
                            <div className="space-y-4">
                                {/* Selected Files Display */}
                                {formData.files.length > 0 ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <PrimaryButton
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            files: [],
                                                        }))
                                                    }
                                                >
                                                    Cancel
                                                </PrimaryButton>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm text-gray-600">
                                                    {formData.files.length} file
                                                    {formData.files.length !== 1 ? 's' : ''}{' '}
                                                    selected
                                                </span>
                                                <h1
                                                    className=" text-blue-600"
                                                    onClick={triggerFileInput}
                                                >
                                                    <span>+</span>
                                                    <span>Add more</span>
                                                </h1>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {formData.files.map((file, index) => {
                                                const isImage = file.type.startsWith('image/')
                                                const previewUrl = isImage
                                                    ? URL.createObjectURL(file)
                                                    : null

                                                return (
                                                    <div
                                                        key={`${file.name}-${index}`}
                                                        className="relative"
                                                    >
                                                        <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(index)}
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm hover:bg-gray-800 z-10"
                                                            >
                                                                ×
                                                            </button>
                                                            <div className="flex flex-col items-center space-y-2">
                                                                <div className="w-full h-40 bg-white rounded border border-gray-300 flex items-center justify-center overflow-hidden">
                                                                    {isImage ? (
                                                                        <img
                                                                            src={previewUrl!}
                                                                            alt={file.name}
                                                                            className="object-contain w-full h-full"
                                                                            onLoad={() =>
                                                                                URL.revokeObjectURL(
                                                                                    previewUrl!
                                                                                )
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <div className="w-8 h-10 bg-gray-200 rounded flex items-center justify-center text-2xl">
                                                                            📄
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="text-center mt-2">
                                                                    <p
                                                                        className="text-sm font-medium text-gray-900 truncate max-w-[150px]"
                                                                        title={file.name}
                                                                    >
                                                                        {file.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {formatFileSize(file.size)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-gray-600">
                                            Drop files here,{' '}
                                            <button
                                                type="button"
                                                onClick={triggerFileInput}
                                                className="text-blue-600 underline hover:text-blue-800"
                                            >
                                                browse files
                                            </button>{' '}
                                            or import from:
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                            <div
                                                className="flex flex-col items-center space-y-1 cursor-pointer hover:opacity-75"
                                                onClick={triggerFileInput}
                                            >
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    💻
                                                </div>
                                                <span className="text-xs text-gray-600">
                                                    My Device
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-center space-y-1 cursor-pointer hover:opacity-75">
                                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                    🔺
                                                </div>
                                                <span className="text-xs text-gray-600">
                                                    Google Drive
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Hidden file input */}
                                <input
                                    id="hidden-file-input"
                                    type="file"
                                    multiple
                                    accept="image/*" // temporarily only accept image, upgrade later for scalability
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Text Input Area */}
                {formData.gradingMethod === 'text' && (
                    <div className="flex flex-col gap-2 mt-5">
                        <label htmlFor="essayText">Paste your essay text here:</label>
                        <textarea
                            id="essayText"
                            value={formData.textContent}
                            onChange={handleTextChange}
                            className="w-full h-32 p-3 border border-gray-300 rounded-md resize-vertical"
                            placeholder="Paste your essay content here..."
                        />
                    </div>
                )}

                {/* Webcam Area */}
                {formData.gradingMethod === 'webcam' && (
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                            <div className="text-center space-y-4">
                                {!webcamActive ? (
                                    <div>
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                            📷
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            Start your webcam to capture essay images continuously
                                        </p>
                                        <PrimaryButton
                                            type="button"
                                            onClick={startWebcam}
                                            color="blue"
                                        >
                                            Start Webcam
                                        </PrimaryButton>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Video Display */}
                                        <div
                                            className="relative mx-auto"
                                            style={{ maxWidth: '640px' }}
                                        >
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                muted
                                                playsInline
                                                className="w-full rounded-lg border"
                                            />
                                            <canvas ref={canvasRef} className="hidden" />
                                        </div>

                                        {/* Controls */}
                                        <div className="flex justify-center space-x-4">
                                            <PrimaryButton
                                                type="button"
                                                onClick={captureImage}
                                                color="blue"
                                            >
                                                📸 Capture Now
                                            </PrimaryButton>

                                            <PrimaryButton
                                                type="button"
                                                onClick={stopWebcam}
                                                variant="outline"
                                            >
                                                Stop Webcam
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Captured Images Display */}
                        {formData.capturedImages.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">
                                        Captured Images ({formData.capturedImages.length})
                                    </h3>
                                    <PrimaryButton
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({ ...prev, capturedImages: [] }))
                                        }
                                        variant="outline"
                                        color="red"
                                    >
                                        Clear All
                                    </PrimaryButton>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {formData.capturedImages.map((imageData, index) => (
                                        <div key={index} className="relative">
                                            <div className="bg-gray-100 rounded-lg p-2 border border-gray-200">
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 z-10"
                                                >
                                                    ×
                                                </button>
                                                <img
                                                    src={imageData}
                                                    alt={`Captured ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded"
                                                />
                                                <p className="text-xs text-gray-500 text-center mt-1">
                                                    Image {index + 1}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <PrimaryButton
                    type="submit"
                    variant="solid"
                    color="blue"
                    size="md"
                    disabled={mutation.isPending}
                    className={
                        mutation.isPending ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : ''
                    }
                >
                    {mutation.isPending ? 'Submitting...' : 'Submit'}
                </PrimaryButton>
            </div>
        </form>
    )
}
