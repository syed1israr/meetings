"use client"
import { useConfirm } from '@/hooks/use-confirm';
import { useTRPC } from '@/trpc/Client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ActiveState } from '../Components/ActiveState';
import MeetingIdViewHeader from '../Components/MeetingIdViewHeader';
import { UpComingState } from '../Components/UpcomingState';
import { UpdateMeetingDialog } from '../Components/UpdateMeetingDialog';
import { CancelledState } from '../Components/CancelledState';
import { ProcessingState } from '../Components/ProcessingState';
import { Completed_state } from '../Components/Completed_state';


interface props {
    meetingId : string;
}


const MeetingIdView =  ( {meetingId} : props)  => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();
    const [updateMeetingDialog,setupdateMeetingDialog] = useState(false);
    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({ id : meetingId}),
     )
   const[ RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure ? ",
        "The following action will remove this meeting"
    )
        const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                router.push("/meetings");
            },
        })
    )

     const handlerRemoveMeeting = async() =>{
        const ok = await confirmRemove();
        if( !ok  ) return;
        await removeMeeting.mutateAsync({ id : meetingId});
    }


    const isActive = data.status === "active";
    const isUpcoming = data.status === "upcoming";
    const isCompleted = data.status === "completed";
    const isProcessing = data.status === "processing";
    const isCancelled = data.status === "cancelled";

  return (
    <div>
      <RemoveConfirmation/>
        <UpdateMeetingDialog
            open={updateMeetingDialog}
            onOpenChange={setupdateMeetingDialog}
            initialValues={data}
        />
       <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <MeetingIdViewHeader
            meetingId={meetingId}
            meetingName={data.name}
            onEdit = {()=>setupdateMeetingDialog(true)}
            onRemove = {handlerRemoveMeeting}
            />

            { isCancelled && <CancelledState/>}
            { isActive && <ActiveState meetingId={meetingId}/> }
            { isUpcoming && <UpComingState meetingId={meetingId}/> }
            {  isProcessing && <ProcessingState/> }
            { isCompleted && <Completed_state data={data} />} 

        </div>
        </div>
  )
}

export default MeetingIdView