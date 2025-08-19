"use client"
import { useTRPC } from '@/trpc/Client';

const HomeView = () => {
  const trpc = useTRPC();
 
  return (
    <>Meetings will show here</>   
  )
}

export default HomeView;