
import { AgentIdView, AgentIdviewError, AgentIdviewLoading } from '@/components/Agent-ID-view';
import { getQueryClient, trpc } from '@/trpc/Server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface props{
    params : Promise<{agentId : string}>
}

const page = async ({params}:props) => {
    const { agentId } = await params;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getOne.queryOptions({id : agentId }));
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentIdviewLoading/>}>
                <ErrorBoundary fallback={<AgentIdviewError/>} >
                 <AgentIdView agentId = {agentId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default page