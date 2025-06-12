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

function DeleteEssay({
    onDelete,
    isPending,
    isGraded,
    openDialog,
    setOpenDialog,
}: {
    onDelete: () => void
    isPending: boolean
    isGraded: boolean
    openDialog: boolean
    setOpenDialog: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <PrimaryButton
                    color="red"
                    variant="solid"
                    disabled={!isGraded}
                    className={!isGraded ? 'opacity-50 cursor-not-allowed' : ''}
                >
                    Delete
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent>
                {isPending ? (
                    <SkeletonLoader msg="Deleting Essay..." />
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
                            <DialogClose asChild>
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
export default DeleteEssay
