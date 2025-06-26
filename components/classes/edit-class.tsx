'use client'

import { PrimaryButton } from '../ui/primary-button' // Your custom PrimaryButton
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog' // Shadcn Dialog components
import { Input } from '@/components/ui/input' // Shadcn Input
import { Textarea } from '@/components/ui/textarea' // Shadcn Textarea

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Classes } from '@/types/classes'
import { SkeletonLoader } from '../skeleton-loading'
import { Pencil } from 'lucide-react'

interface EditClassDialogProps {
    classData: Classes // The class data to edit
}

export default function EditClassDialog({ classData }: EditClassDialogProps) {
    const queryClient = useQueryClient()
    const [openDialog, setOpenDialog] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<Classes>()

    // Populate form with existing class data when dialog opens or classData changes
    useEffect(() => {
        if (classData) {
            setValue('name', classData.name || '')
            setValue('description', classData.description || '')
            setValue('studentCount', classData.studentCount || 0)
        }
    }, [classData, setValue])

    // Define the mutation for updating the class
    const updateClassMutation = useMutation({
        mutationFn: async (updatedClassData: Classes) => {
            const response = await fetch(`/api/classes/${classData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedClassData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to update class')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] })
            setOpenDialog(false)
            toast.success('Class updated successfully!')
        },
        onError: (error) => {
            console.error('Error updating class:', error.message)
            toast.error('Failed to update class, please try again')
        },
    })

    const onSubmit = async (data: Classes) => {
        console.log('Form data submitted:', data)
        // Include the class ID in the update data
        const updatedData = {
            ...data,
            id: classData.id,
        }
        updateClassMutation.mutate(updatedData)
    }

    const handleCancel = () => {
        // Reset form to original values when canceling
        if (classData) {
            setValue('name', classData.name || '')
            setValue('description', classData.description || '')
            setValue('studentCount', classData.studentCount || 0)
        }
        setOpenDialog(false)
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Pencil className="size-4 text-blue-500 hover:cursor-pointer hover:opacity-75" />
            </DialogTrigger>
            <DialogContent>
                {updateClassMutation.isPending ? (
                    <SkeletonLoader msg="Updating Class..." />
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-gray-800">
                                Edit class
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 text-sm">
                                Update the class details below.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4">
                                {/* Class name */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="name"
                                        className="text-gray-800 text-base font-medium"
                                    >
                                        Class name <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="name"
                                        placeholder="Enter name"
                                        className="border-gray-300 focus-visible:ring-blue-500"
                                        {...register('name', {
                                            required: 'Class name is required',
                                        })}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="description"
                                        className="text-gray-800 text-base font-medium"
                                    >
                                        Description
                                    </label>
                                    <Textarea
                                        id="description"
                                        placeholder="Enter description"
                                        className="border-gray-300 focus-visible:ring-blue-500 min-h-[80px]"
                                        {...register('description')}
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>

                                {/* Number of students */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="numStudents"
                                        className="text-gray-800 text-base font-medium"
                                    >
                                        Number of students
                                    </label>
                                    <Input
                                        id="numStudents"
                                        type="number"
                                        placeholder="Enter number"
                                        className="border-gray-300 focus-visible:ring-blue-500"
                                        {...register('studentCount', {
                                            valueAsNumber: true,
                                            min: {
                                                value: 0,
                                                message: 'Number of students cannot be negative',
                                            },
                                        })}
                                    />
                                    {errors.studentCount && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.studentCount.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-4 w-full">
                                <PrimaryButton
                                    color="blue"
                                    variant="solid"
                                    type="submit"
                                    disabled={updateClassMutation.isPending}
                                    className="flex justify-center"
                                >
                                    {updateClassMutation.isPending ? 'Updating...' : 'Update class'}
                                </PrimaryButton>

                                <PrimaryButton
                                    type="button"
                                    color="black"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={updateClassMutation.isPending}
                                    className="flex justify-center"
                                >
                                    Cancel
                                </PrimaryButton>
                            </div>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
