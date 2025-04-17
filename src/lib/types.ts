import { z } from "zod";

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  amount: number;
}
export type Currency = "USD" | "INR" | "EUR";
export type Status = "PAID" | "PENDING" | "DRAFT";

export interface InvoiceType {
  id?: string;
  invoiceName: string;
  sno: number;
  status: Status;
  currency: string;
  dueDate: number;
  date: Date;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  note?: string | null;
  discount?: number;
  tax?: number;
  subtotal: number;
  total: number;
  items: InvoiceItem[];
}

export const formSchema = z.object({
  invoiceName: z.string().min(1, "Invoice name is required"),
  sno: z.number().min(1, "Serial number must be positive"),
  status: z.enum(["PAID", "PENDING", "DRAFT"]),
  currency: z.string(),
  dueDate: z.number().min(0, "Due date must be positive"),
  date: z.date(),
  fromName: z.string().min(1, "From name is required"),
  fromEmail: z.string().email("Invalid email address"),
  fromAddress: z.string().min(1, "From address is required"),
  toName: z.string().min(1, "To name is required"),
  toEmail: z.string().email("Invalid email address"),
  toAddress: z.string().min(1, "To address is required"),
  note: z.string().nullable().optional(),
  discount: z.number().min(0, "Discount must be positive").default(0),
  tax: z.number().min(0, "Tax must be positive").default(0),
  subtotal: z.number().min(0, "Subtotal must be positive"),
  total: z.number().min(0, "Total must be positive"),
  items: z.array(z.object({
    description: z.string().min(1, "Description is required"),
    quantity: z.number().min(1, "Quantity must be positive"),
    price: z.number().min(0, "Price must be positive"),
    amount: z.number().min(0, "Amount must be positive"),
  })),
  invoiceId: z.string().optional()
}).refine((data) => {
  if (data.status === "PAID") {
    return true;
  }
  return data.dueDate !== undefined;
}, {
  message: "Due date is required for non-PAID invoices",
  path: ["dueDate"],
});
