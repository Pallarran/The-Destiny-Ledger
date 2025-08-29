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
import { Button } from '@/components/ui/button'

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
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-luxury transition-all duration-200 group-hover:shadow-xl group-hover:scale-105">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 opacity-80">
              <Sparkles className="h-3 w-3 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <Link 
            to="/" 
            className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
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
                    ? 'text-blue-600 bg-blue-50 shadow-sm border border-blue-100'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {isActive(item.path) && (
                  <div className="absolute -bottom-2 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
                )}
              </Link>
            )
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button asChild size="sm" variant="gradient">
            <Link to="/builder">
              <Sword className="h-4 w-4" />
              Start Building
            </Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl shadow-luxury md:hidden">
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
                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
              
              <div className="mt-4 pt-4 border-t border-border">
                <Button asChild className="w-full" variant="gradient">
                  <Link to="/builder" onClick={() => setIsMenuOpen(false)}>
                    <Sword className="h-4 w-4" />
                    Start Building
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}