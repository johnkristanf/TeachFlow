import { PrimaryButton } from '../ui/primary-button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import BuildWithAIForm from './build-with-ai-form'
import { useState } from 'react'
import { BuildWithAIRubric } from '@/types/rubrics'
import EditableAIRubricForm from './editable-ai-rubric-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { SkeletonLoader } from '../skeleton-loading'

const BuildWithAI = () => {
    const [buildWithAIResponses, setBuildWithAIResponses] = useState<BuildWithAIRubric>()
    const [openDialog, setOpenDialog] = useState<boolean>(false)

    const queryyClient = useQueryClient()
    console.log('buildWithAIResponses: ', buildWithAIResponses)

    const mutation = useMutation({
        mutationFn: async (data: BuildWithAIRubric) => {
            const res = await fetch('/api/rubrics', {
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

        onSuccess: (response) => {
            console.log('Rubric saved:', response)
            queryyClient.invalidateQueries({ queryKey: ['rubrics'] })
            toast.success('Rubric Saved Successfully!')

            setTimeout(() => {
                setOpenDialog(false)
                setBuildWithAIResponses(undefined)
            }, 1000)
        },

        onError: (err) => {
            console.error('Error saving rubric:', err)
        },
    })

    const onSubmit = (updatedData: BuildWithAIRubric) => {
        console.log('Final rubric submitted:', updatedData)
        mutation.mutate(updatedData)
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <PrimaryButton color="blue" variant="outline" onClick={() => setOpenDialog(true)}>
                    Build with AI
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] max-h-[600px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Rubric Settings</DialogTitle>
                    <DialogDescription>
                        Set the grading options and click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                {mutation.isPending ? (
                    <SkeletonLoader msg="Saving your rubric..." />
                ) : buildWithAIResponses ? (
                    <EditableAIRubricForm data={buildWithAIResponses} onSubmit={onSubmit} />
                ) : (
                    <BuildWithAIForm setBuildWithAIResponses={setBuildWithAIResponses} />
                )}


            </DialogContent>
        </Dialog>
    )
}

export default BuildWithAI
