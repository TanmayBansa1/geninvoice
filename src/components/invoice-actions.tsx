import React from 'react'
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu'
import { CheckCircle2, Download, MailCheckIcon, MoreHorizontalIcon, Pencil, Trash } from 'lucide-react'
import { api } from '@/trpc/react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { sendReminder } from '@/lib/actions/send-reminder'
import { toast } from 'sonner'
const InvoiceActions = ({isPaid, invoiceId}: {isPaid: boolean, invoiceId: string}) => {
  const deleteInvoice = api.invoice.deleteInvoice.useMutation();
  const markAsPaid = api.invoice.markAsPaid.useMutation();
  const utils = api.useUtils();
  const router = useRouter();
  return (
    <div>
        <DropdownMenu >
            <DropdownMenuTrigger className='text-right hover:cursor-pointer outline-none focus:ring-0 focus:outline-none'>
                <MoreHorizontalIcon className='size-6 text-right'></MoreHorizontalIcon>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='gap-2 flex flex-col'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild onClick={() => router.push(`/invoices/edit/${invoiceId}`)}>
                    <Button variant={'ghost'} className='p-3 w-full flex items-center justify-start text-left'>
                      <Pencil className="size-4" /> Edit Invoice
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild onClick={() => deleteInvoice.mutate({invoiceId},
                  {
                    onSuccess: () => {
                      toast.success("Invoice deleted successfully");
                      void utils.invoice.getInvoices.invalidate();
                    },
                    onError: (error) => {
                      toast.error("Failed to delete invoice");
                      console.log(error, "Failed to delete invoice");
                    }
                  })}>
                    <Button variant={'ghost'} className='p-3 w-full flex items-center justify-start text-left'>
                      <Trash className="size-4" /> Delete Invoice
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button variant={'ghost'} className='p-3 w-full flex items-center justify-start text-left' onClick={() => window.open(`/api/invoice/${invoiceId}`, '_blank')}>
                      <Download className="size-4" /> Download
                    </Button>
                </DropdownMenuItem>
                {!isPaid && <DropdownMenuItem asChild>
                    <Button variant={'ghost'} className='p-3 w-full flex items-center justify-start text-left' onClick={async () => {
                      toast.promise(sendReminder(invoiceId), {
                        loading: "Sending reminder...",
                        success: "Reminder sent successfully",
                        error: "Failed to send reminder"
                      })
                    }}>
                      <MailCheckIcon className="size-4" /> Send Reminder
                    </Button>
                </DropdownMenuItem>}
                {!isPaid && <DropdownMenuItem asChild onClick={() => markAsPaid.mutate({invoiceId},
                  {
                    onSuccess: () => {
                      toast.success("Invoice marked as paid");
                      void utils.invoice.getInvoices.invalidate();
                    },
                    onError: (error) => {
                      toast.error("Failed to mark invoice as paid");
                      console.log(error, "Failed to mark invoice as paid");
                    }
                  })}>
                    <Button variant={'ghost'} className='p-3 w-full flex items-center justify-start text-left'>
                      <CheckCircle2 className="size-4" /> Paid?
                    </Button>
                </DropdownMenuItem>}
                
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}

export default InvoiceActions