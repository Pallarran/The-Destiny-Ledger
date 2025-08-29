import { Archive, Plus, Search } from 'lucide-react'

export function BuildVault() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-arcane-800 mb-2">
            Build Vault
          </h1>
          <p className="text-parchment-700">
            Your personal repository of character builds and optimization strategies
          </p>
        </div>
        <button className="bg-arcane-600 hover:bg-arcane-700 text-white px-4 py-2 rounded-lg font-serif transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Build
        </button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-parchment-500 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search builds..."
            className="w-full pl-10 pr-4 py-2 border border-parchment-300 rounded-lg bg-parchment-50 focus:outline-none focus:ring-2 focus:ring-arcane-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="text-center py-16">
        <Archive className="h-16 w-16 text-parchment-400 mx-auto mb-4" />
        <h3 className="text-xl font-serif font-semibold text-parchment-600 mb-2">
          Your vault awaits
        </h3>
        <p className="text-parchment-500 mb-6">
          Start building characters to see them appear here
        </p>
        <button className="bg-arcane-600 hover:bg-arcane-700 text-white px-6 py-3 rounded-lg font-serif transition-colors">
          Create First Build
        </button>
      </div>
    </div>
  )
}