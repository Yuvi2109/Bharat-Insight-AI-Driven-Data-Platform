import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// This is the interface for the landing page props
interface LandingPageProps {
  onEnter: () => void
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="h-screen flex flex-col bg-[#030303]">
      {/* Hero Section - This is the main part of the landing page */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* We use motion to fade in the content when page loads */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="z-10 max-w-4xl mx-auto"
        >
          {/* A small badge at the top */}
          <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium text-blue-400 border border-blue-500/30 rounded-full bg-blue-500/10">
            <span>High-Performance Analytics</span>
            <div className="w-1 h-1 ml-2 bg-blue-400 rounded-full animate-pulse" />
          </div>

          {/* Main Title */}
          <h1 className="text-6xl font-bold tracking-tight text-white md:text-8xl lg:text-9xl">
            Bharat <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Insight</span>
          </h1>

          <p className="mt-8 text-lg text-gray-400 md:text-xl max-w-2xl mx-auto">
            Revolutionizing Indian data analytics with high-performance grids, multi-tenant architecture, and real-time AI reasoning.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 mt-12 sm:flex-row">
            {/* Button to enter the dashboard */}
            <button
              onClick={onEnter}
              className="flex items-center justify-center px-8 py-4 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>

            <button className="px-8 py-4 font-bold text-gray-300 border border-white/10 rounded-xl hover:bg-white/5 transition-all">
              View Documentation
            </button>
          </div>
        </motion.div>

        {/* This adds some glow in the background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full" />
        </div>
      </section>

      {/* Footer at the bottom */}
      <footer className="px-6 py-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© 2026 Bharat-Insight AI-Driven Data Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}
