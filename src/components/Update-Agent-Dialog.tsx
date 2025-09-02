import { ResponsiveDialog } from "@/components/Responsive-dialoge";
import Agents_Form from "./Agents_Form";
import { AgentGetOne } from "@/modules/agents/types";




interface Props{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initalValues : AgentGetOne;
};




export const UpdateAgentDialog = ({ open, onOpenChange, initalValues }: Props) => {
    return (
    <ResponsiveDialog
      title="Edit Agent"
      description="Edit Agent Details"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Agents_Form
      onSuccess={() => onOpenChange(false)}
      onCancel={() => onOpenChange(false)}
      initalValues = {initalValues}
      />
    </ResponsiveDialog>
  )
}
