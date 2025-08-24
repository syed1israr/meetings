import { z } from 'zod';



export const AgentSchema = z.object({
    name : z.string().min(1, "Name is required"),
    instructions : z.string().min(1, "Instructions are required"),
})




export const AgentUpdateSchema = AgentSchema.extend({
    id : z.string().min(1,{message:"ID is required!"})
})