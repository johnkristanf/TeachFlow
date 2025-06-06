'use client'

import * as React from 'react'
import {
    Frame,
    LifeBuoy,
    Map,
    PieChart,
    Send,
} from 'lucide-react'

import { NavProjects } from '@/components/nav-projects'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import Image from 'next/image'

const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },

    core_projects: [
        {
            name: 'Essays',
            url: '/essays',
            icon: Frame,
        },
        {
            name: 'Rubrics',
            url: '/rubrics',
            icon: PieChart,
        },
        {
            name: 'PPT Generation',
            url: '/ppt-generation',
            icon: Map,
        },
    ],

    navSecondary: [
        {
            title: 'Support',
            url: '/support',
            icon: LifeBuoy,
        },
        {
            title: 'Feedback',
            url: '/feedback',
            icon: Send,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="inset" {...props} className="bg-blue-500 text-white">
            <SidebarHeader className="bg-blue-500">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <Image
                                    src={'/teachflow-logo.png'}
                                    alt="TeachFlow Logo"
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">TeachFlow</span>
                                    <span className="truncate text-xs">Enterprise</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="bg-blue-500">
                <NavProjects projects={data.core_projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter className="bg-blue-500">
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
