import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Cpu, 
  ChevronRight,
  Eye,
  Lock,
  Palette,
  Settings
} from 'lucide-react'

export default function SettingsView() {
  const [activeSection, setActiveTab] = useState('General')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  // Theme effect - simplified for prototype
  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme)
    if (newTheme === 'light') {
      document.body.style.backgroundColor = '#f8fafc'
      document.body.classList.add('light-mode')
    } else {
      document.body.style.backgroundColor = '#030303'
      document.body.classList.remove('light-mode')
    }
  }

  const sections = [
    { id: 'General', icon: Settings, label: 'General' },
    { id: 'Security', icon: Shield, label: 'Security' },
    { id: 'Appearance', icon: Palette, label: 'Appearance' },
  ]

  return (
    <div className={`flex-1 overflow-hidden flex flex-col md:flex-row transition-colors duration-500 ${theme === 'light' ? 'bg-slate-50' : 'bg-[#030303]'}`}>
      {/* Settings Navigation */}
      <div className={`w-full md:w-64 border-b md:border-b-0 md:border-r p-4 md:p-6 space-y-2 shrink-0 ${theme === 'light' ? 'border-slate-200' : 'border-white/5'}`}>
        <h2 className={`text-xl font-bold mb-4 md:mb-6 px-2 hidden md:block ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Settings</h2>
        
        <div className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all shrink-0 md:w-full ${
                activeSection === section.id 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5' 
                  : `${theme === 'light' ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-900' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`
              }`}
            >
              <div className="flex items-center gap-3">
                <section.icon className="w-4 h-4" />
                <span className="text-sm font-medium whitespace-nowrap">{section.label}</span>
              </div>
              {activeSection === section.id && <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-blue-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-thin scrollbar-thumb-white/10">
        <div className="max-w-3xl mx-auto space-y-8 md:space-y-12 pb-12">
          {activeSection === 'General' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-8">
              <div>
                <h3 className={`text-lg md:text-xl font-bold mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>General Preferences</h3>
                <p className="text-xs md:text-sm text-gray-500">Simple controls for your dashboard experience.</p>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                  theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/[0.02] border-white/5'
                }`}>
                  <div className="pr-4">
                    <p className={`text-sm font-bold ${theme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>Language</p>
                    <p className="text-[10px] md:text-xs text-gray-500">Select your preferred interface language.</p>
                  </div>
                  <select className="bg-transparent text-xs md:text-sm font-bold text-blue-400 outline-none shrink-0">
                    <option>English</option>
                    <option>Hindi (हिन्दी)</option>
                    <option>Marathi (मराठी)</option>
                  </select>
                </div>

                <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                  theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/[0.02] border-white/5'
                }`}>
                  <div className="pr-4">
                    <p className={`text-sm font-bold ${theme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>Email Notifications</p>
                    <p className="text-[10px] md:text-xs text-gray-500">Receive weekly summaries.</p>
                  </div>
                  <button className="w-10 h-5 rounded-full bg-blue-600 relative shrink-0">
                    <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-white" />
                  </button>
                </div>

                <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                  theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/[0.02] border-white/5'
                }`}>
                  <div className="pr-4">
                    <p className={`text-sm font-bold ${theme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>Auto-Refresh</p>
                    <p className="text-[10px] md:text-xs text-gray-500">Reload data every 15 minutes.</p>
                  </div>
                  <button className="w-10 h-5 rounded-full bg-gray-600 relative shrink-0">
                    <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'Security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-8">
              <div>
                <h3 className={`text-lg md:text-xl font-bold mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Access & Security</h3>
                <p className="text-xs md:text-sm text-gray-500">Manage your credentials and API access tokens.</p>
              </div>

              <div className="space-y-4">
                <div className={`p-5 md:p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  theme === 'light' ? 'bg-slate-50 border-amber-200' : 'bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Two-Factor Auth</p>
                      <p className="text-[10px] md:text-xs text-gray-500">Add extra layer of security.</p>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-black text-[10px] md:text-xs font-bold rounded-lg hover:bg-amber-500 transition-colors">Setup 2FA</button>
                </div>

                <div className={`p-5 md:p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/[0.02] border-white/5'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Platform API Token</p>
                      <p className="text-[10px] md:text-xs text-gray-500">Connected to secure module.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
                      theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/5'
                    }`}>
                      <span className="text-[10px] md:text-xs text-gray-500 font-mono">••••••••••••••••</span>
                      <Eye className="w-3 h-3 text-gray-400" />
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'Appearance' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-8">
              <div>
                <h3 className={`text-lg md:text-xl font-bold mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Interface Appearance</h3>
                <p className="text-xs md:text-sm text-gray-500">Customize how Bharat-Insight looks.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 rounded-2xl border-2 flex flex-col gap-4 text-left group transition-all ${
                    theme === 'dark' ? 'bg-white/5 border-blue-600' : 'bg-white/5 border-transparent hover:border-slate-300'
                  }`}
                >
                  <div className="w-full aspect-video bg-[#030303] rounded-lg border border-white/10 p-2 space-y-2">
                    <div className="w-2/3 h-2 bg-white/10 rounded" />
                    <div className="w-full h-12 bg-white/[0.02] border border-white/5 rounded" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>Dark Mode</p>
                    <p className="text-[10px] text-gray-500">Focus on data in low light.</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 rounded-2xl border-2 flex flex-col gap-4 text-left group transition-all ${
                    theme === 'light' ? 'bg-white border-blue-600' : 'bg-slate-100 border-transparent hover:border-slate-300'
                  }`}
                >
                  <div className="w-full aspect-video bg-white rounded-lg border border-slate-200 p-2 space-y-2 shadow-sm">
                    <div className="w-2/3 h-2 bg-slate-200 rounded" />
                    <div className="w-full h-12 bg-slate-50 border border-slate-100 rounded" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${theme === 'light' ? 'text-blue-600' : 'text-slate-700'}`}>Light Mode</p>
                    <p className="text-[10px] text-gray-500">Crisp and clear interface.</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
