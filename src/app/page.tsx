"use client"

import { motion, useScroll, useTransform} from "framer-motion"
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
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-400 overflow-hidden relative">
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
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500 hover:scale-105 transition-transform duration-300"
                >
                  Get Started <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Fluid Transitions */}
      <section className="py-32 bg-gradient-to-b from-green-200 via-emerald-100 to-teal-50">
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
      <section className="py-32 bg-gradient-to-b from-teal-50 via-teal-100 to-green-200">
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

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="w-full border-t border-gray-200 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 dark:from-emerald-800 dark:via-teal-900 dark:to-emerald-900 mt-0 shadow-inner"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 relative"
        >
          {/* Left: Logo and Text */}
          <div className="flex items-center gap-2 text-white">
            {/* Infinity symbol as SVG with gradient animation */}
            <motion.svg
              width="40" height="40" viewBox="0 0 32 32" fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="drop-shadow-lg"
            >
              <defs>
                <linearGradient id="infinityGradient" x1="4" y1="16" x2="28" y2="16" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10B981" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <path d="M9 21C6.23858 21 4 18.7614 4 16C4 13.2386 6.23858 11 9 11C13.5 11 18.5 21 23 21C25.7614 21 28 18.7614 28 16C28 13.2386 25.7614 11 23 11C18.5 11 13.5 21 9 21Z" stroke="url(#infinityGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
            <span className="font-bold text-xl tracking-tight drop-shadow-md">GenInvoice</span>
            <span className="text-sm text-emerald-100 ml-4 hidden sm:inline">&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          {/* Right: Social Icons */}
          <div className="flex items-center gap-4">
            <motion.a
              href="https://github.com/TanmayBansa1/geninvoice"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              whileHover={{ scale: 1.15, rotate: -8 }}
              whileTap={{ scale: 0.95 }}
              className="transition-transform"
            >
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white hover:text-emerald-300 transition-colors" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.621.069-.609.069-.609 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.338 1.908-1.296 2.747-1.025 2.747-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.577.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z"></path></svg>
            </motion.a>
            <motion.a
              href="https://x.com/K_A_I11"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              whileHover={{ scale: 1.15, rotate: 8 }}
              whileTap={{ scale: 0.95 }}
              className="transition-transform"
            >
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white hover:text-emerald-300 transition-colors" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9.1 9.1 0 0 1-2.88 1.1A4.48 4.48 0 0 0 16.11 0c-2.63 0-4.76 2.13-4.76 4.76 0 .37.04.73.12 1.07C7.69 5.67 4.07 3.94 1.64 1.16c-.41.7-.65 1.52-.65 2.4 0 1.65.84 3.1 2.13 3.95A4.48 4.48 0 0 1 .96 6v.06c0 2.3 1.64 4.22 3.83 4.66-.4.11-.82.17-1.26.17-.31 0-.61-.03-.9-.08.61 1.91 2.38 3.3 4.48 3.34A9.05 9.05 0 0 1 0 21.54 12.8 12.8 0 0 0 6.92 24c8.29 0 12.84-6.87 12.84-12.84 0-.2 0-.39-.01-.59A9.22 9.22 0 0 0 24 4.59a9.1 9.1 0 0 1-2.6.71A4.48 4.48 0 0 0 23 3Z"></path></svg>
            </motion.a>
          </div>
        </motion.div>
      </motion.footer>
    </div>
  )
}
