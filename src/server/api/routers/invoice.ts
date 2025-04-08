import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { type Invoice } from "@prisma/client";
import { mailtrap, sender } from "@/lib/mailtrap";
import { formatDate } from "@/lib/format";

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

      await mailtrap.send({
        from: sender,
        to: [{email: input.toEmail, name: input.toName}],
        template_uuid: process.env.SEND_INVOICE_TEMPLATE!,
        template_variables: {
          "toName": input.toName,
          "amount": input.amount,
          "fromName": input.fromName,
          "sno": input.sno,
          "invoiceDate": formatDate(input.date),
          "payDate": formatDate(new Date(input.date.getTime() + input.dueDate * 24 * 60 * 60 * 1000)),
          "status": input.status,
          "toAddress": input.toAddress,
          "toEmail": input.toEmail,
          "fromAddress": input.fromAddress,
          "fromEmail": input.fromEmail,
          "description": input.description,
        "invoiceLink": `${process.env.NEXT_PUBLIC_HOME_URL}/api/invoice/${invoice.id}`
        }
      }).then(console.log, console.error);
        
      
      return invoice;
    }),
    getInvoices: protectedProcedure.query(async ({ ctx }) => {
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
    }),
    getInvoicebyId: protectedProcedure.input(z.object({invoiceId: z.string()})).query(async ({ ctx, input }) => {
      const invoice = await ctx.db.invoice.findUnique({
        where: {
          id: input.invoiceId,
        },
        select: {
          sno: true,
          invoiceName: true,
          status: true,
          currency: true,
          dueDate: true,
          date: true,
          fromName: true,
          fromEmail: true,
          fromAddress: true,
          toName: true,
          toEmail: true,
          toAddress: true,
          description: true,
          quantity: true,
          rate: true,
          amount: true,
          note: true
        }
      });
      
      return invoice;
    })
});