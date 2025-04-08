import InvoiceForm, { invoiceSchema } from "@/components/invoice-form";
import { api } from "@/trpc/react";
import type { z } from "zod";

type params = Promise<{invoiceId: string}>

export default async function EditInvoice({params}: {params: params}) {
    const {invoiceId} = await params;
    const {data: invoice} = api.invoice.getInvoicebyId.useQuery({invoiceId});
  return <InvoiceForm bill={invoice as z.infer<typeof invoiceSchema>} />;
}
