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
    <nav className="border-b bg-white/50 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-arcane-600" />
            <Link 
              to="/" 
              className="text-xl font-serif font-bold text-gray-900 hover:text-arcane-600 transition-colors"
            >
              The Destiny Ledger
            </Link>
          </div>
          
          <div className="flex items-center space-x-1">
            {navigationItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  location.pathname === path
                    ? 'bg-arcane-100 text-arcane-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}