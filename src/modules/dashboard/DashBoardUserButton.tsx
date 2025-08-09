'use client'

import { GenerateAvatar } from "@/components/generator"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"
import { authClient } from "@/lib/auth-client"
import { ChevronDownIcon, LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"


const DashBoardUserButton = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession()
  const isMobile = useIsMobile();
 
  if (isPending || !data?.user) return null
 
  const imageUrl = data.user.image ?? undefined
  console.log("image Url", imageUrl)
  const onLogOut = () =>{
     authClient.signOut({
        fetchOptions:{
            onSuccess:()=>{ router.push("/sign-in")}
        }
    })
  }

  if( isMobile ) {
    return(
      <Drawer>
        <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
         <Avatar className="w-10 h-10">
            { data.user.image ? (  <AvatarImage
            key={imageUrl}
            src={imageUrl}
            className="w-10 h-10 rounded-full object-cover"
          />) : <GenerateAvatar 
                seed={data.user.name}
                variant="initials"
                className="size-9 mr-3"
          /> }
         
        </Avatar>
         <main className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0 ml-2">
           <p className="text-sm truncate w-full">
            {data.user.name}
           </p>
           <p className="text-sm truncate w-full">
            {data.user.email}
           </p>
          </main>
          <ChevronDownIcon className="size-4 shrink-0"/>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription>{data.user.email}</DrawerDescription>
        </DrawerHeader>
          <Button onClick={()=>{onLogOut()}} variant={"outline"} >
          <LogOutIcon  className="size-4 text-black" />
          Logout
        </Button>
        </DrawerContent>
      </Drawer>
    )
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
        <Avatar className="w-10 h-10">
            { data.user.image ? (  <AvatarImage
            src={imageUrl}
            className="w-10 h-10 rounded-full object-cover"
          />) : <GenerateAvatar 
                seed={data.user.name}
                variant="initials"
                className="size-9 mr-3"
          /> }
         
        </Avatar>
         <main className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0 ml-2">
           <p className="text-sm truncate w-full">
            {data.user.name}
           </p>
           <p className="text-sm truncate w-full">
            {data.user.email}
           </p>
          </main>
          <ChevronDownIcon className="size-4 shrink-0"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
                <span className="font-medium truncate">{data.user.name}</span>
                <span className="text-sm font-normal text-muted-foreground">{data.user.email}</span>
            </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuItem
        className="cursor-pointer flex items-center justify-between"
        onClick={()=>{onLogOut();}}
        >
            Logout
            <LogOutIcon className="size-4"/>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DashBoardUserButton