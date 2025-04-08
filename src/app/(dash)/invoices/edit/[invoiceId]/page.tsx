'use client'
import InvoiceForm, { invoiceSchema } from "@/components/invoice-form";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import type { z } from "zod";


export default function EditInvoice() {
    const params = useParams();
    const invoiceId = params.invoiceId as string;
    const {data: invoice} = api.invoice.getInvoicebyId.useQuery({invoiceId});
  return <InvoiceForm bill={invoice as z.infer<typeof invoiceSchema>} invoiceId={invoiceId} />;
}
