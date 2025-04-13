"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart, Zap, Shield, Clock, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"

interface TypewriterProps {
  words: string[]
  delay?: number
}

const Typewriter = ({ words, delay = 2000 }: TypewriterProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = words[currentWordIndex]
    if (!word) return

    let timeout: NodeJS.Timeout

    if (isDeleting) {
      timeout = setTimeout(() => {
        setCurrentText(word.substring(0, currentText.length - 1))
      }, 50)
    } else {
      timeout = setTimeout(() => {
        setCurrentText(word.substring(0, currentText.length + 1))
      }, 100)
    }

    if (!isDeleting && currentText === word) {
      timeout = setTimeout(() => setIsDeleting(true), delay)
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false)
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex, words, delay])

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

const features = [
  {
    icon: <BarChart className="w-6 h-6" />,
    title: "Smart Analytics",
    description: "Real-time insights into your business finances"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Generate professional invoices in seconds"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Bank-Grade Security",
    description: "Your data is protected with enterprise security"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Time-Saving",
    description: "Automate your entire invoicing workflow"
  }
]

export default function Home() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-emerald-50 via-emerald-100 to-teal-100 overflow-hidden relative">
      {/* Soft Background Gradient Animation */}
      <motion.div 
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-teal-100 to-emerald-50 bg-[length:200%_200%] opacity-30 z-0"
      />

      {/* Hero Section with Fluid Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 to-teal-100/20 blur-3xl"
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 50, 
              damping: 10,
              duration: 1 
            }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 10 
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/70 backdrop-blur-sm text-emerald-700 mb-4"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">Free Forever</span>
            </motion.div>
            
            <motion.h1
              className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              Invoice Management,{" "}
              <Typewriter words={["Simplified", "Automated", "Streamlined"]} />
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Create beautiful invoices, track payments, and manage your business finances with our intuitive platform.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/sign-up">
                <Button 
                  size="lg" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/30 hover:scale-105 transition-transform duration-300"
                >
                  Get Started <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Fluid Transitions */}
      <section className="py-32 bg-gradient-to-b from-teal-100 via-emerald-100 to-teal-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  type: "spring", 
                  stiffness: 100 
                }}
                whileHover={{ 
                  scale: 1.05, 
                  rotate: 2,
                  transition: { duration: 0.3 } 
                }}
                className="p-8 rounded-3xl bg-white/70 backdrop-blur-sm shadow-xl border border-emerald-100/50 hover:border-emerald-200/70 transition-all"
              >
                <div className="text-emerald-600 mb-4 transition-transform transform hover:scale-110">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Soft Animations */}
      <section className="py-32 bg-gradient-to-b from-emerald-100 via-teal-100 to-emerald-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            {[
              { value: "70%", label: "Faster Invoice Creation" },
              { value: "50%", label: "Reduced Payment Time" },
              { value: "24/7", label: "Customer Support" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ 
                  scale: 1.1, 
                  transition: { duration: 0.3 } 
                }}
                className="p-8 rounded-3xl bg-white/70 backdrop-blur-sm shadow-xl border border-emerald-100/50 hover:border-emerald-200/70 transition-all"
              >
                <h3 className="text-4xl font-bold text-emerald-600 mb-2 animate-pulse-slow">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section with Gradient Flow */}
      <section className="py-32 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-[length:200%_200%] opacity-30 z-0"
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              type: "spring", 
              stiffness: 100 
            }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
              Ready to Streamline Your Invoicing?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 drop-shadow-md">
              Join thousands of businesses that trust our platform for their invoicing needs.
            </p>
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-xl hover:scale-105 transition-transform duration-300"
              >
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
