"use client"

import { GenerateAvatar } from "@/components/generator"
import { Badge } from "@/components/ui/badge"
import { AgentGetMany } from "@/modules/agents/types"
import { ColumnDef } from "@tanstack/react-table"
import { CornerDownRightIcon, VideoIcon } from "lucide-react"





const getCategoryColor = (category: string) => {
  const colors = {
    education: 'bg-blue-100 text-blue-800 border-blue-200',
    support: 'bg-green-100 text-green-800 border-green-200',
    interview: 'bg-purple-100 text-purple-800 border-purple-200',
    facilitation: 'bg-orange-100 text-orange-800 border-orange-200',
    sales: 'bg-pink-100 text-pink-800 border-pink-200',
    general: 'bg-gray-100 text-gray-800 border-gray-200'
  }
  return colors[category as keyof typeof colors] || colors.general
}

export const columns: ColumnDef<AgentGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center gap-x-2">
        <GenerateAvatar
          variant="botttsNeutral"
          seed={row.original.name}
          className="size-6"
        />
        <span className="font-semibold capitalize">{row.original.name}</span>
      </div>
      
        <div className="flex items-center gap-x-1.5">
        <CornerDownRightIcon className="size-3 text-muted-foreground"/>
        <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
          {row.original.instructions || "No instructions provided"}
        </span>
        </div>
      
  </div>
)
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge 
        variant="outline" 
        className={`${getCategoryColor(row.original.category)} capitalize`}
      >
        {row.original.category}
      </Badge>
    )
  },
  {
    accessorKey: "meetingCount",
    header: "Meetings",
    cell: ({ row }) => (
      <Badge variant={"outline"} className="flex items-center gap-x-2 [&>svg]:size-4">
        <VideoIcon className="text-blue-700"/>
       { row.original.meetingCount || 0 } { row.original.meetingCount === 1 ? "Meeting" : "Meetings" }
        
      </Badge>

    )
  }
  
]