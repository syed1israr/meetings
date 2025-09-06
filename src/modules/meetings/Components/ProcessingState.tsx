import { Empty_state } from "@/components/Empty_state"




export const ProcessingState = () => {
    return(
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center">
            <Empty_state
            image="/processing.svg"
            title="Meeting Completed"
            description="This meeting was Completed, a summary will appear soon"
            />
         
        </div>
    )
}