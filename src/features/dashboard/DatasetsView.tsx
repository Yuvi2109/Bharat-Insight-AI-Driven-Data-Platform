import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { 
  Wheat, 
  HeartPulse, 
  GraduationCap, 
  Coins, 
  Download, 
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react'
import { useTenant, type Department } from '../../context/TenantContext'
import { useDashboardData } from '../../hooks/useDashboardData'

export default function DatasetsView() {
  const { department, setDepartment } = useTenant()
  const { data, downloadCSV, isLoading } = useDashboardData()

  const datasets = [
    { 
      id: 'Agriculture' as Department, 
      name: 'Agriculture', 
      icon: Wheat, 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10',
      rows: '345,407',
      fields: ['State', 'District', 'Crop', 'Year', 'Production'],
      description: 'Yield records from 1997-2020.'
    },
    { 
      id: 'Health' as Department, 
      name: 'Healthcare', 
      icon: HeartPulse, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10',
      rows: '12,450',
      fields: ['State', 'District', 'Facility', 'Category', 'Beds'],
      description: 'Public hospital infrastructure monitoring.'
    },
    { 
      id: 'Education' as Department, 
      name: 'Education', 
      icon: GraduationCap, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10',
      rows: '8,900',
      fields: ['State', 'District', 'Institution', 'Literacy %'],
      description: 'Enrollment and literacy statistics.'
    },
    { 
      id: 'Finance' as Department, 
      name: 'Finance', 
      icon: Coins, 
      color: 'text-purple-400', 
      bg: 'bg-purple-500/10',
      rows: '5,600',
      fields: ['State', 'District', 'Sector', 'Investment'],
      description: 'State-wise economic growth metrics.'
    }
  ]

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  }

  const itemAnim: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const textVariant: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  const tagContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const tagItem: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#030303] relative">
      {/* Premium Background Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
          x: [0, 20, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none"
      />

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mb-12 relative z-10"
      >
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Dataset Catalog
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500"
        >
          Select a ministry to switch data context. Page speed optimized.
        </motion.p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
      >
        {datasets.map((item) => (
          <motion.div 
            key={item.id}
            variants={itemAnim}
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDepartment(item.id)}
            className={`relative flex flex-col p-8 rounded-[2.5rem] border transition-all cursor-pointer group overflow-hidden ${
              department === item.id 
                ? 'bg-white/[0.08] border-blue-500 shadow-[0_20px_50px_-12px_rgba(59,130,246,0.3)]' 
                : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
            }`}
          >
            {/* Subtle Gradient Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Active Label */}
            <AnimatePresence>
              {department === item.id && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.8 }}
                  className="absolute top-6 right-8 flex items-center gap-2 text-blue-400 z-20"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                  <CheckCircle2 className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`p-4 w-fit rounded-2xl mb-6 transition-colors ${item.bg} relative z-20 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]`}
            >
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </motion.div>
            
            <motion.h3 
              variants={textVariant}
              className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors relative z-20"
            >
              {item.name}
            </motion.h3>
            
            <motion.p 
              variants={textVariant}
              className="text-gray-500 text-sm mb-6 line-clamp-2 relative z-20"
            >
              {item.description}
            </motion.p>
            
            {/* Dynamic Fields List */}
            <motion.div variants={tagContainer} className="flex flex-wrap gap-2 mb-8 relative z-20">
              {item.fields.map(f => (
                <motion.span 
                  key={f} 
                  variants={tagItem}
                  className="text-[9px] px-2 py-1 bg-white/5 border border-white/10 rounded-md text-gray-400 font-mono uppercase group-hover:border-blue-500/30 transition-colors"
                >
                  {f}
                </motion.span>
              ))}
            </motion.div>

            <motion.div variants={textVariant} className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4 relative z-20">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <motion.p variants={textVariant} className="text-[10px] text-gray-600 font-bold uppercase">Dataset Size</motion.p>
                  <motion.p variants={textVariant} className="text-sm text-gray-300 font-mono group-hover:text-white transition-colors">
                    {item.rows} rows
                  </motion.p>
                </div>
                {department === item.id && (
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                  />
                )}
              </div>

              <AnimatePresence mode="wait">
                {department === item.id && (
                  <motion.button 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => { e.stopPropagation(); downloadCSV(data); }}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isLoading ? 'Loading...' : 'Download CSV'}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Speed & Security Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-12 flex items-center gap-6 p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 max-w-4xl relative z-10"
      >
        <div className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            <Zap className="w-4 h-4" />
          </motion.div>
          <div className="text-xs">
            <p className="text-white font-bold uppercase tracking-tighter">Fast Transfer</p>
            <p className="text-gray-500">Streaming active.</p>
          </div>
        </div>
        <div className="w-px h-8 bg-white/5" />
        <div className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ scale: 1.2, rotate: -10 }}
            className="p-2 bg-blue-500/10 rounded-lg text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
          >
            <ShieldCheck className="w-4 h-4" />
          </motion.div>
          <div className="text-xs">
            <p className="text-white font-bold uppercase tracking-tighter">Verified Data</p>
            <p className="text-gray-500">data.gov.in source</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
