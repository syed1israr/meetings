"use client"

import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useMeetingsFilter } from '@/hooks/Use-Meetings-Filter.'
import { PlusIcon, XCircleIcon } from 'lucide-react'
import { useState } from 'react'
import Agent_Id_Filter from './Agent_Id_Filter'
import { Meetings_search_filter } from './Meetings_search_filter'
import { NewMeetingDialog } from './NewMeetingDialog'
import { StatusFilter } from './Status_Filter'

const Meeting_List_Headers = () => {
const [isDialog, setisDialog] = useState(false);
const [filters,setfilters] = useMeetingsFilter();

  const isAnyFilterModified = !!filters.status || !!filters.search || !!filters.agentId;
  
  const onClearFilters = () =>{
    setfilters({
      status: null,
      agentId:"",
      search:"",
      page:1
    })
  }

  return (
    <>
     <NewMeetingDialog open={isDialog} onOpenChange={setisDialog}/>
       <div className='py-4 px-4 md:px-8 flex flex-col gap-y-4'>
        <div className='flex items-center justify-between'>
            <h5 className='font-medium text-xl'>My Meetings</h5>
            <Button onClick={()=>setisDialog(true)}><PlusIcon />New Meeting</Button>
        </div>
        <ScrollArea>
           <div className='flex items-center gap-x-2 p-1'>
            <Meetings_search_filter/>
            <StatusFilter/>
            <Agent_Id_Filter/>
            { isAnyFilterModified && (
              <Button variant={"outline"} onClick={onClearFilters} >
                <XCircleIcon className='size-4'/>
                Clear
              </Button>
            )}
        </div>
        Filters
        <ScrollBar orientation={"horizontal"}/>
        </ScrollArea>
      </div>

    </>
  )
}

export default Meeting_List_Headers