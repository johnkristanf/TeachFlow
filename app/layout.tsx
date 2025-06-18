import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { AppSidebar } from '@/components/app-sidebar'

import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import './globals.css'
import { Toaster } from 'sonner'
import { ReactQueryProvider } from './react-query-provider'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from 'lucide-react'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'TeachFlow',
    icons: {
        icon: '/teachflow-logo.ico',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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

                                <div className="w-full  flex justify-end items-center gap-3 pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="flex items-center gap-1 hover:cursor-pointer">
                                                <Avatar>
                                                    <AvatarImage
                                                        src="https://github.com/shadcn.png"
                                                        alt="@shadcn"
                                                    />
                                                    <AvatarFallback>
                                                        User Profile
                                                    </AvatarFallback>
                                                </Avatar>
                                                <h1 className="text-gray-500 truncate font-semibold ">
                                                    {' '}
                                                    {/* Removed w-[80%] as it might constrain unnecessarily */}
                                                    John Kristan Torremocha
                                                </h1>
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
                                            <DropdownMenuItem>
                                                <LogOut />
                                                Log out
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </header>

                            {/* MAIN PAGE */}
                            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                                {children}
                            </div>
                        </SidebarInset>
                    </SidebarProvider>
                </ReactQueryProvider>

                <Toaster richColors closeButton position="top-right" />
            </body>
        </html>
    )
}
