import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { type Invoice } from "@prisma/client";

export const invoiceRouter = createTRPCRouter({
  createInvoice: protectedProcedure
    .input(z.object({
      invoiceName: z.string(),
      sno: z.number(),
      status: z.enum(["PAID", "PENDING"]),
      currency: z.string(),
      dueDate: z.number(),
      date: z.date(),
      fromName: z.string(),
      fromEmail: z.string().email(),
      fromAddress: z.string(),
      toName: z.string(),
      toEmail: z.string().email(),
      toAddress: z.string(),
      description: z.string(),
      quantity: z.number(),
      rate: z.number(),
      amount: z.number(),
      note: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }): Promise<Invoice> => {
      const invoice = await ctx.db.invoice.create({
        data: {
          invoiceName: input.invoiceName,
          sno: input.sno,
          status: input.status,
          currency: input.currency,
          dueDate: input.dueDate,
          date: input.date,
          fromName: input.fromName,
          fromEmail: input.fromEmail,
          fromAddress: input.fromAddress,
          toName: input.toName,
          toEmail: input.toEmail,
          toAddress: input.toAddress,
          description: input.description,
          quantity: input.quantity,
          rate: input.rate,
          amount: input.amount,
          note: input.note,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      
      return invoice;
    }),
    getIvoices: protectedProcedure.query(async ({ ctx }) => {
      const invoices = await ctx.db.invoice.findMany({
        where: {
          user: {
            id: ctx.session.user.id,
          },
        },
        select: {
          id: true,
          invoiceName: true,
          toName: true,
          amount: true,
          status: true,
          date: true,
          currency: true
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      
      return invoices;
    })
});