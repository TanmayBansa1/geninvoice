'use client'

import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { formatCurrency, formatDate } from '@/lib/format';

interface RecentInvoicesProps {
  recentInvoices: {
    invoiceId: string;
    toName: string;
    toEmail: string;
    amount: number;
    currency: string;
    status: "PAID" | "PENDING" | "DRAFT";
    date: Date;
  }[];
}

const RecentInvoices = ({ recentInvoices }: RecentInvoicesProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {recentInvoices.map((invoice, index) => (
        <motion.div
          key={invoice.invoiceId}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-emerald-900">{invoice.toName}</h3>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {invoice.status === "PAID" && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              )}
              {invoice.status === "PENDING" && (
                <Clock className="w-5 h-5 text-amber-500" />
              )}
              {invoice.status === "DRAFT" && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </motion.div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-emerald-600">
              {formatCurrency({ amount: invoice.amount, currency: invoice.currency }).formatted}
            </p>
            <p className="text-xs text-emerald-500">{formatDate(invoice.date)}</p>
          </div>
          
          <motion.div
            className="mt-2 h-1 bg-emerald-100 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export { RecentInvoices };
