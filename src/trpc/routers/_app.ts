import { agentsRouter } from '@/modules/agents/Server/Procedure';
import { createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  agents : agentsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;