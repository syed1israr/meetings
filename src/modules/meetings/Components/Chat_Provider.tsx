"use client"

import { LoadingState } from "@/components/loading-state";
import { authClient } from "@/lib/auth-client";
import { Chat_UI } from "./Chat_UI";

interface props{
    meetingId : string;
    meetingName : string;
}


export const ChatProvider = ({meetingId,meetingName} : props) => {
    const { data, isPending } = authClient.useSession();
    if( isPending || !data?.user ) {
         return (
            <LoadingState
                title="Loading"
                description="this my take few seconds"
            />
         )
    }
    return (
        <Chat_UI
        meetingId = { meetingId } 
        meetingName = { meetingName } 
        userId = { data.user.id }
        userName = { data.user.name }
        userImage = { data.user.image  ?? ""}
        />
    )
}