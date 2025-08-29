import { useState } from 'react'
import { Build, AbilityScores as AbilityScoresType, LevelTimeline, BuildFeat, Gear, BuildBuff, SimConfig } from '../../stores/types'
import { AbilityScores } from './components/AbilityScores'
import { ClassSelection } from './components/ClassSelection'
import { FeatSelection } from './components/FeatSelection'
import { GearEditor } from './components/GearEditor'
import { ScrollText, Sword, Star, Package, Save, Download, Share } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const DEFAULT_BUILD: Build = {
  id: '',
  name: 'New Character',
  createdAt: new Date(),
  updatedAt: new Date(),
  notes: '',
  version: '1.0.0',
  abilityScores: {
    method: 'standard',
    scores: { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 },
  },
  levelTimeline: [],
  feats: [],
  gear: {
    itemBonuses: [],
    riders: []
  },
  buffs: [],
  simConfig: {
    acMin: 10,
    acMax: 20,
    acStep: 1,
    round0BuffIds: [],
    greedyHeuristics: false,
    advantageState: 'normal'
  }
}

export function CharacterBuilder() {
  const [build, setBuild] = useState<Build>(DEFAULT_BUILD)
  const [activeSection, setActiveSection] = useState<'basics' | 'class' | 'feats' | 'gear'>('basics')

  const handleAbilityScoresChange = (abilityScores: AbilityScoresType) => {
    setBuild(prev => ({ ...prev, abilityScores }))
  }

  const handleAddLevel = (entry: Omit<import('../../stores/types').LevelEntry, 'level'>) => {
    const level = build.levelTimeline.length + 1
    setBuild(prev => ({
      ...prev,
      levelTimeline: [...prev.levelTimeline, { ...entry, level }]
    }))
  }

  const handleUpdateLevel = (level: number, updates: Partial<import('../../stores/types').LevelEntry>) => {
    setBuild(prev => ({
      ...prev,
      levelTimeline: prev.levelTimeline.map(entry =>
        entry.level === level ? { ...entry, ...updates } : entry
      )
    }))
  }

  const handleRemoveLevel = (level: number) => {
    setBuild(prev => ({
      ...prev,
      levelTimeline: prev.levelTimeline.filter(entry => entry.level !== level)
        .map((entry, index) => ({ ...entry, level: index + 1 }))
    }))
  }

  const handleAddFeat = (feat: BuildFeat) => {
    setBuild(prev => ({ ...prev, feats: [...prev.feats, feat] }))
  }

  const handleRemoveFeat = (featId: string) => {
    setBuild(prev => ({
      ...prev,
      feats: prev.feats.filter(f => f.id !== featId),
      levelTimeline: prev.levelTimeline.map(entry =>
        entry.featId === featId ? { ...entry, featId: undefined, asiOrFeat: 'asi' } : entry
      )
    }))
  }

  const handleUpdateLevelEntry = (
    level: number,
    updates: { asiOrFeat?: 'asi' | 'feat'; featId?: string; abilityIncreases?: Partial<AbilityScoresType['scores']> }
  ) => {
    setBuild(prev => ({
      ...prev,
      levelTimeline: prev.levelTimeline.map(entry =>
        entry.level === level ? { ...entry, ...updates } : entry
      )
    }))
  }

  const handleUpdateGear = (gearUpdates: Partial<Gear>) => {
    setBuild(prev => ({
      ...prev,
      gear: { ...prev.gear, ...gearUpdates }
    }))
  }

  const sections = [
    { id: 'basics' as const, icon: ScrollText, name: 'Ability Scores', component: AbilityScores },
    { id: 'class' as const, icon: Sword, name: 'Class & Levels', component: ClassSelection },
    { id: 'feats' as const, icon: Star, name: 'Feats & ASIs', component: FeatSelection },
    { id: 'gear' as const, icon: Package, name: 'Equipment', component: GearEditor },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Professional Header */}
      <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-b border-border">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3">
                Character Builder
              </h1>
              <p className="text-xl text-muted-foreground">
                Create and optimize your D&D 5e characters with professional tools
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="success">
                ✓ Auto-saved
              </Badge>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Character Name Card */}
      <Card>
        <CardHeader>
          <CardTitle>Character Name</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={build.name}
            onChange={(e) => setBuild(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your character's name..."
            className="text-lg"
          />
        </CardContent>
      </Card>

      {/* Professional Tab Navigation */}
      <Card>
        <CardContent className="p-4">
          <nav className="flex space-x-1" role="tablist">
            {sections.map(({ id, icon: Icon, name }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                role="tab"
                aria-selected={activeSection === id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeSection === id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${
                  activeSection === id ? 'text-indigo-600' : 'text-gray-400'
                }`} />
                <span>{name}</span>
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>

      {/* Content Area */}
      <div className="space-y-8">
        {activeSection === 'basics' && (
          <AbilityScores
            abilityScores={build.abilityScores}
            onChange={handleAbilityScoresChange}
          />
        )}

        {activeSection === 'class' && (
          <ClassSelection
            levelTimeline={build.levelTimeline}
            onAddLevel={handleAddLevel}
            onUpdateLevel={handleUpdateLevel}
            onRemoveLevel={handleRemoveLevel}
          />
        )}

        {activeSection === 'feats' && (
          <FeatSelection
            feats={build.feats}
            levelTimeline={build.levelTimeline}
            abilityScores={build.abilityScores.scores}
            onAddFeat={handleAddFeat}
            onRemoveFeat={handleRemoveFeat}
            onUpdateLevelEntry={handleUpdateLevelEntry}
          />
        )}

        {activeSection === 'gear' && (
          <GearEditor
            gear={build.gear}
            onUpdateGear={handleUpdateGear}
          />
        )}
      </div>

      {/* Build Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Build Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-700">Character Level</p>
                  <p className="text-2xl font-bold text-indigo-900">{build.levelTimeline.length}</p>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">{build.levelTimeline.length}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">Feats Selected</p>
                  <p className="text-2xl font-bold text-emerald-900">{build.feats.length}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700">Weapons Equipped</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {[build.gear.mainHand, build.gear.offHand, build.gear.ranged].filter(Boolean).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}