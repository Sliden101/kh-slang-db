
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const slangRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.slangMessage.findMany({
        select: {
          name: true,
          messageSlang: true,
          messageTranslated: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),
  postMessage: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        messageSlang: z.string(),
        messageTranslated: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.slangMessage.create({
          data: {
            name: input.name,
            messageSlang: input.messageSlang,
            messageTranslated: input.messageTranslated,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});