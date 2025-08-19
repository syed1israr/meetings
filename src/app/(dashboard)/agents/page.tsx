import { Error_state } from "@/components/Error-state";
import { LoadingState } from "@/components/loading-state";
import AgentsView from "@/modules/agents/Client/AgentsView";
import { getQueryClient, trpc } from "@/trpc/Server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from "react";

const pages = () => {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
    return(
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
    )
}
export default pages;