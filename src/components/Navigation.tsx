import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  Sword, 
  BarChart3, 
  GitCompare, 
  Map, 
  Archive,
  BookOpen,
  Sparkles,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

const navigationItems = [
  { path: '/builder', label: 'Builder', icon: Sword },
  { path: '/dpr-lab', label: 'DPR Lab', icon: BarChart3 },
  { path: '/compare', label: 'Compare', icon: GitCompare },
  { path: '/explorer', label: 'Explorer', icon: Map },
  { path: '/vault', label: 'Vault', icon: Archive },
]

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (href: string) => location.pathname === href

  return (
    <nav className="sticky top-0 z-50 w-full chrome-header">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <div className="h-10 w-10 rounded-2xl bg-accent-arcane/20 border border-accent-arcane/30 flex items-center justify-center transition-all duration-200 group-hover:bg-accent-arcane/30">
              <BookOpen className="h-5 w-5 text-accent-arcane" />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 opacity-80">
              <Sparkles className="h-3 w-3 text-accent-gold animate-pulse" />
            </div>
          </div>
          <Link 
            to="/" 
            className="text-xl font-serif font-bold text-panel hover:text-accent-arcane transition-all duration-200"
          >
            The Destiny Ledger
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
                  isActive(item.path)
                    ? 'text-accent-arcane bg-accent-arcane/10 border border-accent-arcane/30'
                    : 'text-panel/70 hover:text-panel hover:bg-panel/10'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {isActive(item.path) && (
                  <div className="absolute -bottom-2 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-accent-gold rounded-full" />
                )}
              </Link>
            )
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button className="parchment-button primary text-sm">
            <Link to="/builder" className="flex items-center gap-2">
              <Sword className="h-4 w-4" />
              Start Building
            </Link>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            className="p-2 rounded-xl text-panel/70 hover:text-panel hover:bg-panel/10 transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 z-50 border-b border-border-etch bg-bg/95 backdrop-blur-xl md:hidden">
          <div className="container mx-auto px-6 py-6">
            <div className="grid gap-3">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200',
                      isActive(item.path)
                        ? 'bg-accent-arcane/10 text-accent-arcane border border-accent-arcane/30'
                        : 'text-panel/70 hover:bg-panel/10 hover:text-panel'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
              
              <div className="mt-4 pt-4 border-t border-border-etch">
                <button className="parchment-button primary w-full">
                  <Link to="/builder" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2">
                    <Sword className="h-4 w-4" />
                    Start Building
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}