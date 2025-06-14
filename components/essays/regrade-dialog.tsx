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

function RegradeDialog({
    onRegrade,
    isPending,
    openDialog,
    setOpenDialog,
}: {
    onRegrade: () => void
    isPending: boolean
    openDialog: boolean
    setOpenDialog: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger>Re-Grade</DialogTrigger>
            <DialogContent>
                {isPending ? (
                    <SkeletonLoader msg="Submitting Essay for Re-Grade..." />
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-1">
                                Proceed with Re-Grading?
                            </DialogTitle>
                            <DialogDescription>
                                By confirming, all affected grades will be updated. Ensure these
                                changes are what you intend.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <DialogClose asChild>
                                <PrimaryButton color="black" variant="outline">
                                    Cancel
                                </PrimaryButton>
                            </DialogClose>

                            <PrimaryButton color="blue" variant="outline" onClick={onRegrade}>
                                Confirm
                            </PrimaryButton>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
export default RegradeDialog
