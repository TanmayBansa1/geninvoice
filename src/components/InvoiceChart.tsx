'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type Props = {
    chartData: {
        date: string,
        amount: number
    }[]
}

const InvoiceChart = (props: Props) => {
  return (
    <Card className=''>
        <CardHeader>
            <CardTitle>Paid Invoices</CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>
                You made $1000 in the last 30 days.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={
{                amount: {
                    label: 'Amount',
                    color: 'lightgreen',
                }}
            } className='min-h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={props.chartData}>
                        <XAxis dataKey="date"></XAxis>
                        <YAxis ></YAxis>
                        <ChartTooltip content={<ChartTooltipContent indicator='line'></ChartTooltipContent>}></ChartTooltip>
                        <Line dataKey="amount" type='monotone' stroke='var(--color-amount)' strokeWidth={2}></Line>
                    </LineChart>
                </ResponsiveContainer>

            </ChartContainer>
        </CardContent>
    </Card>
  )
}

export default InvoiceChart