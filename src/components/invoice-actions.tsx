import React from 'react'
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu'
import { MoreHorizontalIcon } from 'lucide-react'
import Link from 'next/link'

const InvoiceActions = () => {
  return (
    <div>
        <DropdownMenu>
            <DropdownMenuTrigger className='text-right hover:cursor-pointer'>
                <MoreHorizontalIcon className='size-6 text-right'></MoreHorizontalIcon>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem className='text-right'>
                    <Link href={"/edit"}>
                    Edit Invoice
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}

export default InvoiceActions