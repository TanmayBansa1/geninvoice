'use client';

import { DashboardBlock } from "@/components/dashboard-block";
import { InvoiceChart } from "@/components/InvoiceChart";
import { RecentInvoices } from "@/components/recent-invoices";
import { getAnalytics } from "@/lib/actions/get-analytics";
import { syncUser } from "@/lib/actions/sync-user";
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
    chartData: { date: string; total: number; }[];
    recentInvoices: any[];
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // First, sync the user to ensure they exist in the database
        console.log("Starting user sync process...");
        const user = await syncUser();
        console.log("User synced successfully:", user?.email);
        
        // Then fetch analytics
        console.log("Fetching analytics...");
        const data = await getAnalytics();
        setAnalytics(data);
        console.log("Analytics loaded successfully");
      } catch (error) {
        console.error("Error initializing dashboard:", error);
        setSyncError(error instanceof Error ? error.message : "Failed to sync user");
        
        // If sync fails, still try to load analytics
        try {
          console.log("Attempting to load analytics despite sync error...");
          const data = await getAnalytics();
          setAnalytics(data);
        } catch (analyticsError) {
          console.error("Error loading analytics:", analyticsError);
        }
      } finally {
        setIsSyncing(false);
      }
    };

    initializeDashboard();
  }, []);

  if (isSyncing) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-emerald-600">Setting up your dashboard...</p>
        </div>
      </div>
    );
  }

  if (syncError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Error setting up your account</p>
          <p className="text-gray-600 text-sm">{syncError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const { paid, pending, totalInvoices, totalRevenue, chartData, recentInvoices } = analytics;
  
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-emerald-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-emerald-600">Welcome back! Here's your business overview</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center sm:text-left"
        >
          <span className="font-medium text-sm sm:text-base">Last 30 Days</span>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
      >
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
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 xl:grid-cols-3 w-full"
      >
        <motion.div 
          variants={item}
          className="xl:col-span-2 bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow w-full"
        >
          <h2 className="text-base sm:text-lg font-semibold text-emerald-900 mb-4">Revenue Overview</h2>
          <InvoiceChart chartData={chartData} totalRevenue={Number(totalRevenue)} />
        </motion.div>
        
        <motion.div 
          variants={item}
          className="xl:col-span-1 bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow w-full"
        >
          <h2 className="text-base sm:text-lg font-semibold text-emerald-900 mb-4">Recent Invoices</h2>
          <RecentInvoices recentInvoices={recentInvoices} />
        </motion.div>
      </motion.div>
    </div>
  );
}