'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { type LucideIcon } from 'lucide-react'

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavSecondary({
    items,
    onLinkClick,
    ...props
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
    }[]
    onLinkClick: () => void
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    const pathname = usePathname()

    return (
        <SidebarGroup {...props}>
            <SidebarGroupLabel className="text-white">Support</SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const isActive = pathname === item.url

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild size="sm">
                                    <a
                                        href={item.url}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition
                                        ${isActive ? 'bg-white text-gray-900' : 'text-white'}`}
                                        onClick={onLinkClick}
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
