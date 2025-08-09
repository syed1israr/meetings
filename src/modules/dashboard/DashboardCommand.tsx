import { CommandDialog, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import React, { Dispatch, SetStateAction } from 'react'

interface props{
    open ?: boolean;
    setOpen ?:  Dispatch<SetStateAction<boolean>>;
}
const DashboardCommand = ( { open , setOpen }  :props) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
        placeholder='Find an Meeting or Agent'
        />
        <CommandList>
            <CommandItem>
                Agents
            </CommandItem>
        </CommandList>
    </CommandDialog>
  )
}

export default DashboardCommand