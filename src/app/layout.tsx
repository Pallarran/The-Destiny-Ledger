import { Outlet } from 'react-router-dom'
import { Navigation } from '../components/Navigation'

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Navigation */}
      <Navigation />
      
      {/* Main Content Area */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}