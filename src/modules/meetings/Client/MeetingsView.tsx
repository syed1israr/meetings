'use client'
import DataPagination from '@/components/DataPagination';
import { DataTable } from '@/components/DataTable';
import { Empty_state } from '@/components/Empty_state';
import { Error_state } from '@/components/Error-state';
import { LoadingState } from '@/components/loading-state';
import { useMeetingsFilter } from '@/hooks/Use-Meetings-Filter.';
import { useTRPC } from '@/trpc/Client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { MeetingColums } from '../Components/Columns';

const MeetingsView = () => {
    const trpc = useTRPC();
    const router = useRouter();
    const [filters,setfilters] = useMeetingsFilter();

  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
    ...filters
  }));
  return (
      <div className='flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4'>
      <DataTable
        data={data?.items || []}
        columns={MeetingColums}
        onRowClick={(row)=>router.push(`/meetings/${row.id}`)}
      />
      <DataPagination
      page={filters.page}
      total_pages={data.total_pages}
      onPageChange={(page)=>setfilters({page})}
      />
      {data?.items?.length === 0 && (
        <Empty_state
          title="Create your First Meeting"
          description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time."
        />
      )}
    </div>
  )
}

export default MeetingsView


export const MeetingviewLoading = () => {
    return (
        <LoadingState
            title="Loading Meetings"
            description="this my take few seconds"
        />
    )
}
export const MeetingviewError = () => {
    return (
        <Error_state
            title="Error Loading Meetings"
            description="Something went Wrong"
        />
    )
}
