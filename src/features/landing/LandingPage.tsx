import { Link } from 'react-router-dom'
import { Sword, Calculator, BarChart3, Map, Archive, ArrowRight, TrendingUp, Sparkles, Shield, Target, BookOpen, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function LandingPage() {
  return (
    <div className="relative">
      {/* Ultra Modern Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-violet-50/50" />
        <div className="absolute top-0 right-0 -z-10 h-full w-full opacity-30">
          <div className="absolute top-20 right-20 h-96 w-96 rounded-full bg-gradient-to-r from-blue-400 to-violet-400 opacity-20 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 h-80 w-80 rounded-full bg-gradient-to-r from-indigo-400 to-blue-400 opacity-20 blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-6 pt-20 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center pb-24 lg:pb-32">
            {/* Professional Badge */}
            <div className="mb-8 flex justify-center">
              <Badge variant="secondary" className="glass text-sm px-4 py-2">
                <Sparkles className="mr-2 h-4 w-4 text-blue-600" />
                Professional D&D 5e Optimization
              </Badge>
            </div>
            
            {/* Hero Title */}
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
              The{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Destiny Ledger
              </span>
            </h1>
            
            {/* Hero Description */}
            <p className="mt-8 text-xl leading-8 text-muted-foreground max-w-3xl mx-auto">
              The most advanced D&D 5e character optimizer. Build, analyze, and perfect your heroes with
              {' '}<strong className="font-semibold text-foreground">mathematical precision</strong> and{' '}
              <strong className="font-semibold text-foreground">professional-grade tools</strong>.
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
                    <div className="text-4xl font-bold text-foreground group-hover:text-blue-600 transition-colors">50+</div>
                    <div className="mt-2 text-sm text-muted-foreground font-medium">Classes & Subclasses</div>
                  </div>
                  <div className="group cursor-default">
                    <div className="text-4xl font-bold text-foreground group-hover:text-blue-600 transition-colors">100%</div>
                    <div className="mt-2 text-sm text-muted-foreground font-medium">Mathematical Accuracy</div>
                  </div>
                  <div className="group cursor-default">
                    <div className="text-4xl font-bold text-foreground group-hover:text-blue-600 transition-colors">1-20</div>
                    <div className="mt-2 text-sm text-muted-foreground font-medium">Level Optimization</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Feature Grid */}
      <div className="py-24 sm:py-32 bg-background relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)] opacity-60" />
        
        <div className="container mx-auto px-6 relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                Everything you need
              </Badge>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Professional-grade optimization
            </h2>
            <p className="mt-6 text-xl leading-8 text-muted-foreground">
              Advanced tools for D&D 5e character creation, analysis, and optimization.
              Built for players who demand mathematical precision.
            </p>
          </div>
          
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
      <div className="bg-gradient-to-b from-muted/20 to-background py-24 relative">
        <div className="container mx-auto px-6 relative">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-16">
              Trusted by optimizers worldwide
            </h2>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="group text-center">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-6 shadow-luxury group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Mathematically Accurate</h3>
                <p className="text-muted-foreground leading-relaxed">Closed-form calculations with ±0.5 DPR tolerance validated against hand-calculated test cases.</p>
              </div>
              
              <div className="group text-center">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mb-6 shadow-luxury group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">SRD 5.1 Complete</h3>
                <p className="text-muted-foreground leading-relaxed">Full coverage of official D&D 5e System Reference Document with extensible architecture.</p>
              </div>
              
              <div className="group text-center">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center mb-6 shadow-luxury group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">DPR evaluation across AC 10-30 in under 25ms using optimized Web Workers.</p>
              </div>
            </div>
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
  featured?: boolean
}

function FeatureCard({ icon: Icon, title, description, to, featured }: FeatureCardProps) {
  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-luxury h-full ${
      featured ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''
    }`}>
      <CardContent className="p-8 h-full flex flex-col">
        {/* Background Effect */}
        <div className="absolute -top-6 -right-6 h-24 w-24 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl transition-all duration-300 group-hover:scale-125" />
        
        {/* Icon */}
        <div className="relative mb-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-premium transition-all duration-200 group-hover:shadow-luxury group-hover:scale-105">
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          
          <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
            {description}
          </p>
          
          <Link 
            to={to}
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors group/link"
          >
            Explore feature
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}