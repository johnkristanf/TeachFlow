'use client'

import { useEffect, useRef, useState } from 'react'
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { PrimaryButton } from '../ui/primary-button'
import { useQuery } from '@tanstack/react-query'

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

export function EssayGradingForm() {
    const [formData, setFormData] = useState({
        rubric: 'sample-highschool-expository',
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

    // Remove uplaoded file
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

    const triggerFileInput = () => {
        const fileInput = document.getElementById('hidden-file-input') as HTMLInputElement
        fileInput?.click()
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const submitData = new FormData()
        submitData.append('rubric', formData.rubric)
        submitData.append('gradingMethod', formData.gradingMethod)

        if (formData.gradingMethod === 'files' && formData.files) {
            for (let i = 0; i < formData.files.length; i++) {
                submitData.append('files', formData.files[i])
            }
        } else if (formData.gradingMethod === 'text') {
            submitData.append('textContent', formData.textContent)
        } else if (formData.gradingMethod === 'webcam') {
            // Convert base64 images to files
            formData.capturedImages.forEach((imageData, index) => {
                // Convert base64 to blob
                const byteCharacters = atob(imageData.split(',')[1])
                const byteNumbers = new Array(byteCharacters.length)
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i)
                }
                const byteArray = new Uint8Array(byteNumbers)
                const blob = new Blob([byteArray], { type: 'image/jpeg' })
                const file = new File([blob], `captured-image-${index + 1}.jpg`, {
                    type: 'image/jpeg',
                })

                submitData.append('capturedImages', file)
            })
        }

        console.log('Form Data:', formData)
        console.log('Submit Data:', Array.from(submitData.entries()))

        // Handle form submission here
        // You can send this data to your API endpoint
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopWebcam()
        }
    }, [])

    // Effect to assign stream to video element when webcam becomes active
    useEffect(() => {
        if (webcamActive && streamRef.current && videoRef.current) {
            videoRef.current.srcObject = streamRef.current
        }
    }, [webcamActive])

    const {
        data: rubrics,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['rubrics'],
        queryFn: async () => {
            const res = await fetch('/api/rubrics')
            if (!res.ok) throw new Error('Failed to fetch rubrics')
            return res.json()
        },
    })

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3 bg-gray-100 p-3 rounded-md">
                <div className="flex items-center justify-between">
                    <label className="text-base font-medium">Rubric</label>

                    <Drawer direction='right'>
                        <DrawerTrigger asChild >
                            <PrimaryButton type="button" variant="solid" color="blue" size="sm">
                                Choose a different rubric
                            </PrimaryButton>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                                <DrawerDescription>This action cannot be undone.</DrawerDescription>
                            </DrawerHeader>
                        </DrawerContent>
                    </Drawer>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        📄
                    </div>
                    <div>
                        <p className="font-medium">Sample Highschool Expository Rubric</p>
                    </div>
                </div>
            </div>

            {/* Upload Method */}

            <div className="space-y-3">
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
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
                                            {formData.files.map((file, index) => (
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
                                                            <div className="w-12 h-16 bg-white rounded border border-gray-300 flex items-center justify-center">
                                                                <div className="w-8 h-10 bg-gray-200 rounded flex items-center justify-center">
                                                                    📄
                                                                </div>
                                                            </div>
                                                            <div className="text-center">
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
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-gray-600 mb-3">
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
                                    accept=".pdf,.doc,.docx,.txt"
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
                <PrimaryButton type="submit" variant="solid" color="blue" size="md">
                    Submit
                </PrimaryButton>
            </div>
        </form>
    )
}
