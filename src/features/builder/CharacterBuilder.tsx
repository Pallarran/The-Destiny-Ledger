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
    <div className="space-y-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-serif font-bold text-arcane-800">
            Character Builder
          </h1>
          <p className="text-xl text-parchment-700">
            Forge legendary heroes with mathematical precision
          </p>
        </div>

        {/* Character Name */}
        <div className="card-fantasy p-4 mb-6">
          <label className="block text-sm font-serif font-medium text-parchment-700 mb-2">
            Character Name
          </label>
          <input
            type="text"
            value={build.name}
            onChange={(e) => setBuild(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 border border-parchment-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-arcane-500 font-serif text-lg"
            placeholder="Enter character name..."
          />
        </div>

        {/* Section Navigation */}
        <div className="card-fantasy p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {sections.map(({ id, icon: Icon, name }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  activeSection === id
                    ? 'border-arcane-500 bg-arcane-50 text-arcane-800'
                    : 'border-parchment-300 bg-parchment-50 hover:border-arcane-300 hover:bg-arcane-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-serif font-medium">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Section */}
        <div className="space-y-6">
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
        <div className="card-fantasy p-6 mt-8">
          <h3 className="text-lg font-serif font-bold text-arcane-800 mb-4">Build Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-parchment-50 p-3 rounded border">
              <div className="font-serif font-medium text-parchment-700">Level</div>
              <div className="text-xl font-bold text-arcane-800">{build.levelTimeline.length}</div>
            </div>
            <div className="bg-parchment-50 p-3 rounded border">
              <div className="font-serif font-medium text-parchment-700">Feats</div>
              <div className="text-xl font-bold text-arcane-800">{build.feats.length}</div>
            </div>
            <div className="bg-parchment-50 p-3 rounded border">
              <div className="font-serif font-medium text-parchment-700">Weapons</div>
              <div className="text-xl font-bold text-arcane-800">
                {[build.gear.mainHand, build.gear.offHand, build.gear.ranged].filter(Boolean).length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}