import { type ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <div className={`p-4 rounded-xl bg-white/[0.02] border border-white/5 ${className}`}>
      {children}
    </div>
  )
}

export function Badge({ children, variant = 'default' }: { children: ReactNode, variant?: 'default' | 'success' | 'warning' | 'info' }) {
  const styles = {
    default: 'bg-white/5 text-gray-400 border-white/10',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }

  return (
    <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${styles[variant]}`}>
      {children}
    </span>
  )
}

export function Button({ children, onClick, className = '', variant = 'primary' }: { children: ReactNode, onClick?: () => void, className?: string, variant?: 'primary' | 'secondary' }) {
  const variantStyles = variant === 'primary' 
    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'

  return (
    <button 
      onClick={onClick} 
      className={`px-4 py-2 text-sm font-bold rounded-lg transition-all active:scale-95 ${variantStyles} ${className}`}
    >
      {children}
    </button>
  )
}
