'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { GenerateAvatar } from '@/components/generator'
import { AGENT_TEMPLATES } from '@/modules/agents/templates'
import { useTRPC } from '@/trpc/Client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface AgentTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export const AgentTemplateDialog = ({ open, onOpenChange, onSuccess }: AgentTemplateDialogProps) => {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([])
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const createAgents = useMutation(
    trpc.agents.createMultiple.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
        toast.success(`${selectedTemplates.length} agent(s) created successfully!`)
        setSelectedTemplates([])
        onSuccess?.()
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create agents")
      }
    })
  )

  const handleTemplateToggle = (templateName: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateName) 
        ? prev.filter(name => name !== templateName)
        : [...prev, templateName]
    )
  }

  const handleCreateAgents = () => {
    const templatesToCreate = AGENT_TEMPLATES.filter(template => 
      selectedTemplates.includes(template.name)
    )
    
    createAgents.mutate({
      agents: templatesToCreate.map(template => ({
        name: template.name,
        instructions: template.instructions,
        category: template.category
      }))
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      education: 'bg-blue-100 text-blue-800',
      support: 'bg-green-100 text-green-800',
      interview: 'bg-purple-100 text-purple-800',
      facilitation: 'bg-orange-100 text-orange-800',
      sales: 'bg-pink-100 text-pink-800',
      general: 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.general
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Your Agent Templates</DialogTitle>
          <DialogDescription>
            Select from our pre-configured agent templates to get started quickly. 
            You can customize them later.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {AGENT_TEMPLATES.map((template) => (
            <div
              key={template.name}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedTemplates.includes(template.name)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleTemplateToggle(template.name)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedTemplates.includes(template.name)}
                  onChange={() => handleTemplateToggle(template.name)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <GenerateAvatar
                      seed={template.name}
                      variant="botttsNeutral"
                      className="size-8"
                    />
                    <h4 className="font-medium">{template.name}</h4>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getCategoryColor(template.category)}`}
                  >
                    {template.category}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {template.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {template.instructions}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createAgents.isPending}
          >
            Skip for now
          </Button>
          <Button
            onClick={handleCreateAgents}
            disabled={selectedTemplates.length === 0 || createAgents.isPending}
          >
            {createAgents.isPending 
              ? 'Creating agents...' 
              : `Create ${selectedTemplates.length} agent(s)`
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
