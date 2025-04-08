import React from 'react'
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu'
import { CheckCircle2, Download, MailCheckIcon, MoreHorizontalIcon, Pencil, Trash } from 'lucide-react'
import Link from 'next/link'

const InvoiceActions = ({isPaid, invoiceId}: {isPaid: boolean, invoiceId: string}) => {
  return (
    <div>
        <DropdownMenu >
            <DropdownMenuTrigger className='text-right hover:cursor-pointer outline-none focus:ring-0 focus:outline-none'>
                <MoreHorizontalIcon className='size-6 text-right'></MoreHorizontalIcon>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link target='_blank' href={`/invoices/edit/${invoiceId}`} className='p-3'>
                      <Pencil className="size-4" /> Edit Invoice
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={"/edit"} className='p-3'>
                      <Trash className="size-4" /> Delete Invoice
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link target='_blank' href={`/api/invoice/${invoiceId}`} className='p-3'>
                      <Download className="size-4" /> Download
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={"/edit"} className='p-3'>
                      <MailCheckIcon className="size-4" /> Send Reminder
                    </Link>
                </DropdownMenuItem>
                {!isPaid && <DropdownMenuItem asChild>
                    <Link href={"/edit"} className='p-3'>
                      <CheckCircle2 className="size-4" /> Paid?
                    </Link>
                </DropdownMenuItem>}
                
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}

export default InvoiceActions