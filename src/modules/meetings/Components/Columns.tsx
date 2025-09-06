"use client"

import { GenerateAvatar } from "@/components/generator"
import { Badge } from "@/components/ui/badge"
import { cn, formatDuration } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { CircleCheckIcon, CircleXIcon, ClockArrowUp, ClockFadingIcon, CornerDownRightIcon, LoaderIcon } from "lucide-react"
import { MeetingGetMany } from "../types"


const statusIconMap = {
    upcoming : ClockArrowUp,
    active : LoaderIcon,
    completed : CircleCheckIcon,
    processing : LoaderIcon,
    cancelled  : CircleXIcon
}


const statusColorMap = {
    upcoming : "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
    active : "bg-blue-500/20 text-blue-800 border-blue-800/5",
    completed : "bg-emarld-500/20 text-emarld-800 border-emarld-800/5",
    cancelled : "bg-rose-500 text-rose-800 border-rose-800/5",
    processing  : "bg-gray-300/20 text-gray-800 border-gray-800/5"
};


export const MeetingColums: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
    <div className="flex flex-col gap-y-1">
        <span className="font-semibold capitalize">{ row.original.name}</span>
      {/* <div className="flex items-center gap-x-2">
        <GenerateAvatar
          variant="botttsNeutral"
          seed={row.original.name}
          className="size-6"
        />
        <span className="font-semibold capitalize">{row.original.name}</span>
      </div> */}
      
        <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-x-1">
   <CornerDownRightIcon className="size-3 text-muted-foreground"/>
        <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
          {row.original.agent.instructions || "No instructions provided"}
        </span>
            </div>
          <GenerateAvatar
          variant="botttsNeutral"
          seed={row.original.name}
          className="size-6"
        />
        <span className="text-sm text-muted-foreground">{ row.original.startedAt ? format(row.original.startedAt, "MM/d") : " "}</span>
        </div>
      
  </div>
)
  },
  {
    accessorKey: "status",
    header: "status",
    cell: ({ row }) => {
      const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap];
      return (
        <Badge 
        variant={"outline"}
        className={cn(
            "capitalize [&svg]:size-4 text-muted-foreground",
            statusColorMap[row.original.status as keyof typeof statusColorMap]
        )}>
       < Icon className={cn(
        row.original.status === "processing" && "animate-spin"
       )} />
          <span className="capitalize">{row.original.status}</span>
        </Badge>
      );
    }
  },
  {
    accessorKey : "duration",
    header : "duration",
    cell : ({row})=> (
        <Badge
        variant={"outline"}
        className={cn(
            "capitalize [&svg]:size-4 flex items-center gap-x-2")}
        >
            <ClockFadingIcon className="text-blue-700 "/>
            { row.original.duration > 0  ? formatDuration(row.original.duration) : "No Duration"}
        </Badge>
    )
  
}
  
]
