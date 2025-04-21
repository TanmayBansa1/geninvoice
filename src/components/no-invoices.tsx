"use client";
import { FileText } from "lucide-react";

export function NoInvoices() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileText className="w-12 h-12 text-emerald-300 mb-4" />
      <h3 className="text-xl font-semibold text-emerald-900 mb-2">No Invoices Yet</h3>
      <p className="text-emerald-700 mb-4 max-w-xs">
        You haven&apos;t created any invoices yet. Click &quot;Create Invoice&quot; to get started!
      </p>
    </div>
  );
}
