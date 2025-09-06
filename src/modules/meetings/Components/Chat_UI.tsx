import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Channel as StreamChannel}  from "stream-chat"
import { 
    useCreateChatClient,
    Chat,
    Channel as WorkingChannel,
    MessageInput,
    MessageList,
    Thread,
    Window
} from "stream-chat-react"

import "stream-chat-react/dist/css/v2/index.css"


interface props{
    meetingId  : string;
    meetingName  : string;
    userId  : string;
    userName  : string;
    userImage  : string  | undefined;
}

export const Chat_UI = ({userImage,userName,userId,meetingName,meetingId} : props) => {
    const trpc = useTRPC();
    const { mutateAsync : generateChatToken } = useMutation(
        trpc.meetings.generateChatToken.mutationOptions()
    )
    const [Channel, setChannel] = useState<StreamChannel>();

    const client = useCreateChatClient({
        apiKey : process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
        tokenOrProvider : generateChatToken,
        userData:{
            id : userId,
            name : userName,
            image : userImage
        }
    })

    useEffect(()=>{
        if( !client ) return;
        const channel = client.channel("messaging",meetingId,{
            members : [userId]
        });
        setChannel(channel); 
    },[client,meetingId,meetingName,userId])

    if( !client ){
       return (
        <LoadingState
            title="Loading Chat"
            description="this my take few seconds"
        />
       )
    }
    return (

        <div className="bg-white rounded-lg border overflow-hidden">
            <Chat client={client}>
                <WorkingChannel channel = {Channel}>
                    <Window>
                        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
                            <MessageList/>
                        </div>
                        <MessageInput/>
                    </Window>
                    <Thread/>
                </WorkingChannel>
            </Chat>
        </div>
    )

}