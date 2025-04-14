import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { mailtrap} from "@/lib/mailtrap";
import { formatCurrency, formatDate } from "@/lib/format";
import { TRPCError } from "@trpc/server";

function getTemplateVariables(input: any, invoice: any) {
  return {
    toName: input.toName,
    amount: formatCurrency({amount: input.total, currency: input.currency}).formatted,
    fromName: input.fromName,
    sno: input.sno,
    invoiceDate: formatDate(input.date),
    payDate: formatDate(new Date(input.date.getTime() + input.dueDate * 24 * 60 * 60 * 1000)),
    status: input.status,
    toAddress: input.toAddress,
    toEmail: input.toEmail,
    fromAddress: input.fromAddress,
    fromEmail: input.fromEmail,
    items: input.items.map((item: any) => ({
      description: item.description,
      quantity: item.quantity,
      price: formatCurrency({amount: item.price, currency: input.currency}).formatted,
      amount: formatCurrency({amount: item.amount, currency: input.currency}).formatted
    })),
    subtotal: formatCurrency({amount: input.subtotal, currency: input.currency}).formatted,
    discount: input.discount,
    discountAmount: formatCurrency({amount: (input.subtotal * input.discount) / 100, currency: input.currency}).formatted || "0",
    tax: input.tax,
    taxAmount: formatCurrency({amount: ((input.subtotal - (input.subtotal * (input.discount ?? 0) / 100)) * input.tax) / 100, currency: input.currency}).formatted || "0",
    total: formatCurrency({amount: input.total, currency: input.currency}).formatted,
    note: input.note || "",
    invoiceLink: `${process.env.NEXT_PUBLIC_HOME_URL}/api/invoice/${invoice.id}`
  };
}

export const invoiceRouter = createTRPCRouter({
  createInvoice: protectedProcedure
    .input(z.object({
      invoiceName: z.string(),
      sno: z.number(),
      status: z.enum(["PAID", "PENDING", "DRAFT"]),
      currency: z.string(),
      dueDate: z.number(),
      date: z.date(),
      fromName: z.string(),
      fromEmail: z.string().email(),
      fromAddress: z.string(),
      toName: z.string(),
      toEmail: z.string().email(),
      toAddress: z.string(),
      note: z.string().optional(),
      discount: z.number().default(0),
      tax: z.number().default(0),
      subtotal: z.number().default(0),
      total: z.number().default(0),
      items: z.array(z.object({
        description: z.string(),
        quantity: z.number(),
        price: z.number(),
        amount: z.number()
      })),
      invoiceId: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
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
        // Update existing invoice
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
            note: input.note,
            discount: input.discount,
            tax: input.tax,
            subtotal: input.subtotal,
            total: input.total,
            items: {
              deleteMany: {}, // Delete all existing items
              create: input.items.map(item => ({
                description: item.description,
                quantity: item.quantity,
                price: item.price,
                amount: item.amount
              }))
            }
          },
          include: {
            items: true
          }
        });

        const sender = {
          email: "hello@geninvoices.tanmay.space",
          name: invoice.fromName,
        };

        await mailtrap.send({
          from: sender,
          to: [{email: input.toEmail, name: input.toName}],
          template_uuid: process.env.EDIT_INVOICE_TEMPLATE!,
          template_variables: getTemplateVariables(input, invoice)
        }).then(console.log, console.error);
        
        return invoice;
      }

      // Create new invoice
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
          note: input.note,
          discount: input.discount,
          tax: input.tax,
          subtotal: input.subtotal,
          total: input.total,
          userId: user.id,
          items: {
            create: input.items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              price: item.price,
              amount: item.amount
            }))
          }
        },
        include: {
          items: true
        }
      });

      const sender = {
        email: "hello@geninvoices.tanmay.space",
        name: invoice.fromName,
      };
      
      await mailtrap.send({
        from: sender,
        to: [{email: input.toEmail, name: input.toName}],
        template_uuid: process.env.SEND_INVOICE_TEMPLATE!,
        template_variables: getTemplateVariables(input, invoice)
      }).then(console.log, console.error);
      
      return invoice;
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
          userId: user.id,
        },
        select: {
          id: true,
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
          note: true,
          discount: true,
          tax: true,
          subtotal: true,
          total: true,
          items: {
            select: {
              id: true,
              description: true,
              quantity: true,
              price: true,
              amount: true
            }
          }
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
        total: true,
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

