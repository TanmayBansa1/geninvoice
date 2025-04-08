'use client'
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import InvoiceActions from './invoice-actions'
import { api } from '@/trpc/react'
import { formatCurrency, formatDate } from '@/lib/format'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const InvoiceList = () => {
  const {data: invoices} = api.invoice.getInvoices.useQuery();
  return (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead >Invoice Name</TableHead>
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
                    <TableRow key={invoice.id}>
                        <TableCell className='cursor-pointer' >
                            <Link target='_blank' href={`/api/invoice/${invoice.id}`}>
                                {invoice.invoiceName}
                            </Link>
                            
                        </TableCell>
                        <TableCell>{invoice.toName}</TableCell>
                        <TableCell>{formatCurrency({ amount: invoice.amount, currency: invoice.currency }).formatted}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            invoice.status === 'PAID' ? 'bg-blue-400' : 'bg-yellow-500'
                          )}>
                            {invoice.status}
                            
                            </Badge>  
                        </TableCell>
                        <TableCell>{formatDate(invoice.date)}</TableCell>
                        <TableCell className="text-right">
                            <InvoiceActions invoiceId={invoice.id} isPaid={invoice.status === "PAID"}></InvoiceActions>
                        </TableCell>
                    </TableRow>
                ))
            }
        </TableBody>
    </Table>
  )
}

export default InvoiceList