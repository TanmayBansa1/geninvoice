'use client'

import { motion } from "framer-motion";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'

interface InvoiceChartProps {
  chartData: {
    date: string;
    total: number;
  }[];
  totalRevenue: number;
}

export function InvoiceChart({ chartData, totalRevenue }: InvoiceChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[380px] xl:h-[400px] relative"
    >
      <ChartContainer 
        config={{
          total: {
            label: 'Amount',
            color: '#10b981', // emerald-500
          }
        }} 
        className="min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[330px] xl:min-h-[350px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              stroke="#059669" // emerald-600
              tick={{ fill: "#059669", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#059669"
              tick={{ fill: "#059669", fontSize: 11 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <ChartTooltip 
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line 
              dataKey="total" 
              type="monotone" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ 
                fill: "#10b981",
                strokeWidth: 2,
                r: 3,
                stroke: "#fff"
              }}
              activeDot={{ 
                r: 5, 
                fill: "#059669",
                stroke: "#10b981",
                strokeWidth: 2
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gradient-to-r from-emerald-500/10 to-transparent p-2 sm:p-4 rounded-lg"
      >
        <p className="text-xs sm:text-sm text-emerald-600">Total Revenue</p>
        <p className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-900">
          ${totalRevenue.toLocaleString()}
        </p>
      </motion.div>
    </motion.div>
  );
}