


import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { GenerateAvatarUri } from "@/lib/avatar";
import { DefaultVideoPlaceholder, StreamVideoParticipant, ToggleAudioPreviewButton, ToggleVideoPreviewButton, useCallStateHooks, VideoPreview } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

interface props{
    onJoin: () => void;
}

const DisabledVideoPreview = () => {
    const { data } = authClient.useSession();
    return(
        <DefaultVideoPlaceholder
        participant={
            {
                name : data?.user.name ?? " ",
                image : data?.user.image ?? GenerateAvatarUri({seed : data?.user.name ?? "", variant : "initials"})
            } as StreamVideoParticipant
        } 
        />
    )
}

const AllowBrowserPermissions = () => {
    return(
        <p className="text-sm">
            Please grant your browser a permission to access your camera and microphone.
        </p>
    )
}
export const CallLobby = ({onJoin} : props) =>{
    const { useCameraState, useMicrophoneState } = useCallStateHooks();
    const { hasBrowserPermission : hasMicPermission } = useMicrophoneState();
    const { hasBrowserPermission : hasCameraPermission } = useCameraState();
    const hasPermission = hasMicPermission && hasCameraPermission;
    return(
        <div className="flex flex-col items-center justify-center h-full bg-educational-gradient">
            <div className="py-8 px-8 flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-y-8 glass-effect rounded-2xl p-12 shadow-educational-lg max-w-md w-full">
                    <div className="flex flex-col gap-y-3 text-center">
                        <div className="w-16 h-16 bg-primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-educational">
                            <LogInIcon className="w-8 h-8 text-white" />
                        </div>
                        <h6 className="text-2xl font-bold text-educational-primary">Ready to Learn?</h6>
                        <p className="text-muted-foreground">Set up your camera and microphone before joining your AI-powered learning session</p>
                    </div>
                    
                    <div className="w-full">
                        <VideoPreview
                            DisabledVideoPreview={
                                hasPermission ? DisabledVideoPreview : AllowBrowserPermissions
                            }
                        />
                    </div>
                    
                    <div className="flex gap-x-3 justify-center">
                        <ToggleAudioPreviewButton className="hover-lift" />
                        <ToggleVideoPreviewButton className="hover-lift" />
                    </div>
                    
                    <div className="flex gap-x-4 justify-between w-full">
                        <Button variant="outline" className="flex-1 hover-lift">
                            <Link href={"/meetings"}>Cancel</Link>
                        </Button>
                        <Button onClick={onJoin} className="flex-1 bg-primary-gradient hover:opacity-90 hover-lift">
                            <LogInIcon className="w-4 h-4 mr-2" />
                            Join Learning Session
                        </Button> 
                    </div>
                </div>
            </div>
        </div>
    )
}