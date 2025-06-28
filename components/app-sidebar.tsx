'use client'

import * as React from 'react'
import { PhoneCall, Presentation, ScrollText, Send, Shapes, Table } from 'lucide-react'

import { NavProjects } from '@/components/nav-projects'
import { NavSecondary } from '@/components/nav-secondary'
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import Image from 'next/image'

const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/teachflow-logo.png',
    },

    core_projects: [
        {
            name: 'Essays',
            url: '/essays',
            icon: ScrollText,
        },
        {
            name: 'Rubrics',
            url: '/rubrics',
            icon: Table,
        },
        {
            name: 'Classes',
            url: '/classes',
            icon: Presentation,
        },

        {
            name: 'Quiz Generator',
            url: '/quiz/generator',
            icon: Shapes,
        },
    ],

    navSecondary: [
        // {
        //     title: 'Contact Us',
        //     url: '/contact-us',
        //     icon: PhoneCall,
        // },
        {
            title: 'Feedback',
            url: '/feedback',
            icon: Send,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { setOpen, isMobile } = useSidebar()

    const handleLinkClick = () => {
        console.log('clicked link')

        // Only close the sidebar if it's in a mobile/overlay view
        // On desktop, the sidebar might be persistently open, so closing it would be jarring.
        if (isMobile) {
            setOpen(false)
        }
    }

    return (
        <Sidebar
            variant="inset"
            {...props}
            // Add flex column to sidebar
            className="flex flex-col bg-blue-500 text-white"
        >
            <SidebarHeader className="bg-blue-500 flex-shrink-0">
                {' '}
                {/* flex-shrink-0 to keep header fixed size */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="text-white hover:text-black transition-colors"
                        >
                            <a href="/essays" className="hover:bg-blue-600 transition-colors">
                                <Image
                                    src={'/teachflow-logo.png'}
                                    alt="TeachFlow Logo"
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                />
                                <div className="grid flex-1 text-left text-sm leading-tight ">
                                    <span className="truncate font-medium">TeachFlow</span>
                                    <span className="truncate text-xs">Enterprise</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Make SidebarContent flex-grow and scrollable */}
            <SidebarContent className="bg-blue-500 flex-grow">
                <NavProjects projects={data.core_projects} onLinkClick={handleLinkClick} />
                <NavSecondary items={data.navSecondary} onLinkClick={handleLinkClick} />
            </SidebarContent>
        </Sidebar>
    )
}
