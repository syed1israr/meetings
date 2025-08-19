"use client"
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import DashboardCommand from './DashboardCommand'
import { motion } from 'framer-motion'

const DashboardNavbarComponent = () => { 
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setcommandOpen] = useState(false)
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "W" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setcommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setcommandOpen} />
      
      <nav className='flex px-4 py-3 border-bottom bg-background items-center justify-center relative'>
        {/* Sidebar Toggle Button - positioned absolutely to keep center alignment */}
        <div className="absolute left-4">
          <Button className='size-9' variant="outline" onClick={toggleSidebar}>
            {(state == "collapsed" || isMobile) 
              ? <PanelLeftIcon className='size-4'/> 
              : <PanelLeftCloseIcon className='size-4'/>}
          </Button>
        </div>

        {/* Centered & animated Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Button 
            variant="outline" 
            size={"lg"} 
            className='h-12 w-[400px] justify-start font-normal text-muted-foreground hover:text-muted-foreground shadow-md'
            onClick={() => setcommandOpen((open) => !open)} 
          >
            <SearchIcon className="mr-2" />
            Search
            <kbd className='ml-auto pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground'>
              <span className='text-sm'>&#8984;</span>K
            </kbd>
          </Button>
        </motion.div>
      </nav>
    </>
  )
}

export default DashboardNavbarComponent
