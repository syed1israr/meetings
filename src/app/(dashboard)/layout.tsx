import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardSidebar from "@/modules/dashboard/ui/components/DashboardSidebar"

interface props{
    children: React.ReactNode
}
const layout = ({children}:props) => {
  return (
    <div>
        <SidebarProvider>
            <DashboardSidebar/>
            <main className='flex flex-col h-screen w-screen bg-muted'>
            {children}
            </main>
        </SidebarProvider>
    </div>
  )
}

export default layout;