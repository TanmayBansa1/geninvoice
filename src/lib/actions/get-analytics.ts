'use server'

import { db } from "@/server/db"
import { auth } from "@clerk/nextjs/server";

export async function getAnalytics() {
    const {userId} = await auth();
    if(!userId){
        throw new Error('Unauthorized');
    }

    // First get the database user
    const dbUser = await db.user.findUnique({
        where: {
            clerkId: userId
        }
    });

    if (!dbUser) {
        throw new Error('User not found in database');
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [usd, inr, eur, paid, pending, totalInvoices, rawChartData] = await Promise.all([
        db.invoice.aggregate({
            _sum:{
                amount: true,
            },
            where:{
                status: 'PAID',
                userId: dbUser.id,
                currency: 'USD',
                date: {
                    gte: thirtyDaysAgo
                }
            },
        }),
        db.invoice.aggregate({
            _sum:{
                amount: true,
            },
            where:{
                status: 'PAID',
                userId: dbUser.id,
                currency: 'INR',
                date: {
                    gte: thirtyDaysAgo
                }
            }
        }),
        db.invoice.aggregate({
            _sum:{
                amount: true,
            },
            where:{
                status: 'PAID',
                userId: dbUser.id,
                currency: 'EUR',
                date: {
                    gte: thirtyDaysAgo
                }
            }
        }),
        db.invoice.count({
            where:{
                status: 'PAID',
                userId: dbUser.id,
                date: {
                    gte: thirtyDaysAgo
                }
            }
        }),
        db.invoice.count({
            where:{
                status: 'PENDING',
                userId: dbUser.id,
                date: {
                    gte: thirtyDaysAgo
                }
            }
        }),
        db.invoice.count({
            where:{
                userId: dbUser.id,
                date: {
                    gte: thirtyDaysAgo
                }
            }
        }),
        db.invoice.findMany({
            where: {
                userId: dbUser.id,
                date: {
                    gte: thirtyDaysAgo
                },
                status: 'PAID'
            },
            orderBy: {
                date: 'asc'
            },
            select: {
                date: true,
                amount: true
            }
        })
    ])

    // Fetch current exchange rates
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
    const data = await response.json()
    const rates = data.rates

    // Calculate total revenue in USD
    const usdAmount = usd._sum?.amount || 0
    const inrAmount = (inr._sum?.amount || 0) / rates.INR
    const eurAmount = (eur._sum?.amount || 0) / rates.EUR
    const totalRevenue = usdAmount + inrAmount + eurAmount
    
    const chartData = rawChartData.reduce((acc: {
        [key: string]: number
    }, curr) => {
        const date = new Date(curr.date).toLocaleDateString("en-US",
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }
        )
        acc[date] = (acc[date] || 0) + curr.amount
        return acc
    }, {})
    
    const formattedChartData = Object.entries(chartData).map(([date, amount]) => ({
        date,
        amount
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(({date, amount}) => ({
        date,
        amount
    }))
    
    return {
        paid,
        pending,
        totalInvoices,
        totalRevenue,
        chartData: formattedChartData
    }
}
