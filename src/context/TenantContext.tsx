import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

// These are the types for our app
export type Department = 'Health' | 'Agriculture' | 'Education' | 'Finance'
export type Role = 'Admin' | 'Viewer'

// This interface is for notifications
interface Notification {
  id: number
  title: string
  message: string
  time: string
  unread: boolean
  type: 'info' | 'success' | 'warning'
}

// User profile interface
interface UserProfile {
  name: string
  email: string
  avatar: string
  designation: string
}

// This interface is for activity history
export interface Activity {
  id: number
  action: string
  timestamp: string
}

// This is what the context will hold
interface TenantContextType {
  user: UserProfile
  view: 'landing' | 'dashboard'
  setView: (view: 'landing' | 'dashboard') => void
  activeTab: string
  setActiveTab: (tab: string) => void
  department: Department
  setDepartment: (dept: Department) => void
  role: Role
  setRole: (role: Role) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  sorting: any[]
  setSorting: (sorting: any) => void
  columnFilters: any[]
  setColumnFilters: (filters: any) => void
  notifications: Notification[]
  markAsRead: (id: number) => void
  addNotification: (n: Omit<Notification, 'id' | 'unread' | 'time'>) => void
  activities: Activity[]
  addActivity: (action: string) => void
}

// Create the context
const TenantContext = createContext<TenantContextType | undefined>(undefined)

// The provider component that wraps our app
export function TenantProvider({ children }: { children: ReactNode }) {
  // Current user state
  const [user] = useState<UserProfile>({
    name: 'Yuvraj Singh Bhati',
    email: 'yuvraj.sb@bharat-insight.gov.in',
    avatar: 'YS',
    designation: 'Senior Data Analyst'
  })
  
  // Selected department and role
  const [view, setView] = useState<'landing' | 'dashboard'>('landing')
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [department, setDepartment] = useState<Department>('Agriculture')
  const [role, setRole] = useState<Role>('Admin')
  const [searchQuery, setSearchQuery] = useState('')
  const [sorting, setSorting] = useState<any[]>([])
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  
  // List of notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'Welcome to Bharat-Insight', message: 'Your multi-tenant workspace is ready.', time: 'Just now', unread: true, type: 'success' },
    { id: 2, title: 'Dataset Synchronized', message: '345,407 records successfully loaded from data.gov.in.', time: '2m ago', unread: true, type: 'info' },
  ])

  // State for activity history
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, action: 'Logged into the platform', timestamp: 'Today at 09:00 AM' }
  ])

  // Function to add a new activity
  const addActivity = (action: string) => {
    const newActivity = {
      id: Math.random() + Date.now(),
      action,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setActivities(prev => [newActivity, ...prev].slice(0, 10))
  }

  // Function to add a new notification
  const addNotification = (n: Omit<Notification, 'id' | 'unread' | 'time'>) => {
    const newNotify: Notification = {
      ...n,
      id: Math.random() + Date.now(),
      unread: true,
      time: 'Just now'
    }
    setNotifications(prev => [newNotify, ...prev].slice(0, 10))
  }

  // Function to mark a notification as read
  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, unread: false }
      }
      return n
    }))
  }

  // Check when department changes
  useEffect(() => {
    addNotification({
      title: 'Department Switched',
      message: 'You are now viewing data for Ministry of ' + department,
      type: 'success'
    })
    addActivity('Switched to ' + department + ' department')
  }, [department])

  // Check when role changes
  useEffect(() => {
    addNotification({
      title: 'Access Level Updated',
      message: 'Your permissions have been updated to ' + role,
      type: 'info'
    })
    addActivity('Changed role to ' + role)
  }, [role])

  return (
    <TenantContext.Provider value={{ 
      user,
      view, setView,
      activeTab, setActiveTab,
      department, setDepartment, 
      role, setRole, 
      searchQuery, setSearchQuery,
      sorting, setSorting,
      columnFilters, setColumnFilters,
      notifications, markAsRead,
      addNotification,
      activities,
      addActivity
    }}>
      {children}
    </TenantContext.Provider>
  )
}

// Custom hook to use the context easily
export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}
