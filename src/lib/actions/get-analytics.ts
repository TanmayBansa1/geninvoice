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
        db.invoice.findMany({
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
                amount: true,
                currency: true
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
    const totalRevenue = (usdAmount + inrAmount + eurAmount).toFixed(2)
    
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
        const amountToAdd = curr.currency === 'USD' ? curr.amount : curr.amount / rates[curr.currency]
        acc[date] = (acc[date] || 0) + amountToAdd
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
        totalInvoices: totalInvoices.length,
        totalRevenue,
        chartData: formattedChartData,
        recentInvoices: totalInvoices.slice(0, 10).map((invoice) => ({
            invoiceId: invoice.id,
            amount: invoice.amount,
            currency: invoice.currency,
            date: invoice.date,
            status: invoice.status,
            toName: invoice.toName,
            toEmail: invoice.toEmail,
        }))
    }
}
