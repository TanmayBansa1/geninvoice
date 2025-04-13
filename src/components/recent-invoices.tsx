import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { formatCurrency, formatDate } from '@/lib/format';
import { Separator } from './ui/separator';

type Props = {
    recentInvoices: {
        invoiceId: string,
        amount: number,
        currency: string,
        date: Date,
        status: "PAID" | "PENDING" | "DRAFT",
        toName: string,
        toEmail: string,
    }[]
}

const RecentInvoices = (props: Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className=' font-bold text-green-700'>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent className='w-full'>
                <div className='flex flex-col gap-4 w-full'>
                    {props.recentInvoices.map((invoice) => (
                        <div key={invoice.invoiceId} className=''>
                            <div>
                                <div className='flex justify-between w-full'>
                                    <Avatar className='mr-2'>
                                        <AvatarFallback>{invoice.toName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col gap-2 my-auto'>
                                        <p className='text-sm font-medium'>{invoice.toName}</p>
                                        <p className='text-sm text-gray-500'>{invoice.toEmail}</p>
                                    </div>
                                    <div className='flex flex-col gap-2 ml-auto my-auto'>
                                        <p className='text-md text-gray-500'>{formatCurrency({ amount: invoice.amount, currency: invoice.currency }).formatted}</p>
                                        <p className='text-xs font-thin text-shadow-muted-foreground'>{formatDate(invoice.date)}</p>
                                    </div>
                                </div>
                                <Separator className='my-2'/>
                            </div>
                        </div>
                    ))}
                </div>

            </CardContent>
        </Card>
    )
}

export default RecentInvoices;
