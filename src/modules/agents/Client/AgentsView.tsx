'use client';
import { columns } from '@/components/Columns';
import DataPagination from '@/components/DataPagination';
import { DataTable } from '@/components/DataTable';
import { Empty_state } from '@/components/Empty_state';
import { useAgentsFilters } from '@/hooks/Use_Agents_Filters';
import { useTRPC } from '@/trpc/Client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';



const AgentsView = () => {
    const trpc = useTRPC();
    const [filters,setfilters] = useAgentsFilters();
    const router = useRouter();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
      ...filters
    }));
    console.log("agents Data",data?.items)

    // if( isLoading ){
    //     return(
    //        <LoadingState
    //         title='Loading Agents'
    //         description='Please wait while we load the agents.'
    //        />
    //     )
    // }
    
    // if( isError ){
    //     return(
    //         <div>
    //             Error loading agents
    //         </div>
    //     )
    // }
    if( data?.items.length === 0 ){
      return (
          <Empty_state
          title="Create your First Agent"
          description="Create an Agent to Join your Meetings, Each Agent will follow your instructions and can interact with participants during the call."
        />
        
      )
    }
    return (
   <div
   className='flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4'
   >
    <DataTable
      data={data.items || []}
      columns={columns}
         onRowClick={(r)=>router.push(`/agents/${r.id}`)}
    />
    <DataPagination
              page={filters.page}
              total_pages={data.total_pages}
              onPageChange={(page) => setfilters((prev) => ({ ...prev, page }))}
            />
   </div>
  )
}

export default AgentsView