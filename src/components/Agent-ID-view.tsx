'use client'
import { Error_state } from "@/components/Error-state";
import { GenerateAvatar } from "@/components/generator";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/Client";

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { UpdateAgentDialog } from "./Update-Agent-Dialog";
import { useConfirm } from "@/hooks/use-confirm";
import AgentIdViewHeader from "./AgentIdViewHeader";
import { Badge } from "./ui/badge";


interface props {
    agentId: string
};

export const AgentIdView = ({ agentId }: props) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId })); 
    const [updateAgentDialogOpen, setupdateAgentDialogOpen] = useState(false)
    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
         onSuccess: async () => {
                    await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                    
                    router.push("/agents");
                },
            onError: (error) =>{
                toast.error(error.message)
            }
        })
    )

    const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    `The following action will remove ${data.meetingCount} associated meeting${data.meetingCount === 1 ? "" : "s"}`
    );

    const handleRemove = async () => {
    const ok = await confirm();
    if (ok) {
        removeAgent.mutate({ id: agentId });
    }
    };



    return (
        <>
        <ConfirmationDialog />
        <UpdateAgentDialog
        open={updateAgentDialogOpen}
        onOpenChange={setupdateAgentDialogOpen}
        initalValues= {data}
        />
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <AgentIdViewHeader
                agentId={agentId}
                agentName={data.name}
                onEdit={() => setupdateAgentDialogOpen(true)}
                onRemove={handleRemove}
            />
            <div className="bg-white rounded-lg border">
                <div className="px-4 py-5 flex flex-col gap-y-5"> 
                    <div className="flex items-center gap-x-3">
                        <GenerateAvatar
                            variant={"botttsNeutral"}
                            seed={data.name}
                            className="size-10"
                        />
                        <h2 className="text-2xl font-medium">{data.name}</h2>
                    </div>
                    {/* This div now contains the badge and instructions, placed below the avatar/name */}
                    <div className="flex flex-col gap-y-4">
                        <Badge variant={"outline"} className="flex items-center gap-x-2 w-fit [&svg]:size-4"> {/* Added w-fit to constrain badge width */}
                            <VideoIcon className="text-blue-700" />
                            {data.meetingCount} {data.meetingCount === 1 ? "Meeting" : "Meetings"}
                        </Badge>
                        <div> {/* This div wraps the instructions to create vertical spacing */}
                            <p className="text-lg font-medium">Instructions</p>
                            <p className="text-neutral-800">{data.instructions}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export const AgentIdviewLoading = () => {
    return (
        <LoadingState
            title="Loading Agent"
            description="this my take few seconds"
        />
    )
}
export const AgentIdviewError = () => {
    return (
        <Error_state
            title="Error Loading Agent"
            description="Something went Wrong"
        />
    )
}