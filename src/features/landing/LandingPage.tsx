export function LandingPage() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
        Welcome to The Destiny Ledger
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        The ultimate D&D 5e character optimizer and comparison tool
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="p-6 border rounded-lg bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Character Builder</h3>
          <p className="text-sm text-gray-600">
            Build complete D&D 5e characters with full timeline tracking
          </p>
        </div>
        <div className="p-6 border rounded-lg bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-2">DPR Analysis</h3>
          <p className="text-sm text-gray-600">
            Precise damage calculations using closed-form mathematics
          </p>
        </div>
        <div className="p-6 border rounded-lg bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Build Comparison</h3>
          <p className="text-sm text-gray-600">
            Compare up to 3 builds side-by-side with radar charts
          </p>
        </div>
      </div>
    </div>
  )
}