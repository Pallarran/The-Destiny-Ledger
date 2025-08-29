import { Link } from 'react-router-dom'
import { Sword, Calculator, BarChart3, Users, Map, Archive } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="text-center">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-5xl font-serif font-bold text-arcane-800 mb-6 leading-tight">
          Welcome to The Destiny Ledger
        </h1>
        <p className="text-xl text-parchment-700 mb-8 max-w-3xl mx-auto leading-relaxed">
          Forge your destiny with precision. The ultimate D&D 5e character optimizer, 
          combining ancient wisdom with mathematical precision to craft legendary heroes.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            to="/builder" 
            className="bg-arcane-600 hover:bg-arcane-700 text-white px-8 py-3 rounded-lg font-serif font-medium transition-colors shadow-lg"
          >
            Start Building
          </Link>
          <Link 
            to="/vault" 
            className="bg-parchment-200 hover:bg-parchment-300 text-arcane-800 px-8 py-3 rounded-lg font-serif font-medium transition-colors"
          >
            Browse Builds
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={Sword}
          title="Character Builder"
          description="Craft legendary heroes with complete D&D 5e rules support and milestone tracking through all 20 levels"
          to="/builder"
        />
        <FeatureCard
          icon={Calculator}
          title="DPR Analysis"
          description="Unveil true combat potential with precise damage calculations using closed-form mathematics"
          to="/dpr-lab"
        />
        <FeatureCard
          icon={BarChart3}
          title="Build Comparison"
          description="Compare up to 3 builds side-by-side with detailed radar charts and statistical analysis"
          to="/compare"
        />
        <FeatureCard
          icon={Map}
          title="Level Path Explorer"
          description="Discover optimal multiclass paths with constraint-based optimization algorithms"
          to="/explorer"
        />
        <FeatureCard
          icon={Archive}
          title="Build Vault"
          description="Store and organize your character builds in your personal arcane repository"
          to="/vault"
        />
        <FeatureCard
          icon={Users}
          title="Community Features"
          description="Share builds, compare strategies, and learn from the wisdom of other optimizers"
          to="/vault"
        />
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  to: string
}

function FeatureCard({ icon: Icon, title, description, to }: FeatureCardProps) {
  return (
    <Link 
      to={to}
      className="group p-6 bg-parchment-50/60 hover:bg-arcane-50/60 border border-parchment-200 hover:border-arcane-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="mb-4">
        <Icon className="h-8 w-8 text-arcane-600 group-hover:text-arcane-700 mx-auto" />
      </div>
      <h3 className="text-lg font-serif font-semibold text-arcane-800 mb-3">{title}</h3>
      <p className="text-sm text-parchment-700 leading-relaxed">
        {description}
      </p>
    </Link>
  )
}