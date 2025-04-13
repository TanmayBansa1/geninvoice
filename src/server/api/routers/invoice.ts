import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { type Invoice } from "@prisma/client";
import { mailtrap} from "@/lib/mailtrap";
import { formatCurrency, formatDate } from "@/lib/format";
import { TRPCError } from "@trpc/server";



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
      invoiceId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }): Promise<Invoice> => {
      // First get the user's database ID
      const user = await ctx.db.user.findUnique({
        where: {
          clerkId: ctx.userId,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if(input.invoiceId){
        const invoice = await ctx.db.invoice.update({
          where: {
            id: input.invoiceId,
          },
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
          },
        });
        const sender = {
          email: "hello@geninvoices.tanmay.space",
          name: invoice.fromName,
        };

        await mailtrap.send({
          from: sender,
          to: [{email: input.toEmail, name: input.toName}],
          template_uuid: process.env.EDIT_INVOICE_TEMPLATE!,
          template_variables: {
            "toName": input.toName,
            "amount": formatCurrency({amount: input.amount, currency: input.currency}).formatted,
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
      } else {
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
            userId: user.id, // Use the database ID
          },
        });
        const sender = {
          email: "hello@geninvoices.tanmay.space",
          name: invoice.fromName,
        };
        
        await mailtrap.send({
          from: sender,
          to: [{email: input.toEmail, name: input.toName}],
          template_uuid: process.env.SEND_INVOICE_TEMPLATE!,
          template_variables: {
            "toName": input.toName,
            "amount": formatCurrency({amount: input.amount, currency: input.currency}).formatted,
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
      }
    }),
    
    getInvoices: protectedProcedure.query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          clerkId: ctx.userId,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const invoices = await ctx.db.invoice.findMany({
        where: {
          userId: user.id,
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
    
    getInvoicebyId: protectedProcedure
      .input(z.object({invoiceId: z.string()}))
      .query(async ({ ctx, input }) => {
        const user = await ctx.db.user.findUnique({
          where: {
            clerkId: ctx.userId,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const invoice = await ctx.db.invoice.findFirst({
          where: {
            id: input.invoiceId,
            userId: user.id, // Ensure the invoice belongs to the user
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
        
        if (!invoice) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invoice not found",
          });
        }

        return invoice;
      }),
      deleteInvoice: protectedProcedure.input(z.object({invoiceId: z.string()})).mutation(async ({ctx, input}) => {
        const user = await ctx.db.user.findUnique({
          where: {
            clerkId: ctx.userId,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        await ctx.db.invoice.delete({
          where: {
            id: input.invoiceId,
            userId: user.id,
          },
        });

      }),
      markAsPaid: protectedProcedure.input(z.object({invoiceId: z.string()})).mutation(async ({ctx, input}) => {
        const user = await ctx.db.user.findUnique({
          where: {
            clerkId: ctx.userId,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        await ctx.db.invoice.update({
          where: {
            id: input.invoiceId,
            userId: user.id,
          },
          data: {
            status: "PAID",
          },
        });
        
      }),
});

