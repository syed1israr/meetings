
import { ResponsiveDialog } from "@/components/Responsive-dialoge";
import { MeetingForm } from "./Meeting_Form";
import { useRouter } from "next/navigation";


interface Props{
    open: boolean;
    onOpenChange: (open: boolean) => void;
};


export const NewMeetingDialog = ({ open, onOpenChange }: Props) => {
  const router = useRouter();

  return (
    <ResponsiveDialog
      title="New Meeting"
      description="Create a new Meeting to automate your tasks."
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
      onSuccess={(id)=>{
        onOpenChange(false);
        router.push(`/meetings/${id}`)
      }}
      onCancel={()=>onOpenChange(false)}
      />
    </ResponsiveDialog>
  )
}
