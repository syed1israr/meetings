import { ResponsiveDialog } from "@/components/Responsive-dialoge";
import Agents_Form from "./Agents_Form";




interface Props{
    open: boolean;
    onOpenChange: (open: boolean) => void;
};


export const NewAgentDialog = ({ open, onOpenChange }: Props) => {
  return (
    <ResponsiveDialog
      title="New Agent"
      description="Create a new agent to be in tandem with you."
      open={open}
      onOpenChange={onOpenChange}
    >
      <Agents_Form
      onSuccess={() => onOpenChange(false)}
      onCancel={() => onOpenChange(false)}
      
      />
    </ResponsiveDialog>
  )
}
