import { Error_state } from "@/components/Error-state";
import { LoadingState } from "@/components/loading-state";
import AgentsView from "@/modules/agents/Client/AgentsView";
import { getQueryClient, trpc } from "@/trpc/Server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from "react";
import ListHeaders from "@/components/AgentListHeader";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const pages = async() => {
      const session = await auth.api.getSession({
        headers : await headers()
      });
    
      if( !session ) {  redirect('/sign-in'); } 
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
    return(
        <>
        <ListHeaders/>
        <HydrationBoundary state={dehydrate(queryClient)}>
         <Suspense fallback={<LoadingState title="Loading Agents" description="This may take Time"/>}>
            <ErrorBoundary fallback={<Error_state
        title="Error"
        description="An error occurred while loading the agents."
        />}>

            <AgentsView/>
            </ErrorBoundary>
         </Suspense>
        </HydrationBoundary>
        </>
    )
}
export default pages;