'use client'

import { PrimaryButton } from '../ui/primary-button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { AlertTriangle, Trash2 } from 'lucide-react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { Classes } from '@/types/classes'
import { SkeletonLoader } from '../skeleton-loading'

interface DeleteClassDialogProps {
    classData: Classes
}

export default function DeleteClassDialog({ classData }: DeleteClassDialogProps) {
    const queryClient = useQueryClient()
    const [openDialog, setOpenDialog] = useState<boolean>(false)

    // Define the mutation for deleting the class
    const deleteClassMutation = useMutation({
        mutationFn: async (classId: number | undefined) => {
            const response = await fetch(`/api/classes/${classId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to delete class')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] })
            setOpenDialog(false)
            toast.success('Class deleted successfully!')
        },
        onError: (error: Error) => {
            console.error('Error deleting class:', error.message)
            toast.error(error.message || 'Failed to delete class, please try again')
        },
    })

    const handleDelete = () => {
        deleteClassMutation.mutate(classData.id)
    }

    const handleCancel = () => {
        setOpenDialog(false)
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Trash2 className="size-4 text-red-600 hover:cursor-pointer hover:opacity-75" />
            </DialogTrigger>
            <DialogContent className="max-w-md">
                {deleteClassMutation.isPending ? (
                    <SkeletonLoader msg="Deleting Class..." />
                ) : (
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-semibold text-gray-900">
                                        Delete Class
                                    </DialogTitle>
                                </div>
                            </div>
                        </DialogHeader>

                        <div>
                            <DialogDescription className="text-gray-600 text-sm leading-relaxed">
                                Are you sure you want to delete the class{' '}
                                <span className="font-semibold text-gray-900">
                                    "{classData.name}"
                                </span>
                                ?
                                <br />
                                This action cannot be undone and will permanently remove the class
                                and all associated data.
                            </DialogDescription>
                        </div>

                        <DialogFooter>
                            <PrimaryButton color="black" variant="outline" onClick={handleCancel}>
                                Cancel
                            </PrimaryButton>

                            <PrimaryButton color="red" variant="outline" onClick={handleDelete}>
                                Yes, Proceed
                            </PrimaryButton>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
