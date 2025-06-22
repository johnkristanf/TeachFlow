'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog'
import { CircleAlert, Loader2, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { signOutUser } from '@/actions/auth'
import { DropdownMenu, DropdownMenuItem } from './ui/dropdown-menu'
import { PrimaryButton } from './ui/primary-button'

export default function LogoutDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
    }

    const handlePreventClose = (e: Event) => {
        e.preventDefault()
    }

    return (
        <DropdownMenuItem asChild onSelect={handlePreventClose}>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div className="flex items-center w-full cursor-pointer px-2 py-1.5 rounded hover:bg-muted transition-colors">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log Out</span>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-1">
                            <CircleAlert className="text-red-400 size-5" />
                            Are you absolutely sure?
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            You will be signed out of your account and redirected to the login page.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2 pt-2">
                        <PrimaryButton
                            variant="outline"
                            color="black"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </PrimaryButton>
                        <form action={signOutUser} onSubmit={handleSubmit}>
                            <PrimaryButton
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2"
                                variant="outline"
                                color="red"
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                Yes, Log Out
                            </PrimaryButton>
                        </form>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DropdownMenuItem>
    )
}
