import { z } from "zod";
import { type User } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
    me: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return ctx.user;
    }),
    onBoardProfile: protectedProcedure
      .input(z.object({
        name: z.string().min(2),
        address: z.string().min(5),
      }))
      .mutation(async ({ ctx, input }): Promise<User> => {
        if (!ctx.user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const updatedUser = await ctx.db.user.update({
          where: {
            id: ctx.user.id,
          },
          data: {
            name: input.name,
            address: input.address,
          },
        });
        
        return updatedUser;
      }),
  });