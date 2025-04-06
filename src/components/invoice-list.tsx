import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import InvoiceActions from './invoice-actions'

const InvoiceList = () => {
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
            <TableRow>
                <TableCell>#1</TableCell>
                <TableCell>Alex Rodgers</TableCell>
                <TableCell>3500</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>12.01.2025</TableCell>
                <TableCell className="text-right">
                    <InvoiceActions></InvoiceActions>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
  )
}

export default InvoiceList