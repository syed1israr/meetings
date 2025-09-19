import { auth } from '@/lib/auth';
import MeetingsView, { MeetingviewError, MeetingviewLoading } from '@/modules/meetings/Client/MeetingsView';
import Meeting_List_Headers from '@/modules/meetings/Components/Meetings-list-headers';
import { LoadSearchParams } from '@/modules/meetings/params';
import { getQueryClient, trpc } from '@/trpc/Server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';





interface props {
  searchParams : Promise<SearchParams>;

}


const page =  async ({searchParams} : props) => {

 const session = await auth.api.getSession({
        headers: await headers(),
      }) 
      if( !session){
        redirect("/sign-in");
    }

  const queryClient = getQueryClient();
  const params = await LoadSearchParams(searchParams);

  void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({...params}));

  return (
    <>
    <Meeting_List_Headers/>
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingviewLoading/>}>
        <ErrorBoundary fallback={<MeetingviewError/>}>
      <MeetingsView/>
      </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
    </>
    
  )
}

export default page