import { Link } from 'react-router-dom'
import { Sword, Calculator, BarChart3, Map, Archive, ArrowRight, TrendingUp, Sparkles, Shield, Target, BookOpen, Zap } from 'lucide-react'
import { Panel } from '@/components/ui/Panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-bg">        
        <div className="container mx-auto px-6 pt-20 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center pb-24 lg:pb-32">
            {/* Professional Badge */}
            <div className="mb-8 flex justify-center">
              <Badge variant="secondary" className="text-sm px-4 py-2 bg-accent/10 text-accent border-accent/30">
                <Sparkles className="mr-2 h-4 w-4 text-gold" />
                Professional D&D 5e Optimization
              </Badge>
            </div>
            
            {/* Hero Title */}
            <h1 className="text-5xl font-bold tracking-tight text-panel sm:text-7xl font-serif">
              The{' '}
              <span className="bg-gradient-to-r from-accent via-gold to-emerald bg-clip-text text-transparent glow">
                Destiny Ledger
              </span>
            </h1>
            
            {/* Hero Description */}
            <p className="mt-8 text-xl leading-8 text-panel/80 max-w-3xl mx-auto">
              The most advanced D&D 5e character optimizer. Build, analyze, and perfect your heroes with
              {' '}<strong className="font-semibold text-panel">mathematical precision</strong> and{' '}
              <strong className="font-semibold text-panel">professional-grade tools</strong>.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" variant="gradient" className="min-w-48">
                <Link to="/builder">
                  <Sword className="mr-2 h-4 w-4" />
                  Start Building
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-w-48">
                <Link to="/dpr-lab">
                  <Calculator className="mr-2 h-4 w-4" />
                  View DPR Analysis
                </Link>
              </Button>
            </div>
            
            {/* Professional Stats Grid */}
            <div className="mt-20">
              <div className="mx-auto max-w-2xl">
                <div className="grid grid-cols-3 gap-8">
                  <div className="group cursor-default">
                    <div className="text-4xl font-bold text-panel group-hover:text-accent transition-colors">50+</div>
                    <div className="mt-2 text-sm text-panel/70 font-medium">Classes & Subclasses</div>
                  </div>
                  <div className="group cursor-default">
                    <div className="text-4xl font-bold text-panel group-hover:text-accent transition-colors">100%</div>
                    <div className="mt-2 text-sm text-panel/70 font-medium">Mathematical Accuracy</div>
                  </div>
                  <div className="group cursor-default">
                    <div className="text-4xl font-bold text-panel group-hover:text-accent transition-colors">1-20</div>
                    <div className="mt-2 text-sm text-panel/70 font-medium">Level Optimization</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Feature Grid */}
      <div className="py-24 sm:py-32 bg-bg relative">
        <div className="container mx-auto px-6 relative">
          <Panel className="p-12 mb-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="outline" className="text-accent border-accent/30">
                  Everything you need
                </Badge>
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl font-serif">
                Professional-grade optimization
              </h2>
              <p className="mt-6 text-xl leading-8 text-muted">
                Advanced tools for D&D 5e character creation, analysis, and optimization.
                Built for players who demand mathematical precision.
              </p>
            </div>
          </Panel>
          
          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={Sword}
                title="Character Builder"
                description="Complete D&D 5e character creation with advanced class progression, feat selection, and equipment optimization."
                to="/builder"
                featured
              />
              <FeatureCard
                icon={TrendingUp}
                title="DPR Engine"
                description="Closed-form mathematical DPR calculations with advantage states, AC curves, and GWM/Sharpshooter optimization."
                to="/dpr-lab"
              />
              <FeatureCard
                icon={BarChart3}
                title="Build Comparison"
                description="Side-by-side analysis with radar charts showing role capabilities and detailed performance metrics."
                to="/compare"
              />
              <FeatureCard
                icon={Map}
                title="Level Path Explorer"
                description="Algorithmic multiclass optimization with beam search and constraint-based progression planning."
                to="/explorer"
              />
              <FeatureCard
                icon={Archive}
                title="Build Vault"
                description="Local storage for character builds with import/export capabilities and organizational tools."
                to="/vault"
              />
              <FeatureCard
                icon={Target}
                title="Advanced Analytics"
                description="Deep performance insights with role scoring, non-DPR metrics, and comprehensive character evaluation."
                to="/dpr-lab"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Trust Section */}
      <div className="bg-bg py-24 relative">
        <div className="container mx-auto px-6 relative">
          <Panel className="p-12">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl mb-16 font-serif">
                Trusted by optimizers worldwide
              </h2>
              
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="group text-center">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-emerald to-emerald/80 flex items-center justify-center mb-6 shadow-etched group-hover:scale-105 transition-all duration-150">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-ink mb-3 font-serif">Mathematically Accurate</h3>
                  <p className="text-muted leading-relaxed">Closed-form calculations with ±0.5 DPR tolerance validated against hand-calculated test cases.</p>
                </div>
                
                <div className="group text-center">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-accent to-accent/80 flex items-center justify-center mb-6 shadow-etched group-hover:scale-105 transition-all duration-150">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-ink mb-3 font-serif">SRD 5.1 Complete</h3>
                  <p className="text-muted leading-relaxed">Full coverage of official D&D 5e System Reference Document with extensible architecture.</p>
                </div>
                
                <div className="group text-center">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-gold to-gold/80 flex items-center justify-center mb-6 shadow-etched group-hover:scale-105 transition-all duration-150">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-ink mb-3 font-serif">Lightning Fast</h3>
                  <p className="text-muted leading-relaxed">DPR evaluation across AC 10-30 in under 25ms using optimized Web Workers.</p>
                </div>
              </div>
            </div>
          </Panel>
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
  featured?: boolean
}

function FeatureCard({ icon: Icon, title, description, to, featured }: FeatureCardProps) {
  return (
    <Panel className={`group relative transition-all duration-150 hover:shadow-etched h-full p-8 ${
      featured ? 'ring-2 ring-accent/30 glow' : ''
    }`}>
      {/* Icon */}
      <div className="relative mb-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-accent/80 shadow-etched transition-all duration-150 group-hover:scale-105">
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-ink mb-3 group-hover:text-accent transition-colors font-serif">
          {title}
        </h3>
        
        <p className="text-muted leading-relaxed mb-6 flex-1">
          {description}
        </p>
        
        <Link 
          to={to}
          className="inline-flex items-center text-sm font-semibold text-accent hover:text-gold transition-colors group/link"
        >
          Explore feature
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </Panel>
  )
}