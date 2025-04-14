'use client'
import { InvoiceList } from '@/components/invoice-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState } from 'react'

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

const InvoicePage = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-white rounded-t-xl">
            <div className="flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CardTitle>
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center"
                    >
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </motion.div>
                    <div>
                      <h1 className="text-2xl font-bold text-emerald-900">Invoices</h1>
                      <p className="text-emerald-600 text-sm mt-1">Manage your invoices right here</p>
                    </div>
                  </div>
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <Button 
                  onClick={() => router.push("/invoices/create")}
                  className="cursor-pointer bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <motion.div
                    animate={{ rotate: isHovered ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="mr-2"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.div>
                  <span className="font-mediumr">Create Invoice</span>
                </Button>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <InvoiceList />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default InvoicePage