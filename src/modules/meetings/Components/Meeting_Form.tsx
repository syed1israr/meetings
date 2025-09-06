import { useTRPC } from "@/trpc/Client";
import { MeetingGetOne } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {  useForm } from "react-hook-form";
import { meetingInsertSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { NewAgentDialog } from "@/components/newAgentDialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Command_select from "./Command-select";
import { GenerateAvatar } from "@/components/generator";
import { Button } from "@/components/ui/button";
`use client`

interface props {
  onSuccess?: (id?:string) => void;
  onCancel?: () => void;
  initalValues?: MeetingGetOne;
}

export const MeetingForm = ({ onSuccess, onCancel, initalValues }: props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [agentSearch, setagentSearch] = useState("")
  const [openNewAgentDialog, setopenNewAgentDialog] = useState(false)

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize:100,
      search:agentSearch,
    }),
  );



  const form = useForm<z.infer<typeof meetingInsertSchema>>({
    resolver: zodResolver(meetingInsertSchema),
    defaultValues: {
      name: initalValues?.name || "",
      agentId: initalValues?.agentId || "",
    },
  });

  const isEdit = !!initalValues?.id;

  const createMeeting = useMutation(trpc.meetings.create.mutationOptions({
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));

      if( initalValues?.id){
        await queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({ id: initalValues.id }));
      }
      onSuccess?.(data.id);
    },
    
    onError: (error) => {
      toast.error(error.message || "Failed to create meeting");
        if( error.data?.code === "FORBIDDEN" ){
          router.push("/upgrade")
      }
    },
  }));


   const UpdateMeeting = useMutation(trpc.meetings.update.mutationOptions({
       onSuccess: async () => {
         await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
         if( initalValues?.id){
           await queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({ id: initalValues.id }));
         }
         
         onSuccess?.();
       },
       
       onError: (error) => {
         toast.error(error.message || "Failed to update meeting");
       },
     }));



  const onSubmit = (values: z.infer<typeof meetingInsertSchema>) => {
    if (isEdit) {
      UpdateMeeting.mutate({...values,id : initalValues.id})
    } else {
      createMeeting.mutate(values);
    }
  };

  const isPending = createMeeting.isPending || UpdateMeeting.isPending;

  return (
    <>
    <NewAgentDialog
    open={openNewAgentDialog}
    onOpenChange={setopenNewAgentDialog}
    />
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      

        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Medical Consultation " />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          name="agentId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent</FormLabel>
              <FormControl>
               <Command_select
               options={(agents.data?.items || []).map((ag)=>({
                id : ag.id,
                value : ag.id,
                children : (
                  <div className="flex items-center gap-x-2">
                    <GenerateAvatar
                    seed={ag.name}
                    variant="botttsNeutral"
                    className="border size-6"
                    />
                    <span>{ag.name}</span>
                  </div>
                )
               }))}
               onSelect={field.onChange}
               onSearch={setagentSearch}
               value={field.value}
               placeholder="Select an Agent"
               />
              </FormControl>
              <FormDescription>
                Not Found What you&apos; re looking for ? {" "}
                <button
                type="button"
                className="text-primary hover:underline"
                onClick={()=>setopenNewAgentDialog(true)}
                > Create new Agent</button>
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />

    
        <div className="flex justify-between gap-x-2">
          { onCancel && (
            <Button 
            variant={"ghost"}
            disabled={isPending}
            type="button"
            onClick={()=>onCancel()}
            > Cancel </Button>
          )}
          <Button disabled={isPending} type="submit">
            { isEdit ? "Update Meeting" : "Create Meeting" }
          </Button>
        </div>
        {/* <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isEdit ? "Update Agent" : "Create Agent"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div> */}
      </form>
    </Form>


    </>
  );
};





