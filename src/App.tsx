import LandingPage from './features/landing/LandingPage'
import Dashboard from './features/dashboard/Dashboard'
import CommandPalette from './components/CommandPalette'
import { useTenant } from './context/TenantContext'

function App() {
  const { view, setView, setActiveTab } = useTenant()

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-blue-500/30">
      <CommandPalette />
      {view === 'landing' ? (
        <LandingPage onEnter={() => { setView('dashboard'); setActiveTab('Dashboard'); }} />
      ) : (
        <Dashboard onBack={() => setView('landing')} />
      )}
    </div>
  )
}

export default App
