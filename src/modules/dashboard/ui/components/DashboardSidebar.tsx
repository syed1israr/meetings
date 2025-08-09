'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroupContent,
    SidebarFooter,
    SidebarHeader
} from '@/components/ui/sidebar'
import { BotIcon, VideoIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import DashBoardUserButton from './DashBoardUserButton'


const firstSection = [
    {
        icon: VideoIcon,
        label: "Meetings",
        href: "/meetings"
    },
    {
        icon: BotIcon,
        label: "Agents",
        href: "/agents"
    }
]

const DashboardSidebar = () => {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarHeader className='text-sidebar-accent-foreground'>
                <Link href="/" className='flex items-center gap-2 px-2 pt-2'>
                    <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                    <p className='text-2xl font-semibold'>Tandemly</p>
                </Link>
            </SidebarHeader>

            <div className='px-4 py-2'>
                <Separator className='opacity-10 text-[#5D6B68]' />
            </div>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((item, i) => (
                                <SidebarMenuItem key={i}>
                                    <SidebarMenuButton
                                        asChild
                                        className={cn(
                                            "h-10 hover:bg-linear-to-r/oklch border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                            pathname === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                                        )}
                                        isActive={pathname === item.href}
                                    >
                                        <Link href={item.href} className="flex items-center gap-2">
                                            <item.icon className="size-5 text-sidebar-accent-foreground" />
                                            <span className="text-sm font-medium tracking-tight">{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <div className='px-4 py-2'>
                <Separator className='opacity-10 text-[#5D6B68]' />
            </div>

            <SidebarFooter className='text-white'>
               <DashBoardUserButton/>
            </SidebarFooter>
        </Sidebar>
    )
}

export default DashboardSidebar
