import { useState } from 'react'
import { Build, AbilityScores as AbilityScoresType, LevelTimeline, BuildFeat, Gear, BuildBuff, SimConfig } from '../../stores/types'
import { AbilityScores } from './components/AbilityScores'
import { ClassSelection } from './components/ClassSelection'
import { FeatSelection } from './components/FeatSelection'
import { GearEditor } from './components/GearEditor'
import { ScrollText, Sword, Star, Package } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Modern Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Character Builder
              </h1>
              <p className="text-lg text-gray-600">
                Create optimized D&D 5e builds with precision
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Auto-saved</span>
              </div>
            </div>
          </div>
          
          {/* Character Name - Modern Input */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Character Name
            </label>
            <input
              type="text"
              value={build.name}
              onChange={(e) => setBuild(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter your character's name..."
            />
          </div>
        </div>

        {/* Modern Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <nav className="flex space-x-1" role="tablist">
              {sections.map(({ id, icon: Icon, name }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  role="tab"
                  aria-selected={activeSection === id}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeSection === id
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm'
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
          </div>
        </div>

        {/* Modern Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
          <div className="p-8">
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
        </div>

        {/* Modern Build Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Build Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-700 mb-1">Character Level</p>
                  <p className="text-2xl font-bold text-indigo-900">{build.levelTimeline.length}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-200 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600 text-lg font-bold">{build.levelTimeline.length}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700 mb-1">Feats Selected</p>
                  <p className="text-2xl font-bold text-emerald-900">{build.feats.length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-200 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700 mb-1">Weapons Equipped</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {[build.gear.mainHand, build.gear.offHand, build.gear.ranged].filter(Boolean).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-200 rounded-lg flex items-center justify-center">
                  <Sword className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}