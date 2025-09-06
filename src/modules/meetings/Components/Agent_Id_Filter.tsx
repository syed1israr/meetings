
import { GenerateAvatar } from '@/components/generator';
import { useMeetingsFilter } from '@/hooks/Use-Meetings-Filter.';
import { useTRPC } from '@/trpc/Client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Command_select from './Command-select';


const Agent_Id_Filter = () => {
    const trpc = useTRPC();
    const [filters,setfilters] = useMeetingsFilter();
    const [agentSearch,setagentSearch] = useState("")
    const { data } = useQuery(trpc.agents.getMany.queryOptions({
        pageSize:100,
        search : agentSearch
    }))
  return (
   <Command_select
   className='h-9'
   placeholder='agent'
   options={(data?.items ?? []).map((agent)=>(
        {
            id : agent.id,
            value : agent.id,
            children : (
                <div className='flex items-center gap-x-2'>
                    <GenerateAvatar
                    seed={agent.name}
                    variant="botttsNeutral"
                    className='size-4'
                    />
                    {agent.name}
                </div>
            )
        }
   ))}
   value={filters.agentId ?? ""}
   onSelect={(value: string) => setfilters({ ...filters, agentId: value })}
   onSearch={setagentSearch}
   />
  )
}

export default Agent_Id_Filter