'use client'

import { Separator } from '@/components/ui/separator'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { BotIcon, VideoIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
        <Sidebar className="bg-educational-gradient-dark border-r border-educational">
            <SidebarHeader className='text-sidebar-accent-foreground p-6'>
                <Link href="/" className='flex items-center gap-3 px-2 pt-2 group'>
                    <div className="p-2 bg-primary-gradient rounded-xl shadow-educational">
                        <Image src="/logo.svg" alt="Logo" width={32} height={32} className="filter brightness-0 invert" />
                    </div>
                    <div>
                        <p className='text-2xl font-bold text-white'>Tandemly</p>
                        <p className='text-xs text-muted-foreground font-medium'>AI Learning Platform</p>
                    </div>
                </Link>
            </SidebarHeader>

            <div className='px-6 py-2'>
                <Separator className='opacity-20 border-sidebar-border' />
            </div>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((item, i) => (
                                <SidebarMenuItem key={i} className="px-3">
                                    <SidebarMenuButton
                                        asChild
                                        className={cn(
                                            "h-12 rounded-xl hover:bg-sidebar-accent/50 border-transparent hover:border-sidebar-border/50 hover-lift transition-all duration-200 group",
                                            pathname === item.href && "bg-primary-gradient border-sidebar-border/50 shadow-educational"
                                        )}
                                        isActive={pathname === item.href}
                                    >
                                        <Link href={item.href} className="flex items-center gap-3 px-4">
                                            <div className={cn(
                                                "p-2 rounded-lg transition-colors",
                                                pathname === item.href 
                                                    ? "bg-white/20 text-white" 
                                                    : "bg-sidebar-accent/30 text-sidebar-accent-foreground group-hover:bg-white/10 group-hover:text-white"
                                            )}>
                                                <item.icon className="size-5" />
                                            </div>
                                            <span className={cn(
                                                "text-sm font-semibold tracking-tight transition-colors",
                                                pathname === item.href 
                                                    ? "text-white" 
                                                    : "text-sidebar-accent-foreground group-hover:text-white"
                                            )}>
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <div className='px-6 py-2'>
                <Separator className='opacity-20 border-sidebar-border' />
            </div>

            <SidebarFooter className='p-6 text-white'>
               <DashBoardUserButton/>
            </SidebarFooter>
        </Sidebar>
    )
}

export default DashboardSidebar
