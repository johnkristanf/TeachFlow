'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BadgeCheck, Bell, CreditCard } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import LogoutDialog from './logout-dialog'

export default function UserMenuDropdown() {
    const { data: session, status } = useSession()
    const user = session?.user

    if (status == 'loading') {
        return (
            <div className="min-h-screen flex justify-center font-semibold">
                <p className="text-xl text-gray-500 mt-18">Loading User Data...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex justify-center font-semibold">
                <p className="text-xl text-gray-500 mt-18">Failed to Load User Profile</p>
            </div>
        )
    }

    if (status === 'unauthenticated') {
        redirect('/auth/signin')
    }

    return (
        <div className="w-full flex justify-end items-center gap-3 pr-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 hover:cursor-pointer max-w-xs">
                        <Avatar className="size-9">
                            <AvatarImage
                                src={user.image ?? '/user-icon.jpg'}
                                alt="User Image Profile"
                            />
                            <AvatarFallback>User</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col overflow-hidden max-w-[12rem]">
                            <h1 className="text-gray-500 font-semibold text-sm truncate">
                                {user.name}
                            </h1>
                            <p className="text-gray-300 font-semibold text-xs truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    align="end"
                    sideOffset={4}
                >
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Link href={'/account'} className="flex items-center gap-2">
                                <BadgeCheck />
                                Account
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <CreditCard />
                            Billing
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Bell />
                            Notifications
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />

                    {/* LOGOUT MENU */}
                    <LogoutDialog />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
