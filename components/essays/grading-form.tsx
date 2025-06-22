'use client'

import { useEffect, useRef, useState } from 'react'
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { PrimaryButton } from '../ui/primary-button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import RubricTypeTabs from '../rubrics/rubric-type-tabs'
import { useRubricStore } from '@/store/useStoreRubric'
import { cn, convertBase64ToFile, formatFileSize } from '@/lib/utils'
import { Criteria } from '@/types/rubrics'
import { SkeletonLoader } from '../skeleton-loading'
import { FileUp, InfoIcon, RotateCw } from 'lucide-react'
import { DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

import { Classes } from '@/types/classes'
type EssayGradingFormProps = {
    onCloseDialog?: () => void
}

export function EssayGradingForm({ onCloseDialog }: EssayGradingFormProps) {
    // SELECTED RUBRIC BY STATE MANAGEMENT
    const selectedRubricCriteria = useRubricStore((state) => state.criteria)
    const selectedRubric = useRubricStore((state) => state.rubric)

    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        rubric_criteria: [] as Criteria[],
        gradingMethod: 'files',
        files: [] as File[],
        capturedImages: [] as string[], // Base64 images from webcam
        classId: null as number | null,
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
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    const stopWebcam = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
            streamRef.current = null
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null
        }

        setWebcamActive(false)
    }

    // Start webcam
    const startWebcam = async (newFacingMode?: 'user' | 'environment') => {
        stopWebcam()

        const currentFacingMode = newFacingMode || facingMode

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { min: 1280, ideal: 1920, max: 2560 },
                    height: { min: 720, ideal: 1080, max: 1440 },
                    facingMode: currentFacingMode,
                },
            })

            streamRef.current = stream
            setWebcamActive(true)
            setFacingMode(currentFacingMode) // Update state to reflect active camera
        } catch (error) {
            console.error('Error accessing webcam:', error)
            let errorMessage =
                "Unable to access your webcam. Please ensure it's connected and that you've granted permission to use it."
            if (error instanceof DOMException) {
                if (error.name === 'NotAllowedError') {
                    errorMessage =
                        'Permission to access the webcam was denied. Please allow camera access in your browser settings.'
                } else if (error.name === 'NotFoundError') {
                    errorMessage = 'No webcam found on your device.'
                } else if (error.name === 'NotReadableError') {
                    errorMessage =
                        'The webcam is already in use by another application or the browser.'
                } else if (error.name === 'OverconstrainedError') {
                    errorMessage =
                        'Your browser could not find a camera matching the requested settings (e.g., specific resolution or facing mode).'
                }
            }
            toast.warning(errorMessage)
        }
    }

    // TOGGLE CAMERA FACING
    const toggleCamera = () => {
        const newMode = facingMode === 'user' ? 'environment' : 'user'
        setFacingMode(newMode) // Update state immediately
        startWebcam(newMode) // Restart webcam with the new facing mode
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
                context.imageSmoothingEnabled = true
                context.imageSmoothingQuality = 'high'

                // Convert to base64 image
                const imageData = canvas.toDataURL('image/jpeg', 0.95)

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

    const gradeEssayMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const res = await fetch(`/api/essay`, {
                method: 'POST',
                body: data,
                credentials: 'include',
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error?.message || 'Failed to create rubric')
            }

            return res.json()
        },

        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['essays'] })
            toast.success('Essay Submitted for Evaluation!')
            if (onCloseDialog) onCloseDialog()
        },

        onError: (err) => {
            console.error('Error grading essay:', err)
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        formData.rubric_criteria = selectedRubricCriteria

        if (!selectedRubric || selectedRubric.name == '') {
            toast.warning('You must select a grading rubric')
            return
        }

        const submitData = new FormData()
        submitData.append('rubric_id', selectedRubric.id.toString())
        submitData.append('rubric_category', selectedRubric.category)
        submitData.append('grade_level', selectedRubric.grade)
        submitData.append('grade_intensity', selectedRubric.intensity)
        submitData.append('rubric_criteria', JSON.stringify(formData.rubric_criteria))
        submitData.append('class_id', formData.classId?.toString() ?? '')
        submitData.append('gradingMethod', formData.gradingMethod)

        if (formData.gradingMethod === 'files' && formData.files) {
            for (let i = 0; i < formData.files.length; i++) {
                submitData.append('files', formData.files[i])
            }
        } else if (formData.gradingMethod === 'webcam') {
            formData.capturedImages.forEach((imageData, index) => {
                const file = convertBase64ToFile(imageData, index)
                submitData.append('files', file)
            })
        }

        if (webcamActive && formData.gradingMethod == 'webcam') {
            stopWebcam()
        }

        gradeEssayMutation.mutate(submitData)
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

    // CLASSSES
    const {
        data: classes,
        isLoading: isClassesLoading,
        isError: isClassesError,
        error: classesError,
    } = useQuery<Classes[], Error>({
        queryKey: ['classes_dropdown'], // Unique key for full class data
        queryFn: async () => {
            const response = await fetch('/api/classes?component=dropdown')
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch classes with projection')
            }

            return data
        },
    })

    return (
        <div>
            {gradeEssayMutation.isPending ? (
                <SkeletonLoader msg="Submitting Essay for Evaluation..." />
            ) : (
                <>
                    <DialogHeader>
                        <DialogTitle>Start Grading</DialogTitle>
                        <DialogDescription>
                            Please select the assessment attributes to guide the automated
                            evaluation. The grading process will proceed based on the criteria you
                            define.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col space-y-3 bg-gray-100 p-3 rounded-md mt-5">
                            <div className="flex items-center gap-1">
                                <label className="text-base font-medium">Classes</label>

                                <Tooltip>
                                    <TooltipTrigger type="button">
                                        {' '}
                                        <InfoIcon className="size-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Optional. Use to organize essays.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>

                            <Select
                                value={formData.classId === null ? '' : formData.classId.toString()}
                                onValueChange={(value) => {
                                    // Update the classId in your formData state
                                    setFormData((prev) => ({
                                        ...prev,
                                        classId:
                                            value === 'skip_class' || value === ''
                                                ? null
                                                : Number(value),
                                    }))
                                }}
                            >
                                <SelectTrigger className="w-full focus-visible:ring-blue-500 focus-visible:border-blue-500">
                                    <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                                <SelectContent className="w-full focus-visible:ring-blue-500 focus-visible:border-blue-500">
                                    {isClassesLoading && (
                                        <SelectItem value="loading" disabled>
                                            Loading classes...
                                        </SelectItem>
                                    )}
                                    {isClassesError && (
                                        <SelectItem value="error" disabled className="text-red-500">
                                            Error:{' '}
                                            {classesError?.message || 'Failed to load classes'}
                                        </SelectItem>
                                    )}
                                    {!isClassesLoading && !isClassesError && (
                                        <SelectGroup>
                                            <SelectItem value={'skip_class'}>
                                                Skip selecting class
                                            </SelectItem>

                                            {classes &&
                                                classes.length > 0 &&
                                                classes.map((cls) => (
                                                    <SelectItem
                                                        key={cls.id}
                                                        value={cls.id?.toString() ?? ''}
                                                    >
                                                        {cls.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectGroup>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3 bg-gray-100 p-3 rounded-md">
                            <div className="flex items-center justify-between">
                                <label className="text-base font-medium">Rubric</label>

                                <Drawer direction="right">
                                    <DrawerTrigger asChild>
                                        <PrimaryButton
                                            type="button"
                                            variant="solid"
                                            color="blue"
                                            size="sm"
                                        >
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

                            <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                                {selectedRubricCriteria && selectedRubricCriteria.length > 0 ? (
                                    <div className="flex flex-col">
                                        <p className="text-xl font-medium mb-1">
                                            {selectedRubric.name}
                                        </p>
                                        <p className="text-xs">
                                            Category:{' '}
                                            <span className="text-blue-500 font-semibold">
                                                {' '}
                                                {selectedRubric.category}
                                            </span>
                                        </p>
                                        <p className="text-xs">
                                            Grade Level:{' '}
                                            <span className="text-blue-500 font-semibold">
                                                {' '}
                                                {selectedRubric.grade}
                                            </span>
                                        </p>

                                        <p className="text-xs">
                                            Grade Intensity:{' '}
                                            <span className="text-blue-500 font-semibold">
                                                {' '}
                                                {selectedRubric.intensity}
                                            </span>
                                        </p>
                                    </div>
                                ) : (
                                    <h1 className="text-blue-600 font-semibold">
                                        No Essay Rubric Selected
                                    </h1>
                                )}

                                {selectedRubric?.created_by ? (
                                    <div className="flex flex-col">
                                        <p className="text-sm">
                                            Created by:{' '}
                                            <span className="font-semibold text-blue-500">
                                                {selectedRubric.created_by === 'teachflow_rubrics'
                                                    ? 'TeachFlow'
                                                    : 'Me'}
                                            </span>
                                        </p>

                                        <p className="text-sm">
                                            Language:{' '}
                                            <span className="font-semibold text-blue-500">
                                                {selectedRubric.language}
                                            </span>
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm">&nbsp;</p> // renders empty line to keep layout consistent
                                )}
                            </div>
                        </div>
                        {/* Upload Method */}
                        <div className="space-y-3 bg-gray-100 p-3 rounded-md">
                            <label className="text-base font-medium">
                                Choose essay grading method <span className="text-red-500">*</span>
                            </label>

                            <RadioGroup
                                value={formData.gradingMethod}
                                onValueChange={(value) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        gradingMethod: value,
                                    }))
                                    // Stop webcam when switching away from it
                                    if (value !== 'webcam') {
                                        stopWebcam()
                                    }
                                }}
                                className="flex space-x-6 mt-3"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="files"
                                        id="files"
                                        className="border-blue-500"
                                    />
                                    <label htmlFor="files">Select files</label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="webcam"
                                        id="webcam"
                                        className="border-blue-500 "
                                    />
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
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:cursor-pointer"
                                        onClick={triggerFileInput}
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
                                                                {formData.files.length !== 1
                                                                    ? 's'
                                                                    : ''}{' '}
                                                                selected
                                                            </span>
                                                            <h1
                                                                className=" text-blue-600 hover:underline hover:cursor-pointer"
                                                                onClick={triggerFileInput}
                                                            >
                                                                <span>+</span>
                                                                <span>Add more</span>
                                                            </h1>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {formData.files.map((file, index) => {
                                                            const isImage =
                                                                file.type.startsWith('image/')
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
                                                                            onClick={() =>
                                                                                removeFile(index)
                                                                            }
                                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm hover:bg-gray-800 z-10"
                                                                        >
                                                                            ×
                                                                        </button>
                                                                        <div className="flex flex-col items-center space-y-2">
                                                                            {/* UPLOADED FILE PREVIEW */}
                                                                            <div className="w-full h-40 bg-white rounded border border-gray-300 flex items-center justify-center overflow-hidden">
                                                                                {isImage ? (
                                                                                    <img
                                                                                        src={
                                                                                            previewUrl!
                                                                                        }
                                                                                        alt={
                                                                                            file.name
                                                                                        }
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
                                                                                    title={
                                                                                        file.name
                                                                                    }
                                                                                >
                                                                                    {file.name}
                                                                                </p>
                                                                                <p className="text-xs text-gray-500">
                                                                                    {formatFileSize(
                                                                                        file.size
                                                                                    )}
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
                                                    <div className="flex flex-col justify-center items-center">
                                                        <FileUp />
                                                        <p className="text-gray-600">
                                                            Drop files here,{' '}
                                                            <button
                                                                type="button"
                                                                onClick={triggerFileInput}
                                                                className="text-blue-600 underline hover:text-blue-800"
                                                            >
                                                                browse files
                                                            </button>
                                                        </p>
                                                    </div>

                                                    {/* <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
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
                                                </div> */}
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
                                                        Start your webcam to capture essay images
                                                        continuously
                                                    </p>
                                                    <PrimaryButton
                                                        type="button"
                                                        onClick={() => startWebcam()} // Call with no args to use current facingMode
                                                        color="blue"
                                                    >
                                                        Start Webcam
                                                    </PrimaryButton>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {/* Video Display */}

                                                    <div className="flex flex-col">
                                                        <h1 className="text-center text-md font-medium text-blue-600 mb-4">
                                                            * Please capture your image in good
                                                            lighting, hold your device steady, and
                                                            ensure the text is clearly visible.
                                                        </h1>

                                                        <div
                                                            className="relative mx-auto"
                                                            style={{
                                                                maxWidth: '420px',
                                                            }}
                                                        >
                                                            <video
                                                                ref={videoRef}
                                                                autoPlay
                                                                muted
                                                                playsInline
                                                                className="w-full h-full rounded-lg border"
                                                            />
                                                            <canvas
                                                                ref={canvasRef}
                                                                className="hidden"
                                                            />

                                                            <button
                                                                type="button"
                                                                onClick={toggleCamera}
                                                                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                                title="Toggle Camera"
                                                            >
                                                                <RotateCw className="w-5 h-5" />
                                                            </button>
                                                        </div>
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
                                                    Captured Images (
                                                    {formData.capturedImages.length})
                                                </h3>
                                                <PrimaryButton
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            capturedImages: [],
                                                        }))
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
                        <div className="flex sm:justify-end">
                            <PrimaryButton
                                type="submit"
                                variant="outline"
                                color="blue"
                                size="md"
                                disabled={gradeEssayMutation.isPending}
                                className={cn(
                                    'w-full flex justify-center', // This makes the button full width by default (for all screen sizes)
                                    gradeEssayMutation.isPending
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : ''
                                )}
                            >
                                {gradeEssayMutation.isPending ? 'Submitting...' : 'Submit'}
                            </PrimaryButton>
                        </div>
                    </form>
                </>
            )}
        </div>
    )
}
