import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { PrimaryButton } from '../ui/primary-button'
import { CircleAlert } from 'lucide-react'
import { SkeletonLoader } from '../skeleton-loading'
import { Dispatch, SetStateAction } from 'react'

function DeleteRubric({
    onDelete,
    isPending,
    openDialog,
    setOpenDialog,
}: {
    onDelete: () => void
    isPending: boolean
    openDialog: boolean
    setOpenDialog: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <PrimaryButton color="red" variant="solid">
                    Delete
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent>
                {isPending ? (
                    <SkeletonLoader msg="Deleting Rubric..." />
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-1">
                                <CircleAlert className="text-red-800" />
                                Are you absolutely sure?
                            </DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <DialogClose>
                                <PrimaryButton color="black" variant="solid">
                                    Cancel
                                </PrimaryButton>
                            </DialogClose>

                            <PrimaryButton color="red" variant="solid" onClick={onDelete}>
                                Yes, Proceed
                            </PrimaryButton>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
export default DeleteRubric
