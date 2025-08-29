import { Outlet } from 'react-router-dom'
import { Navigation } from '../components/Navigation'

export function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto py-6">
        <Outlet />
      </main>
    </div>
  )
}