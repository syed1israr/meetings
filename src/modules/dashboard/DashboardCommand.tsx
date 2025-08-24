import { CommandResponsiveDialoge, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dispatch, SetStateAction } from 'react';

interface props{
    open ?: boolean;
    setOpen ?:  Dispatch<SetStateAction<boolean>>;
}
const DashboardCommand = ( { open , setOpen }  :props) => {
  return (
    <CommandResponsiveDialoge open={open} onOpenChange={setOpen}>
        <CommandInput
        placeholder='Find an Meeting or Agent'
        />
        <CommandList>
            <CommandItem>
                Agents
            </CommandItem>
        </CommandList>
    </CommandResponsiveDialoge>
  )
}

export default DashboardCommand