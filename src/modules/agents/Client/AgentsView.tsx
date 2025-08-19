'use client';
import { useTRPC } from '@/trpc/Client';
import { useSuspenseQuery } from '@tanstack/react-query';

const AgentsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());
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
    return (
   <div>
     { JSON.stringify(data, null, 2)}
   </div>
  )
}

export default AgentsView