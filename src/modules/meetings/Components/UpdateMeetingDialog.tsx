
import { ResponsiveDialog } from "@/components/Responsive-dialoge";
import { MeetingGetOne } from "../../types";
import { MeetingForm } from "./Meeting_Form";


interface Props{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues : MeetingGetOne
};


export const UpdateMeetingDialog = ({ open, onOpenChange, initialValues }: Props) => {


  return (
    <ResponsiveDialog
      title="Edit Meeting"
      description="Edit Meeting Details"
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
      onSuccess={()=>{onOpenChange(false)}}
      onCancel={()=>onOpenChange(false)}
      initalValues={initialValues}
      />
    </ResponsiveDialog>
  )
}
