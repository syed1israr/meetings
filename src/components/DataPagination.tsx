import { Button } from '@/components/ui/button';
import React from 'react'



interface props{
    page:number;
    total_pages:number;
    onPageChange : (page : number) => void;
}


const DataPagination = ({page,total_pages,onPageChange}:props) => {
  return (
    <div className='flex items-center justify-between'>
        <div className='flex-1 text-sm text-muted-foreground'>
            page {page} of {total_pages || 1}
        </div>
        <div className="flex items-center justify-end space-x-2 py-4" >
            <Button
            disabled={page === 1}
            variant={"outline"}
            size={"sm"}
            onClick={()=> onPageChange(Math.max(1,page-1))}

            >
                Previous
            </Button>
            <Button
            disabled={page === total_pages || total_pages === 0}
            variant={"outline"}
            size={"sm"}
            onClick={()=> onPageChange(Math.min(total_pages,page+1))}
            >
                Next
            </Button>
        </div>
    </div>
  )
}

export default DataPagination