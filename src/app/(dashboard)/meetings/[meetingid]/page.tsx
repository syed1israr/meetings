import { auth } from '@/lib/auth';
import MeetingIdView from '@/modules/meetings/Client/MeetingIdView';
import { MeetingviewError, MeetingviewLoading } from '@/modules/meetings/Client/MeetingsView';
import { getQueryClient, trpc } from '@/trpc/Server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';



interface props {
  params: Promise<{ meetingid: string }>
}

const page = async ({ params }: props) => {
  const { meetingid: meetingId } = await params; 
  console.log("MeetingId", meetingId);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingviewLoading />}>
        <ErrorBoundary fallback={<MeetingviewError />}>
          <MeetingIdView meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;