"use client";

import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { InvoiceForm } from "@/components/invoice-form";
import { Loader2 } from "lucide-react";

type Currency = "USD" | "INR" | "EUR";

export default function EditInvoice() {
  const params = useParams();
  const invoiceId = params.invoiceId as string;

  const { data: invoice, isLoading } = api.invoice.getInvoicebyId.useQuery({invoiceId});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <InvoiceForm initialData={{ ...invoice, currency: invoice.currency as Currency, note: invoice.note || undefined }} />
    </div>
  );
}
