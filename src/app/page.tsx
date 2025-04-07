"use client"
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Geist } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
  const features = [
    'Automated Invoice Generation',
    'Real-time Financial Tracking',
    'Seamless Client Management',
    'Advanced Reporting Tools'
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 overflow-hidden ${geist.className}`}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center"
      >
        <div className="space-y-6">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl font-bold text-gray-900 leading-tight"
          >
            Simplify Your <span className="text-indigo-600">Invoicing</span> Process
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600"
          >
            GenInvoice transforms financial management for modern businesses with intelligent, automated solutions.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-3"
          >
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="text-indigo-600" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex space-x-4"
          >
            <Button 
              onClick={() => window.location.href = '/sign-in'}
              className="bg-indigo-600 hover:bg-indigo-700 transition-all"
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/demo'}
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
            >
              Watch Demo
            </Button>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden md:flex justify-center items-center"
        >
          <Image 
            src="/hero.png" 
            alt="GenInvoice Dashboard" 
            width={500} 
            height={500} 
            className="drop-shadow-xl"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
