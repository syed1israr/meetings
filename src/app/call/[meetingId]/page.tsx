
import { auth } from "@/lib/auth";
import { CallView } from "@/modules/call/UI/CallView";

import { getQueryClient, trpc } from "@/trpc/Server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface props{
    params : Promise<{meetingId : string}>;
}



 const page = async({params} : props )=>{
    const { meetingId } = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
      }) 
      if( !session){
        redirect("/sign-in");
      }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.meetings.getOne.queryOptions({ id : meetingId }));
    return(
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CallView meetingId={meetingId}/>
        </HydrationBoundary>
    )
}

export default page;

