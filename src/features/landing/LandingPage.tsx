import { Link } from 'react-router-dom'
import { Sword, Calculator, BarChart3, Users, Map, Archive, ArrowRight, TrendingUp, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function LandingPage() {
  return (
    <div>
      {/* Modern Hero Section */}
      <div className="relative py-16 sm:py-24">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            🎲 Professional D&D 5e Optimization
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            The <span className="text-indigo-600">Destiny Ledger</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Professional-grade character optimization for D&D 5e. Build, analyze, and perfect your heroes with mathematical precision and modern tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/builder" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link 
              to="/dpr-lab" 
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              View DPR Analysis
            </Link>
          </div>
          
          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">SRD Classes & Subclasses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Mathematical Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">1-20</div>
              <div className="text-sm text-gray-600">Level Optimization</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Feature Grid */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, optimize, and analyze D&D 5e characters with professional precision.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Sword}
              title="Character Builder"
              description="Complete D&D 5e character creation with classes, subclasses, feats, and equipment management."
              to="/builder"
              highlight
            />
            <FeatureCard
              icon={TrendingUp}
              title="DPR Analysis"
              description="Mathematical damage-per-round calculations with AC curves and optimization breakpoints."
              to="/dpr-lab"
            />
            <FeatureCard
              icon={BarChart3}
              title="Build Comparison"
              description="Side-by-side analysis with radar charts and detailed statistical breakdowns."
              to="/compare"
            />
            <FeatureCard
              icon={Map}
              title="Level Path Explorer"
              description="Optimal multiclass progression discovery with constraint-based algorithms."
              to="/explorer"
            />
            <FeatureCard
              icon={Archive}
              title="Build Vault"
              description="Personal repository for storing, organizing, and sharing your character builds."
              to="/vault"
            />
            <FeatureCard
              icon={Zap}
              title="Advanced Analytics"
              description="Deep dive into character performance with comprehensive metrics and insights."
              to="/dpr-lab"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  to: string
  highlight?: boolean
}

function FeatureCard({ icon: Icon, title, description, to, highlight }: FeatureCardProps) {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 h-full ${
      highlight ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
    }`}>
      <CardContent className="p-6">
        <Link to={to} className="block">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
            highlight 
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
              : 'bg-gray-100 group-hover:bg-indigo-50'
          }`}>
            <Icon className={`h-6 w-6 ${
              highlight ? 'text-white' : 'text-gray-600 group-hover:text-indigo-600'
            }`} />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
          
          <div className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-500">
            Learn more
            <ArrowRight className="ml-1 h-3 w-3" />
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}