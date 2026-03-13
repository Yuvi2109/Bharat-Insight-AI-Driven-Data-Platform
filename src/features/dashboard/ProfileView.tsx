import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Shield, 
  Building2, 
  Calendar,
  Camera
} from 'lucide-react'
import { useTenant } from '../../context/TenantContext'

export default function ProfileView() {
  const { role, department, activities } = useTenant()
  const [avatar, setAvatar] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Mock user data - in a real app, this would come from a user context/API
  const user = {
    name: 'Yuvraj Singh Bhati',
    email: 'yuvraj.sb@bharat-insight.gov.in',
    joined: 'January 2024',
    location: 'New Delhi, India',
    stats: [
      { label: 'Analytic Reports', value: '128' },
      { label: 'Data Queries', value: '1,420' },
      { label: 'AI Insights', value: '45' }
    ]
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#030303] relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto space-y-8 relative z-10"
      >
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Profile Header Card */}
          <motion.div 
            variants={itemAnim}
            className="w-full md:w-1/3 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center text-center"
          >
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl group-hover:scale-105 transition-transform duration-500">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.name.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                className="hidden" 
                accept="image/*"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 bg-blue-600 rounded-full text-white border-4 border-[#030303] hover:bg-blue-500 transition-colors shadow-lg z-20"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
            
            <div className="w-full grid grid-cols-2 gap-2">
              <div className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest ${
                role === 'Admin' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                <Shield className="w-3 h-3" />
                {role}
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                <Building2 className="w-3 h-3" />
                {department}
              </div>
            </div>
          </motion.div>

          {/* Details, Settings & Activity */}
          <div className="flex-1 space-y-6 w-full">
            <motion.div 
              variants={itemAnim}
              className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Account Overview
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {user.stats.map((stat, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">Date Joined</span>
                  </div>
                  <span className="text-sm text-white font-medium">{user.joined}</span>
                </div>
              </div>
            </motion.div>

            {/* Activity History - NEW SECTION */}
            <motion.div 
              variants={itemAnim}
              className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                {activities.length > 0 ? activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">{activity.action}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 italic">No recent activities found.</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
