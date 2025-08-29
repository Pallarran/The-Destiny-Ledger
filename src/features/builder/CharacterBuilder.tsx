import { useState } from 'react'
import { Build, AbilityScores as AbilityScoresType, BuildFeat, Gear } from '../../stores/types'
import { AbilityScores } from './components/AbilityScores'
import { ClassSelection } from './components/ClassSelection'
import { FeatSelection } from './components/FeatSelection'
import { GearEditor } from './components/GearEditor'
import { ScrollText, Sword, Star, Package, Save, Share, Dice6, Edit3 } from 'lucide-react'

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


  return (
    <div className="min-h-screen bg-bg">
      {/* Dark Chrome Header from concept image */}
      <div className="chrome-header">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent-arcane/20 flex items-center justify-center border border-accent-arcane/30">
                <ScrollText className="w-5 h-5 text-accent-arcane" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-panel tracking-tight">
                CHARACTER BUILDER
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="parchment-button text-sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
              <button className="parchment-button primary text-sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Character Identity Card matching concept */}
        <div className="panel p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-accent-arcane/20 flex items-center justify-center border border-accent-arcane/30">
              <ScrollText className="w-6 h-6 text-accent-arcane" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-ink">Sir Kaelen</h2>
              <p className="text-muted-ink">Race & Subrace: Human (Variant Human)</p>
            </div>
          </div>
        </div>

        {/* Parchment Tab Navigation matching concept */}
        <div className="tab-list">
          <nav className="flex space-x-1" role="tablist">
            {[
              { id: 'identity', name: 'Identity', icon: ScrollText },
              { id: 'basics', name: 'Ability Scores', icon: Dice6 },
              { id: 'class', name: 'Class & Levels', icon: Sword },
              { id: 'feats', name: 'Feats', icon: Star },
              { id: 'gear', name: 'Gear', icon: Package },
              { id: 'notes', name: 'Notes', icon: Edit3 }
            ].map(({ id, icon: Icon, name }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id as 'basics' | 'class' | 'feats' | 'gear')}
                role="tab"
                aria-selected={activeSection === id}
                className={`tab-button ${activeSection === id ? 'active' : ''}`}
              >
                <Icon className="h-4 w-4" />
                <span>{name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area with sidebar matching concept */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
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

          {/* Level Timeline Sidebar matching concept */}
          <div className="level-timeline p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif font-bold text-ink">Level Timeline</h3>
              <button className="text-ink hover:text-accent-arcane">×</button>
            </div>
            
            {/* Level progression matching concept image */}
            <div className="space-y-4">
              {[
                { level: 1, class: '', icon: '1' },
                { level: 2, class: '', icon: '1' },
                { level: 4, class: 'Fighter', icon: '6' },
                { level: 5, class: '', icon: '7' },
                { level: 7, class: 'Art', icon: '8' },
                { level: 7, class: 'Rogue', icon: '10' },
                { level: 6, class: 'ASI / Feat', icon: '11' },
                { level: 11, class: 'Feat', icon: '11' },
                { level: 15, class: 'Rogue', icon: '11' },
                { level: 12, class: 'Buffs', icon: '13' },
                { level: 20, class: 'LJulis', icon: '20' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="level-marker">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink">{item.level}</div>
                    <div className="text-xs text-muted-ink">{item.class}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Build Summary */}
        <div className="parchment-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
              <span className="text-xs text-primary font-bold">Σ</span>
            </div>
            Build Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">Character Level</p>
                  <p className="text-2xl font-bold text-foreground">{build.levelTimeline.length}</p>
                </div>
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center arcane-border">
                  <span className="text-primary font-bold">{build.levelTimeline.length}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-400">Feats Selected</p>
                  <p className="text-2xl font-bold text-foreground">{build.feats.length}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                  <Star className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-400">Weapons Equipped</p>
                  <p className="text-2xl font-bold text-foreground">
                    {[build.gear.mainHand, build.gear.offHand, build.gear.ranged].filter(Boolean).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center border border-amber-500/30">
                  <Package className="h-5 w-5 text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}