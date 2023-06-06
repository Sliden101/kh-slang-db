import { createTRPCRouter } from "./trpc";
import { slangRouter } from "./routers/slang";

export const appRouter = createTRPCRouter({
  slang: slangRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;