import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardNavbarComponent from "@/modules/dashboard/DashboardNavbar";
import DashboardSidebar from "@/modules/dashboard/DashboardSidebar";

interface props{
    children: React.ReactNode
}
const layout = ({children}:props) => {
  return (
    <div>
        <SidebarProvider>
            <DashboardSidebar/>
            <main className='flex flex-col h-screen w-screen bg-muted'>
            <DashboardNavbarComponent/>
            {children}
            </main>
        </SidebarProvider>
    </div>
  )
}

export default layout;