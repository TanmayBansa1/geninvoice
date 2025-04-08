'use client'
import InvoiceList from '@/components/invoice-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const InvoicePage = () => {
  const router = useRouter();
  return (
    <div>
      <Card>
        <CardHeader>
          <div className='flex justify-between'>

          <CardTitle>
            <p  className='text-2xl font-bold'>
              Invoices
            </p>
            <p className='text-muted-foreground text-sm mt-3'>Manage your invoices right here</p>
          </CardTitle>
          <Button onClick={() => {
            router.push("/invoices/create");
          }} className=' cursor-pointer bg-green-400 text-xl rounded-md hover:bg-green-600 hover:scale-105 transition-all duration-300' variant="outline">
            <Plus></Plus>   Create Invoice
          </Button>
          </div>
        </CardHeader>
        <CardContent>
          <InvoiceList></InvoiceList>
        </CardContent>

      </Card>
    </div>
  )
}

export default InvoicePage