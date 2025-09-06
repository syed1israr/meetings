import { Empty_state } from "@/components/Empty_state"
import { Button } from "@/components/ui/button"
import { VideoIcon } from "lucide-react"
import Link from "next/link"


interface props{
    meetingId : string,
  
}

export const ActiveState = ({meetingId} : props) => {
    return(
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center">
            <Empty_state
            image="/upcoming.svg"
            title="Meeting is Active"
            description="Meeting will end Once all participants have left"
            />
            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
                   <Button asChild className="w-full lg:w-auto"
                   >
                     <Link href={`/call/${meetingId}`}>
                    <VideoIcon/>
                    join Meeting
                    </Link>
                </Button>
               
            </div>
        </div>
    )
}