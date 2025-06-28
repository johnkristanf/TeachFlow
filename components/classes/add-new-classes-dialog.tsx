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
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Classes } from '@/types/classes'
import { SkeletonLoader } from '../skeleton-loading'

export default function AddNewClassDialog() {
    const queryClient = useQueryClient()
    const [openDialog, setOpenDialog] = useState<boolean>(false)

    const form = useForm<Classes>({
        defaultValues: {
            name: '',
            description: '',
            studentCount: 0,
        },
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset, // Function to reset the form
    } = form

    // Define the mutation for creating a new class
    const createClassMutation = useMutation({
        mutationFn: async (newClassData: Classes) => {
            const response = await fetch('/api/classes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newClassData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to create class')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] })
            reset()
            setOpenDialog(false)
            toast.success('Class created successfully!')
        },
        onError: (error) => {
            console.error('Error creating class:', error.message)
            toast.error('Failed adding new class, please try again')
        },
    })

    const onSubmit = async (data: Classes) => {
        createClassMutation.mutate(data)
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog} >
            <DialogTrigger asChild>
                <PrimaryButton color="blue" variant="solid">
                    {' '}
                    {/* Corrected color based on design */}
                    New class
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent >
                {createClassMutation.isPending ? (
                    <SkeletonLoader msg="Creating Class..." />
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-gray-800">
                                New class
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 text-sm">
                                Fill in the details below to create a new class.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            {' '}
                            {/* Wrap content in a form */}
                            <div className="grid gap-4 ">
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
                                        className="border-gray-300 focus-visible:ring-blue-500" // Corrected focus ring color
                                        {...register('name')} // Register input with React Hook Form
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
                                        className="border-gray-300 focus-visible:ring-blue-500 min-h-[80px]" // Corrected focus ring color
                                        {...register('description')} // Register textarea with React Hook Form
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
                                        className="border-gray-300 focus-visible:ring-blue-500" // Corrected focus ring color
                                        {...register('studentCount', {
                                            valueAsNumber: true,
                                        })} // Register input, ensure value is number
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
                                    color="blue" // Corrected color to blue as per the design
                                    variant="outline" // Should be 'solid' as per the design
                                    type="submit" // This button will submit the form
                                    disabled={createClassMutation.isPending} // Disable button while submitting
                                    className='flex justify-center'
                                >
                                    {createClassMutation.isPending
                                        ? 'Creating...'
                                        : 'Create class'}
                                </PrimaryButton>

                                <PrimaryButton
                                    type="button"
                                    color="black"
                                    variant="outline"
                                    onClick={() => setOpenDialog(false)}
                                    disabled={createClassMutation.isPending}
                                    className='flex justify-center'

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
