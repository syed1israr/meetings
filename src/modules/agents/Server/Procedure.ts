import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { AgentSchema } from "../Schema/Schema";

export const agentsRouter = createTRPCRouter({
    getMany : protectedProcedure.query(async() => {
        const data = await db.select().from(agents);
        // throw new TRPCError({ code : "INTERNAL_SERVER_ERROR", message: "Failed to fetch agents"});
        return data;
    }),
    getOne : protectedProcedure.input(z.object({ id : z.string()})).query(async({input}) => {
        const data = await db.select().from(agents)
        .where(eq(agents.id,input.id))
        // throw new TRPCError({ code : "INTERNAL_SERVER_ERROR", message: "Failed to fetch agents"});
        return data;
    }),
    
    create: protectedProcedure
    .input(AgentSchema)
    .mutation(async ({ input, ctx }) => {

      const [createdAgent] = await db.insert(agents).values({
        ...input,
        userId: ctx.auth.user.id,
      }).returning();

      return createdAgent;
    }),
})