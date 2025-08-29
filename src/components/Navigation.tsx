import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Archive, 
  User, 
  Activity, 
  GitCompare, 
  Map, 
  Settings,
  BookOpen
} from 'lucide-react'

const navigationItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/vault', icon: Archive, label: 'Build Vault' },
  { path: '/builder', icon: User, label: 'Character Builder' },
  { path: '/dpr-lab', icon: Activity, label: 'DPR Lab' },
  { path: '/compare', icon: GitCompare, label: 'Compare' },
  { path: '/explorer', icon: Map, label: 'Level Path Explorer' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export function Navigation() {
  const location = useLocation()

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <Link 
                to="/" 
                className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                The Destiny Ledger
              </Link>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  location.pathname === path
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button - would add hamburger menu here */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}