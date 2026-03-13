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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<'org' | 'role' | 'notifications' | null>(null)
  const [currentDataContext, setCurrentDataContext] = useState<any>(null)

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
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
          <Shield className="w-12 h-12 text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-white">Access Restricted</h2>
          <p className="text-gray-500">You need Admin permissions to see this.</p>
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
    <div className="flex h-screen bg-[#030303]" onClick={() => setOpenMenu(null)}>
      {/* Sidebar Navigation */}
      <div 
        className={`relative flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl transition-all ${isSidebarOpen ? 'w-[260px]' : 'w-[80px]'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center h-16 px-6 border-b border-white/5">
          <Database className="w-6 h-6 text-blue-500" />
          {isSidebarOpen && <span className="ml-3 font-bold text-lg">Bharat Insight</span>}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => setActiveTab('Dashboard')}
            className={`flex items-center w-full px-3 py-2.5 rounded-lg ${activeTab === 'Dashboard' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3 text-sm">Dashboard</span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('Datasets')}
            className={`flex items-center w-full px-3 py-2.5 rounded-lg ${activeTab === 'Datasets' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400'}`}
          >
            <Database className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3 text-sm">Datasets</span>}
          </button>

          <button 
            onClick={() => setActiveTab('Profile')}
            className={`flex items-center w-full px-3 py-2.5 rounded-lg ${activeTab === 'Profile' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400'}`}
          >
            <User className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3 text-sm">Profile</span>}
          </button>

          <button 
            onClick={() => setActiveTab('Settings')}
            className={`flex items-center w-full px-3 py-2.5 rounded-lg ${activeTab === 'Settings' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400'}`}
          >
            <Settings className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3 text-sm">Settings</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={onBack} className="flex items-center w-full px-3 py-2 text-gray-400">
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3 text-sm">Exit</span>}
          </button>
        </div>

        {/* Toggle sidebar button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-[#030303]"
        >
          {isSidebarOpen ? <X size={12} /> : <Menu size={12} />}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Banner for Viewers */}
        {role === 'Viewer' && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-8 flex justify-center items-center gap-2">
            <Eye size={14} className="text-amber-500" />
            <span className="text-[10px] text-amber-500 font-bold uppercase">Read-Only Mode</span>
          </div>
        )}

        {/* Topbar */}
        <header className="flex items-center justify-between h-16 px-8 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-4">
            {/* Department Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); toggleMenu('org'); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10"
              >
                <span className="text-sm">{department}</span>
                <ChevronDown size={16} />
              </button>
              
              {openMenu === 'org' && (
                <div className="absolute top-full left-0 mt-2 w-48 py-2 bg-[#0c0c0c] border border-white/10 rounded-lg z-50">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => { setDepartment(dept); setOpenMenu(null); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white"
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); toggleMenu('role'); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10"
              >
                <Shield size={16} />
                <span className="text-sm">{role}</span>
                <ChevronDown size={16} />
              </button>
              
              {openMenu === 'role' && (
                <div className="absolute top-full left-0 mt-2 w-48 py-2 bg-[#0c0c0c] border border-white/10 rounded-lg z-50">
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => { setRole(r); setOpenMenu(null); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              <Search size={16} className="text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm text-white w-32"
              />
            </div>
            
            {/* AI Toggle */}
            <button 
              onClick={() => setIsAIOpen(!isAIOpen)}
              className={`p-2 rounded-full ${isAIOpen ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400'}`}
            >
              <Sparkles size={20} />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleMenu('notifications'); }}
                className="p-2 bg-white/5 text-gray-400 rounded-full relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {openMenu === 'notifications' && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-[#0c0c0c] border border-white/10 rounded-lg z-50 overflow-hidden shadow-xl">
                  <div className="p-4 border-b border-white/5 bg-white/5">
                    <span className="text-sm font-bold">Notifications</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div 
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-4 border-b border-white/5 cursor-pointer ${n.unread ? 'bg-blue-500/5' : ''}`}
                      >
                        <p className="text-xs text-white font-medium">{n.message}</p>
                        <p className="text-[10px] text-gray-500">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setActiveTab('Profile')}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${role === 'Admin' ? 'bg-emerald-600' : 'bg-amber-600'}`}
            >
              <User size={16} />
            </button>
          </div>
        </header>

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
