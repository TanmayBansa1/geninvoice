'use client'

import { motion } from "framer-motion";
import { DollarSign, FileText, CheckCircle2, Clock } from "lucide-react";

interface DashboardBlockProps {
  data: number;
  title: string;
  description: string;
  isDollar?: boolean;
  icon?: 'dollar' | 'file' | 'check' | 'clock';
}

export function DashboardBlock({ data, title, description, isDollar, icon = 'dollar' }: DashboardBlockProps) {
  const getIcon = () => {
    switch (icon) {
      case 'dollar':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'file':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'check':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'clock':
        return <Clock className="w-4 h-4 text-emerald-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow h-[180px] flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-emerald-600">{title}</h3>
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"
        >
          {getIcon()}
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-grow"
      >
        <p className="text-3xl font-bold text-emerald-900 mb-2">
          {isDollar ? `$${data.toLocaleString()}` : data.toLocaleString()}
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-emerald-600"
      >
        {description}
      </motion.p>
    </motion.div>
  );
}