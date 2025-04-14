'use client';

import { DashboardBlock } from "@/components/dashboard-block";
import { InvoiceChart } from "@/components/InvoiceChart";
import { RecentInvoices } from "@/components/recent-invoices";
import { getAnalytics } from "@/lib/actions/get-analytics";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<{
    paid: number;
    pending: number;
    totalInvoices: number;
    totalRevenue: string;
    chartData: { date: string; amount: number; }[];
    recentInvoices: any[];
  } | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const data = await getAnalytics();
      setAnalytics(data);
    };
    fetchAnalytics();
  }, []);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const { paid, pending, totalInvoices, totalRevenue, chartData, recentInvoices } = analytics;
  
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">Dashboard</h1>
          <p className="text-emerald-600">Welcome back! Here's your business overview</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <span className="font-medium">Last 30 Days</span>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <motion.div variants={item} className="col-span-full md:col-span-2 lg:col-span-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <DashboardBlock 
                isDollar 
                icon="dollar"
                data={Number(totalRevenue)} 
                title="Total Revenue" 
                description={`You made $${totalRevenue} in the last 30 days.`} 
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <DashboardBlock 
                icon="file"
                data={Number(totalInvoices)} 
                title="New Invoices" 
                description={`You have ${totalInvoices} new invoices this month.`} 
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <DashboardBlock 
                icon="check"
                data={Number(paid)} 
                title="Paid Invoices" 
                description={`You have ${paid} paid invoices this month.`} 
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <DashboardBlock 
                icon="clock"
                data={Number(pending)} 
                title="Open Invoices" 
                description={`You have ${pending} pending invoices this month.`} 
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 lg:grid-cols-3 md:gap-8"
      >
        <motion.div 
          variants={item}
          className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <h2 className="text-lg font-semibold text-emerald-900 mb-4">Revenue Overview</h2>
          <InvoiceChart chartData={chartData} totalRevenue={Number(totalRevenue)} />
        </motion.div>
        
        <motion.div 
          variants={item}
          className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <h2 className="text-lg font-semibold text-emerald-900 mb-4">Recent Invoices</h2>
          <RecentInvoices recentInvoices={recentInvoices} />
        </motion.div>
      </motion.div>
    </div>
  );
}