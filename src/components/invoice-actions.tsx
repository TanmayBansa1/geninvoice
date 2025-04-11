import React from 'react'
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu'
import { CheckCircle2, Download, MailCheckIcon, MoreHorizontalIcon, Pencil, Trash } from 'lucide-react'
import Link from 'next/link'
import { api } from '@/trpc/react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
const InvoiceActions = ({isPaid, invoiceId}: {isPaid: boolean, invoiceId: string}) => {
  const deleteInvoice = api.invoice.deleteInvoice.useMutation();
  const router = useRouter();
  return (
    <div>
        <DropdownMenu >
            <DropdownMenuTrigger className='text-right hover:cursor-pointer outline-none focus:ring-0 focus:outline-none'>
                <MoreHorizontalIcon className='size-6 text-right'></MoreHorizontalIcon>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild onClick={() => router.push(`/invoices/edit/${invoiceId}`)}>
                    <Button  className='p-3'>
                      <Pencil className="size-4" /> Edit Invoice
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild onClick={() => deleteInvoice.mutate({invoiceId})}>
                    <Button variant={'link'} className='p-3'>
                      <Trash className="size-4" /> Delete Invoice
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button variant={'link'} className='p-3' onClick={() => window.open(`/api/invoice/${invoiceId}`, '_blank')}>
                      <Download className="size-4" /> Download
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button variant={'link'} className='p-3' onClick={() => window.open(`/edit`, '_blank')}>
                      <MailCheckIcon className="size-4" /> Send Reminder
                    </Button>
                </DropdownMenuItem>
                {!isPaid && <DropdownMenuItem asChild>
                    <Button variant={'link'} className='p-3' onClick={() => window.open(`/edit`, '_blank')}>
                      <CheckCircle2 className="size-4" /> Paid?
                    </Button>
                </DropdownMenuItem>}
                
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}

export default InvoiceActions