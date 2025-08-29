import { useState } from 'react'
import { Star, Plus, X } from 'lucide-react'
import { BuildFeat, AbilityScores } from '../../../stores/types'
import { rulesLoader } from '../../../rules/loader'

interface FeatSelectionProps {
  feats: BuildFeat[]
  levelTimeline: Array<{ level: number; asiOrFeat?: 'asi' | 'feat'; featId?: string }>
  abilityScores: AbilityScores['scores']
  onAddFeat: (feat: BuildFeat) => void
  onRemoveFeat: (featId: string) => void
  onUpdateLevelEntry: (level: number, updates: { asiOrFeat?: 'asi' | 'feat'; featId?: string; abilityIncreases?: Partial<AbilityScores['scores']> }) => void
}

export function FeatSelection({ 
  feats, 
  levelTimeline, 
  abilityScores,
  onAddFeat, 
  onRemoveFeat,
  onUpdateLevelEntry
}: FeatSelectionProps) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [selectedFeatId, setSelectedFeatId] = useState<string>('')
  const [selectedAbility, setSelectedAbility] = useState<string>('')
  
  const availableFeats = rulesLoader.getFeats()
  
  // Get levels that can take ASI or Feat
  const asiOrFeatLevels = levelTimeline.filter(entry => 
    entry.asiOrFeat === 'asi' || entry.asiOrFeat === 'feat'
  )
  
  // Get unassigned ASI/Feat levels
  const unassignedLevels = asiOrFeatLevels.filter(entry => 
    entry.asiOrFeat === 'asi' && !entry.featId
  )

  const handleLevelSelect = (level: number) => {
    setSelectedLevel(level)
    const levelEntry = levelTimeline.find(entry => entry.level === level)
    setSelectedFeatId(levelEntry?.featId || '')
    setSelectedAbility('')
  }

  const handleChooseFeat = () => {
    if (!selectedLevel || !selectedFeatId) return
    
    const feat = availableFeats.find(f => f.id === selectedFeatId)
    if (!feat) return
    
    // Check if feat has ability score increase (half-feat)
    const isHalfFeat = !!feat.abilityScoreIncrease
    
    // Create BuildFeat
    const buildFeat: BuildFeat = {
      id: feat.id,
      name: feat.name,
      halfFeat: isHalfFeat ? {
        abilityChoices: (feat.abilityScoreIncrease?.options || []) as Array<keyof AbilityScores['scores']>,
        selectedAbility: selectedAbility as keyof AbilityScores['scores']
      } : undefined
    }
    
    // Add feat and update level entry
    onAddFeat(buildFeat)
    onUpdateLevelEntry(selectedLevel, {
      asiOrFeat: 'feat',
      featId: feat.id
    })
    
    // Clear selection
    setSelectedLevel(null)
    setSelectedFeatId('')
    setSelectedAbility('')
  }

  const handleChooseASI = (level: number) => {
    // For now, just mark as ASI - full ASI selection would need another component
    onUpdateLevelEntry(level, {
      asiOrFeat: 'asi',
      featId: undefined,
      abilityIncreases: { STR: 1, DEX: 1 } // Placeholder - should be user-selected
    })
  }

  const handleRemoveFeatFromLevel = (level: number) => {
    const levelEntry = levelTimeline.find(entry => entry.level === level)
    if (levelEntry?.featId) {
      onRemoveFeat(levelEntry.featId)
      onUpdateLevelEntry(level, {
        asiOrFeat: 'asi',
        featId: undefined,
        abilityIncreases: undefined
      })
    }
  }

  return (
    <div className="card-fantasy p-6">
      <h3 className="text-xl font-serif font-bold text-arcane-800 mb-4">Feats & Ability Score Improvements</h3>
      
      {/* Available ASI/Feat Levels */}
      {asiOrFeatLevels.length > 0 && (
        <div className="mb-6">
          <h4 className="font-serif font-semibold text-arcane-800 mb-3">ASI/Feat Levels</h4>
          <div className="space-y-2">
            {asiOrFeatLevels.map(entry => (
              <div key={entry.level} className="p-3 bg-parchment-50 rounded-lg border border-parchment-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold font-mono text-arcane-700">Level {entry.level}</span>
                  {entry.featId ? (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="font-serif text-arcane-800">
                        Feat: {availableFeats.find(f => f.id === entry.featId)?.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-parchment-600 font-serif">
                      {entry.asiOrFeat === 'asi' ? 'Ability Score Improvement' : 'Available for ASI/Feat'}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {!entry.featId && (
                    <>
                      <button
                        onClick={() => handleLevelSelect(entry.level)}
                        className="px-3 py-1 text-sm bg-arcane-600 text-white rounded hover:bg-arcane-700 transition-colors"
                      >
                        Choose Feat
                      </button>
                      <button
                        onClick={() => handleChooseASI(entry.level)}
                        className="px-3 py-1 text-sm bg-parchment-300 text-arcane-800 rounded hover:bg-parchment-400 transition-colors"
                      >
                        Take ASI
                      </button>
                    </>
                  )}
                  {entry.featId && (
                    <button
                      onClick={() => handleRemoveFeatFromLevel(entry.level)}
                      className="p-1 text-red-600 hover:text-red-800 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feat Selection Modal */}
      {selectedLevel && (
        <div className="mb-6 p-4 bg-arcane-50 rounded-lg border-2 border-arcane-300">
          <h4 className="font-serif font-semibold text-arcane-800 mb-3">
            Choose Feat for Level {selectedLevel}
          </h4>
          
          {/* Feat Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-serif font-medium text-parchment-700 mb-2">
              Available Feats
            </label>
            <select
              value={selectedFeatId}
              onChange={(e) => setSelectedFeatId(e.target.value)}
              className="w-full px-3 py-2 border border-parchment-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-arcane-500"
            >
              <option value="">Select a feat...</option>
              {availableFeats.map(feat => (
                <option key={feat.id} value={feat.id}>
                  {feat.name}
                  {feat.abilityScoreIncrease ? ' (Half-Feat)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Feat Description */}
          {selectedFeatId && (
            <div className="mb-4 p-3 bg-parchment-50 rounded-lg border border-parchment-200">
              {(() => {
                const feat = availableFeats.find(f => f.id === selectedFeatId)
                if (!feat) return null
                
                return (
                  <>
                    <div className="font-serif font-semibold text-arcane-800 mb-2">
                      {feat.name}
                      {feat.abilityScoreIncrease && (
                        <span className="ml-2 px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded">
                          Half-Feat
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-parchment-700 mb-3">
                      {feat.description}
                    </div>
                    {feat.prerequisite && (
                      <div className="text-sm text-red-700 font-medium">
                        Prerequisite: {feat.prerequisite}
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          )}

          {/* Half-Feat Ability Selection */}
          {selectedFeatId && (() => {
            const feat = availableFeats.find(f => f.id === selectedFeatId)
            return feat?.abilityScoreIncrease && (
              <div className="mb-4">
                <label className="block text-sm font-serif font-medium text-parchment-700 mb-2">
                  Choose Ability Score to Increase (+1)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {feat.abilityScoreIncrease.options.map(ability => (
                    <button
                      key={ability}
                      onClick={() => setSelectedAbility(ability)}
                      className={`px-3 py-2 rounded border transition-colors ${
                        selectedAbility === ability
                          ? 'border-arcane-500 bg-arcane-100 text-arcane-800'
                          : 'border-parchment-300 bg-parchment-50 hover:border-arcane-300'
                      }`}
                    >
                      <div className="font-mono font-bold">{ability}</div>
                      <div className="text-xs">
                        {abilityScores[ability as keyof typeof abilityScores]}
                        → {abilityScores[ability as keyof typeof abilityScores] + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleChooseFeat}
              disabled={!selectedFeatId || ((() => {
                const feat = availableFeats.find(f => f.id === selectedFeatId)
                return feat?.abilityScoreIncrease && !selectedAbility
              })())}
              className="btn-arcane disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Take Feat
            </button>
            <button
              onClick={() => {
                setSelectedLevel(null)
                setSelectedFeatId('')
                setSelectedAbility('')
              }}
              className="btn-parchment"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Current Feats */}
      <div>
        <h4 className="font-serif font-semibold text-arcane-800 mb-3">Selected Feats</h4>
        {feats.length === 0 ? (
          <div className="text-center py-6 text-parchment-500">
            <p className="font-serif">No feats selected</p>
            <p className="text-sm">Feats become available at levels 4, 8, 12, 16, and 19</p>
          </div>
        ) : (
          <div className="space-y-3">
            {feats.map(buildFeat => {
              const feat = availableFeats.find(f => f.id === buildFeat.id)
              if (!feat) return null
              
              return (
                <div key={buildFeat.id} className="p-3 bg-parchment-50 rounded-lg border border-parchment-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="font-serif font-semibold text-arcane-800">
                        {feat.name}
                      </span>
                      {buildFeat.halfFeat && (
                        <span className="px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded">
                          +1 {buildFeat.halfFeat.selectedAbility}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onRemoveFeat(buildFeat.id)}
                      className="p-1 text-red-600 hover:text-red-800 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-sm text-parchment-600">
                    {feat.description}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}