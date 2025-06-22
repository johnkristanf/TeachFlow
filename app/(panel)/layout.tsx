import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BadgeCheck, Bell, CreditCard, Sparkles } from 'lucide-react'
import { ReactQueryProvider } from '../react-query-provider'

import '../globals.css'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import LogoutDialog from '@/components/logout-dialog'
import { Toaster } from 'sonner'

export default async function PanelLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await auth()
    if (!session) {
        redirect('/auth/signin') // 🔁 Redirect if unauthenticated
    }

    return (
        <html lang="en">
            <body>
                <ReactQueryProvider>
                    <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset className="">
                            <header className="flex h-16 shrink-0 items-center gap-2 ">
                                <div className="flex items-center gap-2 px-4 ">
                                    <SidebarTrigger className="-ml-1" />
                                    <Separator
                                        orientation="vertical"
                                        className="mr-2 data-[orientation=vertical]:h-4"
                                    />
                                </div>

                                <div className="w-full flex justify-end items-center gap-3 pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="flex items-center gap-2 hover:cursor-pointer max-w-xs">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={session.user?.image ?? ''}
                                                        alt="User Image Profile"
                                                    />
                                                    <AvatarFallback>User</AvatarFallback>
                                                </Avatar>

                                                <div className="flex flex-col overflow-hidden max-w-[12rem]">
                                                    <h1 className="text-gray-500 font-semibold truncate">
                                                        {session.user?.name}
                                                    </h1>
                                                    <p className="text-gray-300 font-semibold text-sm truncate">
                                                        {session.user?.email}
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
                                                    <Sparkles />
                                                    Upgrade to Pro
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>
                                                    <BadgeCheck />
                                                    Account
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
                            </header>

                            {/* MAIN PAGE */}
                            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
                        </SidebarInset>
                    </SidebarProvider>
                    <Toaster richColors closeButton position="top-right" />
                </ReactQueryProvider>
            </body>
        </html>
    )
}
