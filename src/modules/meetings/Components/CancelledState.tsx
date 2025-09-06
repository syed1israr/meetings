import { Empty_state } from "@/components/Empty_state"




export const CancelledState = () => {
    return(
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center">
            <Empty_state
            image="/cancelled.svg"
            title="Meeting Cancelled"
            description="This meeting was Cancelled"
            />
         
        </div>
    )
}