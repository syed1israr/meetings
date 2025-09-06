import { cn } from '@/lib/utils';
import { ChevronsUpDownIcon } from 'lucide-react';
import { ReactNode, useState } from 'react';

import { CommandEmpty, CommandInput, CommandItem, CommandList, CommandResponsiveDialoge } from '@/components/ui/command';
import { Button } from '@/components/ui/button';



interface props {
    options : Array<{
        id : string;
        value : string;
        children : ReactNode;
    }>;
    onSelect : ( value : string) => void;
    onSearch ?: ( value : string) => void;
    value : string;
    placeholder ?: string;
    isSearchable ?: boolean;
    className ?: string;
}

const Command_select = ({ 
options,
onSelect,
onSearch,
value,
placeholder = "Select an option",

className

} : props) => {
    const [open,setopen] = useState(false);
    const selectOptions = options.find((op) => op.value == value);
    const handleOpenChange = (value : boolean) =>{
        onSearch?.("");
        setopen(value)
    }
  return (
    <>
    <Button
    onClick={()=>setopen(true)}
    type='button'
    variant={"outline"}
    className={cn(
        "h-9 justify-between font-normal px-2",
        !selectOptions && "text-muted-foreground",
        className
    )}
    >
        <div>
            { selectOptions?.children ?? placeholder}
        </div>
        <ChevronsUpDownIcon/>
    </Button>
    <CommandResponsiveDialoge
    shouldFilter={!onSearch}
    open={open}
    onOpenChange={handleOpenChange}
    >
        <CommandInput
        placeholder='Search...'
        onValueChange={onSearch}
        />
        <CommandList>
            <CommandEmpty className='text-muted-foreground'>
                <span> No Options Found..</span>
            </CommandEmpty>
            { options.map((op)=>(
                    <CommandItem
                    key={op.id}
                    onSelect={()=>{
                        onSelect(op.value)
                        setopen(false)
                    }}
                    >
                    {op.children}
                    </CommandItem>
            ))}
        </CommandList>
    </CommandResponsiveDialoge>
    </>
  )
}

export default Command_select