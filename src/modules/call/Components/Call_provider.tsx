"use client"

import { authClient } from "@/lib/auth-client";
import { LoaderIcon } from "lucide-react";
import { CallConnect } from "./Call_Connect";
import { GenerateAvatarUri } from "@/lib/avatar";

interface props{
    meetingId : string,
    meetingName : string;
}

export const CallProvider = ({ meetingId, meetingName} : props) =>{
    const { data, isPending } = authClient.useSession();   
    if( !data || isPending ){
        return(
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
               <LoaderIcon className="size-6 animate-spin text-white"/> 
            </div>
        )
    }
    return(
        <CallConnect
        meetingId={meetingId}
        meetingName={meetingName}
        userId = { data.user.id }
        userName = { data.user.name }
        userImage={
            data.user.image ??
            GenerateAvatarUri({
                seed: data.user.name || data.user.id,
                variant: "initials",
            })
        }
        />
        // <div>
        //     {meetingName}
        // </div>
    )
}