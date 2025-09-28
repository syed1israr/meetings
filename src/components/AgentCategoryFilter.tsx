'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AgentCategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'education', label: 'Education' },
  { value: 'support', label: 'Support' },
  { value: 'interview', label: 'Interview' },
  { value: 'facilitation', label: 'Facilitation' },
  { value: 'sales', label: 'Sales' },
  { value: 'general', label: 'General' }
]

const getCategoryColor = (category: string) => {
  const colors = {
    education: 'bg-blue-100 text-blue-800 border-blue-200',
    support: 'bg-green-100 text-green-800 border-green-200',
    interview: 'bg-purple-100 text-purple-800 border-purple-200',
    facilitation: 'bg-orange-100 text-orange-800 border-orange-200',
    sales: 'bg-pink-100 text-pink-800 border-pink-200',
    general: 'bg-gray-100 text-gray-800 border-gray-200'
  }
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export const AgentCategoryFilter = ({ selectedCategory, onCategoryChange }: AgentCategoryFilterProps) => {
  const selectedCategoryData = categories.find(cat => cat.value === selectedCategory)
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between min-w-[140px]">
          {selectedCategoryData?.label || 'All Categories'}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="p-2">
          {categories.map((category) => (
            <button
              key={category.value}
              className={cn(
                "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
                selectedCategory === category.value && "bg-accent"
              )}
              onClick={() => onCategoryChange(category.value)}
            >
              <div className="flex items-center gap-2">
                {category.value && (
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getCategoryColor(category.value))}
                  >
                    {category.label}
                  </Badge>
                )}
                {!category.value && <span>{category.label}</span>}
              </div>
              {selectedCategory === category.value && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
