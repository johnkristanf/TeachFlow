'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavProjects({
    projects,
    onLinkClick
}: {
    projects: {
        name: string
        url: string
        icon: LucideIcon
    }[],
    onLinkClick: () => void
}) {
    const pathname = usePathname()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className='text-white'>Core Features</SidebarGroupLabel>

            <SidebarMenu>
                {projects.map((item) => {
                    const isActive = pathname === item.url

                    return (
                        <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton asChild>
                                <Link
                                    href={item.url}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition 
                                    ${isActive ? 'bg-white text-gray-900' : 'text-white'}`}
                                    onClick={onLinkClick}
                                >
                                    <item.icon />
                                    <span>{item.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
