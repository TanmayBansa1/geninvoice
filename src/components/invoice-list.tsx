'use client'
import { api } from '@/trpc/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import InvoiceActions from './invoice-actions'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const InvoiceList = () => {
  const { data: invoices, isLoading } = api.invoice.getInvoices.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-emerald-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="rounded-lg overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-emerald-50/50">
            <TableHead className="text-emerald-900 font-semibold">Invoice</TableHead>
            <TableHead className="text-emerald-900 font-semibold">Customer</TableHead>
            <TableHead className="text-emerald-900 font-semibold">Amount</TableHead>
            <TableHead className="text-emerald-900 font-semibold">Status</TableHead>
            <TableHead className="text-emerald-900 font-semibold">Date</TableHead>
            <TableHead className="text-emerald-900 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.map((invoice) => (
            <motion.tr
              key={invoice.id}
              variants={item}
              className="border-b border-emerald-100/50 hover:bg-emerald-50/30 transition-colors"
            >
              <TableCell className="font-medium text-emerald-900">
                <Link 
                  href={`/api/invoice/${invoice.id}`}
                  target="_blank"
                  className="hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  {invoice.invoiceName}
                </Link>
              </TableCell>
              <TableCell className="text-emerald-800">{invoice.toName}</TableCell>
              <TableCell className="text-emerald-800">
                ${invoice.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={invoice.status === 'PAID' ? 'default' : 'secondary'}
                  className={`${
                    invoice.status === 'PAID'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell className="text-emerald-800">
                {format(new Date(invoice.date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <InvoiceActions invoiceId={invoice.id} isPaid={invoice.status === 'PAID'} />
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export { InvoiceList };