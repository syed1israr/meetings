'use client'
import { GenerateAvatar } from "@/components/generator";
import { CommandGroup, CommandEmpty, CommandInput, CommandItem, CommandList, CommandResponsiveDialoge } from "@/components/ui/command";
import { useTRPC } from "@/trpc/Client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

interface props{
    open : boolean;
    setOpen : Dispatch<SetStateAction<boolean>>;
    
}
const DashboardCommand = ({open,setOpen}:props) => {
   const  router  = useRouter();
   const [search ,setsearch ] = useState("")

   const trpc = useTRPC();
   const meetings = useQuery(trpc.meetings.getMany.queryOptions({
    search,
    pageSize:100,
   }));
   const agents = useQuery(trpc.agents.getMany.queryOptions({
    search,
    pageSize:100,
   }));

  return (
    <CommandResponsiveDialoge shouldFilter={false} open={open} onOpenChange={setOpen}>
        <CommandInput
        placeholder="Find a meeting or Agent.."
        value={search}
        onValueChange={(v)=>setsearch(v)}
        />
        <CommandList>
            <CommandGroup heading="Meetings">
                <CommandEmpty className="text-muted-foreground text-sm">
                  <span>
                    No Meeting Found
                  </span>
                </CommandEmpty>
                { meetings.data?.items.map((meeting)=>(
                  <CommandItem
                  onSelect={()=>{
                    router.push(`/meetings/${meeting.id}`);
                    setOpen(false);
                  }}
                  key={meeting.id}
                  >
                    {meeting.name}
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandGroup heading="Agents">
                <CommandEmpty className="text-muted-foreground text-sm">
                  <span>
                    No Agents Found
                  </span>
                </CommandEmpty>
                { agents.data?.items.map((Agent)=>(
                  <CommandItem
                  onSelect={()=>{
                    router.push(`/agents/${Agent.id}`);
                    setOpen(false);
                  }}
                  key={Agent.id}
                  >
                    <GenerateAvatar
                    seed={Agent.name}
                    variant="botttsNeutral"
                    className="size-5"
                    />
                    {Agent.name}
                  </CommandItem>
                ))}
            </CommandGroup>
    
        </CommandList>
    </CommandResponsiveDialoge>
  )
}

export default DashboardCommand