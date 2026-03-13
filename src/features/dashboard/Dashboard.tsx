import { useState } from 'react'
import { 
  LayoutDashboard, 
  Search, 
  Settings, 
  Bell, 
  ChevronDown, 
  LogOut, 
  Shield, 
  Menu,
  X,
  Sparkles,
  Database,
  User,
  Eye
} from 'lucide-react'
import { useTenant, type Department, type Role } from '../../context/TenantContext'
import DataGrid from './DataGrid'
import DatasetsView from './DatasetsView'
import SettingsView from './SettingsView'
import AIInsightPanel from './AIInsightPanel'
import ProfileView from './ProfileView'

interface DashboardProps {
  onBack: () => void
}

export default function Dashboard({ onBack }: DashboardProps) {
  // Use our tenant context for shared state
  const { 
    department, setDepartment, 
    role, setRole, 
    searchQuery, setSearchQuery, 
    notifications, markAsRead,
    activeTab, setActiveTab
  } = useTenant()
  
  // Local state for UI
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Start open for better visibility
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<'org' | 'role' | 'notifications' | null>(null)
  const [currentDataContext, setCurrentDataContext] = useState<any>(null)
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const departments: Department[] = ['Agriculture', 'Health', 'Education', 'Finance']
  const roles: Role[] = ['Admin', 'Viewer']
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => n.unread).length

  // Function to open/close top menus
  const toggleMenu = (menu: 'org' | 'role' | 'notifications') => {
    if (openMenu === menu) {
      setOpenMenu(null)
    } else {
      setOpenMenu(menu)
    }
  }

  // This is called when data in the grid changes
  const handleDataUpdate = (data: any[], stats: any) => {
    setCurrentDataContext({ sample: data.slice(0, 5), stats })
  }

  // Function to show the right content based on active tab
  const renderContent = () => {
    // If user is just a viewer, they can't see settings
    if (activeTab === 'Settings' && role === 'Viewer') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 md:p-12">
          <Shield className="w-12 h-12 text-amber-500 mb-4" />
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">Access Restricted</h2>
          <p className="text-sm text-gray-500">You need Admin permissions to see this.</p>
        </div>
      )
    }

    if (activeTab === 'Dashboard') return <DataGrid onDataUpdate={handleDataUpdate} />
    if (activeTab === 'Datasets') return <DatasetsView />
    if (activeTab === 'Settings') return <SettingsView />
    if (activeTab === 'Profile') return <ProfileView />
    
    return <div>Not found</div>
  }

  return (
    <div className="flex h-screen bg-[#030303] overflow-hidden" onClick={() => setOpenMenu(null)}>
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div 
        className={`fixed inset-y-0 left-0 z-[70] flex flex-col border-r border-white/10 bg-black/80 backdrop-blur-2xl transition-all duration-300 lg:relative lg:bg-black/40 ${
          isSidebarOpen ? 'w-[280px] translate-x-0' : 'w-[280px] -translate-x-full lg:translate-x-0 lg:w-[80px]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/5">
          <div className="flex items-center">
            <Database className="w-6 h-6 text-blue-500" />
            {(isSidebarOpen || window.innerWidth < 1024) && <span className="ml-3 font-bold text-lg">Bharat Insight</span>}
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <button 
            onClick={() => { setActiveTab('Dashboard'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
            className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'Dashboard' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {(isSidebarOpen || window.innerWidth < 1024) && <span className="ml-3 text-sm">Dashboard</span>}
          </button>
          
          <button 
            onClick={() => { setActiveTab('Datasets'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
            className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'Datasets' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <Database className="w-5 h-5 shrink-0" />
            {(isSidebarOpen || window.innerWidth < 1024) && <span className="ml-3 text-sm">Datasets</span>}
          </button>

          <button 
            onClick={() => { setActiveTab('Profile'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
            className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'Profile' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <User className="w-5 h-5 shrink-0" />
            {(isSidebarOpen || window.innerWidth < 1024) && <span className="ml-3 text-sm">Profile</span>}
          </button>

          <button 
            onClick={() => { setActiveTab('Settings'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
            className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'Settings' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {(isSidebarOpen || window.innerWidth < 1024) && <span className="ml-3 text-sm">Settings</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={onBack} className="flex items-center w-full px-3 py-2 text-gray-400 hover:text-white transition-colors">
            <LogOut className="w-5 h-5 shrink-0" />
            {(isSidebarOpen || window.innerWidth < 1024) && <span className="ml-3 text-sm">Exit</span>}
          </button>
        </div>

        {/* Desktop Expand/Collapse Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-blue-600 rounded-full hidden lg:flex items-center justify-center text-white border-2 border-[#030303] hover:bg-blue-500 transition-colors z-[80]"
        >
          {isSidebarOpen ? <X size={10} /> : <Menu size={10} />}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        {/* Banner for Viewers */}
        {role === 'Viewer' && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 py-1.5 px-4 md:px-8 flex justify-center items-center gap-2 shrink-0">
            <Eye size={12} className="text-amber-500" />
            <span className="text-[9px] md:text-[10px] text-amber-500 font-bold uppercase">Read-Only Mode</span>
          </div>
        )}

        {/* Topbar */}
        <header className="flex items-center justify-between h-16 px-4 md:px-8 border-b border-white/5 bg-black/20 shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Hamburger for Mobile */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }}
              className="p-2 -ml-2 text-gray-400 hover:text-white lg:hidden"
            >
              <Menu size={20} />
            </button>

            {/* Department Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); toggleMenu('org'); }}
                className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 rounded-lg border border-white/10 text-xs md:text-sm whitespace-nowrap"
              >
                <span className="truncate max-w-[70px] md:max-w-none">{department}</span>
                <ChevronDown size={14} className="shrink-0" />
              </button>
              
              {openMenu === 'org' && (
                <div className="absolute top-full left-0 mt-2 w-40 md:w-48 py-2 bg-[#0c0c0c] border border-white/10 rounded-lg z-50 shadow-2xl">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => { setDepartment(dept); setOpenMenu(null); }}
                      className="w-full text-left px-4 py-2 text-xs md:text-sm text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Dropdown - Hidden on very small screens */}
            <div className="relative hidden sm:block">
              <button
                onClick={(e) => { e.stopPropagation(); toggleMenu('role'); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-sm"
              >
                <Shield size={14} className="shrink-0" />
                <span>{role}</span>
                <ChevronDown size={14} className="shrink-0" />
              </button>
              
              {openMenu === 'role' && (
                <div className="absolute top-full left-0 mt-2 w-40 md:w-48 py-2 bg-[#0c0c0c] border border-white/10 rounded-lg z-50 shadow-2xl">
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => { setRole(r); setOpenMenu(null); }}
                      className="w-full text-left px-4 py-2 text-xs md:text-sm text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="p-2 text-gray-400 md:hidden"
            >
              <Search size={20} />
            </button>

            {/* Search Input - Desktop */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full focus-within:border-blue-500/50 transition-colors">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm text-white w-24 lg:w-40"
              />
            </div>
            
            {/* AI Toggle */}
            <button 
              onClick={() => setIsAIOpen(!isAIOpen)}
              className={`p-2 rounded-full transition-all ${isAIOpen ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              <Sparkles className="w-[18px] h-[18px] md:w-5 md:h-5" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleMenu('notifications'); }}
                className="p-2 bg-white/5 text-gray-400 rounded-full relative hover:text-white transition-colors"
              >
                <Bell className="w-[18px] h-[18px] md:w-5 md:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[9px] rounded-full flex items-center justify-center border-2 border-[#030303]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {openMenu === 'notifications' && (
                <div className="absolute top-full right-[-50px] md:right-0 mt-2 w-72 md:w-80 bg-[#0c0c0c] border border-white/10 rounded-lg z-50 overflow-hidden shadow-2xl">
                  <div className="p-4 border-b border-white/5 bg-white/5">
                    <span className="text-sm font-bold">Notifications</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                    {notifications.length > 0 ? notifications.map((n) => (
                      <div 
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${n.unread ? 'bg-blue-500/5' : ''}`}
                      >
                        <p className="text-xs text-white font-medium">{n.message}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{n.time}</p>
                      </div>
                    )) : (
                      <div className="p-8 text-center text-gray-500 text-xs italic">No notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setActiveTab('Profile')}
              className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 ${role === 'Admin' ? 'bg-emerald-600' : 'bg-amber-600'}`}
            >
              <User size={16} />
            </button>
          </div>
        </header>

        {/* Mobile Search Overlay */}
        {isSearchVisible && (
          <div className="absolute top-16 left-0 w-full p-4 bg-black/90 backdrop-blur-xl border-b border-white/10 z-[55] flex items-center gap-3 animate-in slide-in-from-top duration-300">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full focus-within:border-blue-500/50">
              <Search size={14} className="text-gray-400" />
              <input 
                autoFocus
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm text-white w-full"
              />
            </div>
            <button onClick={() => setIsSearchVisible(false)} className="text-gray-500 text-sm font-bold uppercase tracking-widest px-2">Close</button>
          </div>
        )}

        <main className="flex flex-1 overflow-hidden relative">
          <div className="flex-1 overflow-hidden flex flex-col">
            {renderContent()}
          </div>
          
          <AIInsightPanel 
            isOpen={isAIOpen} 
            onClose={() => setIsAIOpen(false)} 
            contextData={currentDataContext}
          />
        </main>
      </div>
    </div>
  )
}
