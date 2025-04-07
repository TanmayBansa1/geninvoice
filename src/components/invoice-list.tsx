import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import InvoiceActions from './invoice-actions'
import { api } from '@/trpc/react'
import { formatCurrency, formatDate } from '@/lib/format'

const InvoiceList = () => {
  const {data: invoices} = api.invoice.getIvoices.useQuery();
  return (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead >Invoice ID</TableHead>
                <TableHead >Customer</TableHead>
                <TableHead >Amount</TableHead>
                <TableHead >Status</TableHead>
                <TableHead >Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {
                invoices?.map((invoice) => (
                    <TableRow key={invoice.invoiceName}>
                        <TableCell>{invoice.invoiceName}</TableCell>
                        <TableCell>{invoice.toName}</TableCell>
                        <TableCell>{formatCurrency({ amount: invoice.amount, currency: invoice.currency }).formatted}</TableCell>
                        <TableCell>{invoice.status}</TableCell>
                        <TableCell>{formatDate(invoice.date)}</TableCell>
                        <TableCell className="text-right">
                            <InvoiceActions></InvoiceActions>
                        </TableCell>
                    </TableRow>
                ))
            }
        </TableBody>
    </Table>
  )
}

export default InvoiceList