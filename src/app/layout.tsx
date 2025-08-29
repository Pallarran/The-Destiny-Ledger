import { Outlet } from 'react-router-dom'
import { Navigation } from '../components/Navigation'

export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-50 to-parchment-100 bg-ledger-texture">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        <div className="bg-parchment-50/90 backdrop-blur-sm rounded-lg border border-parchment-200 shadow-lg p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}