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
    <nav className="border-b border-parchment-200 bg-parchment-50/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-10 w-10 text-arcane-600" />
            <Link 
              to="/" 
              className="text-2xl font-serif font-bold text-arcane-800 hover:text-arcane-600 transition-colors"
            >
              The Destiny Ledger
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            {navigationItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  location.pathname === path
                    ? 'bg-arcane-100/80 text-arcane-800 shadow-md border border-arcane-200'
                    : 'text-parchment-700 hover:text-arcane-700 hover:bg-arcane-50/50 hover:shadow-sm'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline font-serif">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}