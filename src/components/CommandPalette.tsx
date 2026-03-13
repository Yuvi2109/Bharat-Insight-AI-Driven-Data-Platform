import { useState, useEffect } from 'react'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, LayoutDashboard, Database, Settings, Sparkles, X, User } from 'lucide-react'
import { useTenant, type Department } from '../context/TenantContext'

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const { setDepartment, setView, setActiveTab } = useTenant()

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const departments: Department[] = ['Agriculture', 'Health', 'Education', 'Finance']

  return (
    <AnimatePresence>
      {open && (
        <Command.Dialog
          open={open}
          onOpenChange={setOpen}
          label="Global Command Menu"
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center px-4 py-3 border-b border-white/5">
              <Search className="w-5 h-5 text-gray-500 mr-3" />
              <Command.Input
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-600 text-base"
              />
              <button 
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <Command.List className="max-h-[300px] overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-white/10">
              <Command.Empty className="px-4 py-8 text-center text-gray-500 text-sm">
                No results found.
              </Command.Empty>

              <Command.Group heading="Navigation" className="px-2 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                <CommandItem onSelect={() => { setView('dashboard'); setActiveTab('Dashboard'); setOpen(false); }}>
                  <LayoutDashboard className="w-4 h-4 mr-3" />
                  <span>Go to Dashboard</span>
                </CommandItem>
                <CommandItem onSelect={() => { setView('dashboard'); setActiveTab('Datasets'); setOpen(false); }}>
                  <Database className="w-4 h-4 mr-3" />
                  <span>View Datasets</span>
                </CommandItem>
                <CommandItem onSelect={() => { setView('dashboard'); setActiveTab('Profile'); setOpen(false); }}>
                  <User className="w-4 h-4 mr-3" />
                  <span>View Profile</span>
                </CommandItem>
                <CommandItem onSelect={() => { setView('dashboard'); setActiveTab('Settings'); setOpen(false); }}>
                  <Settings className="w-4 h-4 mr-3" />
                  <span>View Settings</span>
                </CommandItem>
              </Command.Group>

              <Command.Group heading="Switch Department" className="px-2 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                {departments.map(dept => (
                  <CommandItem 
                    key={dept} 
                    onSelect={() => {
                      setDepartment(dept)
                      setOpen(false)
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-4" />
                    <span>Switch to {dept}</span>
                  </CommandItem>
                ))}
              </Command.Group>

              <Command.Group heading="AI Actions" className="px-2 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                <CommandItem onSelect={() => setOpen(false)}>
                  <Sparkles className="w-4 h-4 mr-3" />
                  <span>Analyze current view</span>
                </CommandItem>
              </Command.Group>

              <Command.Group heading="Settings" className="px-2 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                <CommandItem onSelect={() => setOpen(false)}>
                  <Settings className="w-4 h-4 mr-3" />
                  <span>General Settings</span>
                </CommandItem>
              </Command.Group>
            </Command.List>
          </motion.div>
        </Command.Dialog>
      )}
    </AnimatePresence>
  )
}

function CommandItem({ children, onSelect }: { children: React.ReactNode; onSelect?: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-colors aria-selected:bg-white/5 aria-selected:text-white"
    >
      {children}
    </Command.Item>
  )
}
