import { z } from "zod";
import { type User } from "@prisma/client";  // Add this import
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
    me: protectedProcedure.query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      return user;
    }),
    onBoardProfile: protectedProcedure
      .input(z.object({
        name: z.string().min(2),
        address: z.string().min(5),
      }))
      .mutation(async ({ ctx, input }): Promise<User> => {  // Add explicit return type
        const user = await ctx.db.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            name: input.name,
            address: input.address,
          },
        });
        
        return user;
      }),
  });