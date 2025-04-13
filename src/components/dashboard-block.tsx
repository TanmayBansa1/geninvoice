import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DollarSignIcon, Plus } from 'lucide-react';

type Props = {
    title: string;
    description: string;
    data:string | number;
    isDollar?: boolean;
}

const DashboardBlock = (props: Props) => {
  return (
    <div className='w-full p-3'>
        <Card>
            <CardHeader>
                <CardTitle className='text-xl font-bold'>{props.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <h2 className='text-xl font-semibold flex items-center'>
                    {props.isDollar ? <DollarSignIcon className='w-4 h-4' /> : <Plus className='w-4 h-4' />}
                    {props.data}
                </h2>
                <p className='text-xs text-muted-foreground'>{props.description}</p>
            </CardContent>
        </Card>
    </div>
  )
}

export default DashboardBlock