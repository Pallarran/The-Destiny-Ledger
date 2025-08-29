// Feat Selection Component

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { rulesLoader, Feat } from '@/rules'
import { Plus, X, Info } from 'lucide-react'

export interface SelectedFeat {
  id: string
  featId: string
  choices?: Record<string, string>
  abilityScoreIncrease?: Record<string, number>
  source: 'feat' | 'variant_human' | 'custom_lineage'
  level: number
}

export interface FeatSelectionState {
  feats: SelectedFeat[]
  availableASILevels: number[]
  usedASILevels: number[]
}

interface FeatSelectionProps {
  value: FeatSelectionState
  onChange: (value: FeatSelectionState) => void
  totalLevel: number
  classLevels: Array<{ classId: string; level: number }>
}

export function FeatSelection({ value, onChange, totalLevel, classLevels }: FeatSelectionProps) {
  const [selectedLevel, setSelectedLevel] = useState<number>(0)
  const [selectedFeatId, setSelectedFeatId] = useState<string>('')
  
  const feats = rulesLoader.getFeats()

  // Calculate available ASI levels based on class progression
  const getASILevels = () => {
    const asiLevels: number[] = []
    
    // Standard ASI levels for most classes: 4, 8, 12, 16, 19
    // Fighter gets additional at 6, 14
    // Rogue gets additional at 10
    
    classLevels.forEach(({ classId, level }) => {
      const standardLevels = [4, 8, 12, 16, 19].filter(l => l <= level)
      asiLevels.push(...standardLevels)
      
      if (classId === 'fighter') {
        const fighterBonusLevels = [6, 14].filter(l => l <= level)
        asiLevels.push(...fighterBonusLevels)
      }
      
      if (classId === 'rogue') {
        const rogueBonusLevels = [10].filter(l => l <= level)
        asiLevels.push(...rogueBonusLevels)
      }
    })
    
    return [...new Set(asiLevels)].sort((a, b) => a - b)
  }

  const availableASILevels = getASILevels()
  const unusedASILevels = availableASILevels.filter(level => !value.usedASILevels.includes(level))

  const addFeat = () => {
    if (!selectedLevel || !selectedFeatId) return
    
    const feat = rulesLoader.getFeat(selectedFeatId)
    if (!feat) return

    const newFeat: SelectedFeat = {
      id: `${selectedFeatId}-${Date.now()}`,
      featId: selectedFeatId,
      source: 'feat',
      level: selectedLevel,
      choices: {},
      abilityScoreIncrease: {}
    }

    onChange({
      ...value,
      feats: [...value.feats, newFeat],
      usedASILevels: [...value.usedASILevels, selectedLevel]
    })

    setSelectedLevel(0)
    setSelectedFeatId('')
  }

  const removeFeat = (featToRemove: SelectedFeat) => {
    onChange({
      ...value,
      feats: value.feats.filter(f => f.id !== featToRemove.id),
      usedASILevels: value.usedASILevels.filter(level => level !== featToRemove.level)
    })
  }

  const updateFeatChoice = (featId: string, choiceId: string, selection: string) => {
    const updatedFeats = value.feats.map(feat => {
      if (feat.id === featId) {
        return {
          ...feat,
          choices: { ...feat.choices, [choiceId]: selection }
        }
      }
      return feat
    })

    onChange({ ...value, feats: updatedFeats })
  }

  const updateAbilityIncrease = (featId: string, ability: string, increase: number) => {
    const updatedFeats = value.feats.map(feat => {
      if (feat.id === featId) {
        return {
          ...feat,
          abilityScoreIncrease: { ...feat.abilityScoreIncrease, [ability]: increase }
        }
      }
      return feat
    })

    onChange({ ...value, feats: updatedFeats })
  }

  const getFeat = (featId: string) => rulesLoader.getFeat(featId)

  const meetsPrerequisites = (feat: Feat) => {
    // For now, assume all prerequisites are met
    // In a full implementation, this would check ability scores, class levels, etc.
    return true
  }

  const canAddFeat = unusedASILevels.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feats & Ability Score Improvements</CardTitle>
        <CardDescription>
          At certain levels, you can choose to take a feat instead of increasing ability scores.
          Standard ASI levels are 4th, 8th, 12th, 16th, and 19th.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ASI Level Summary */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-sm font-medium mb-2">Available ASI Opportunities</div>
          <div className="flex flex-wrap gap-2">
            {availableASILevels.map(level => (
              <div
                key={level}
                className={`px-2 py-1 rounded text-xs ${
                  value.usedASILevels.includes(level)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                Level {level}
                {value.usedASILevels.includes(level) && ' (Feat)'}
              </div>
            ))}
          </div>
        </div>

        {/* Add New Feat */}
        {canAddFeat && (
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="text-sm font-medium">Add New Feat</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">ASI Level</Label>
                <Select value={selectedLevel.toString()} onValueChange={(val) => setSelectedLevel(parseInt(val))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose level" />
                  </SelectTrigger>
                  <SelectContent>
                    {unusedASILevels.map(level => (
                      <SelectItem key={level} value={level.toString()}>
                        Level {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Feat</Label>
                <Select value={selectedFeatId} onValueChange={setSelectedFeatId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose feat" />
                  </SelectTrigger>
                  <SelectContent>
                    {feats.filter(meetsPrerequisites).map(feat => (
                      <SelectItem key={feat.id} value={feat.id}>
                        {feat.name}
                        {feat.abilityScoreIncrease && ' (Half Feat)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedFeatId && (
              <div className="mt-3 p-3 bg-muted/25 rounded">
                <div className="text-sm font-medium mb-1">
                  {getFeat(selectedFeatId)?.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getFeat(selectedFeatId)?.description}
                </div>
                {getFeat(selectedFeatId)?.prerequisite && (
                  <div className="text-xs text-yellow-600 mt-1">
                    <span className="font-medium">Prerequisite:</span> {getFeat(selectedFeatId)?.prerequisite}
                  </div>
                )}
              </div>
            )}

            <Button onClick={addFeat} disabled={!selectedLevel || !selectedFeatId} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Feat
            </Button>
          </div>
        )}

        {/* Selected Feats */}
        <div className="space-y-4">
          {value.feats.map((selectedFeat) => {
            const feat = getFeat(selectedFeat.featId)
            if (!feat) return null

            return (
              <Card key={selectedFeat.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base font-semibold">{feat.name}</h3>
                      <p className="text-sm text-muted-foreground">Level {selectedFeat.level}</p>
                      {feat.abilityScoreIncrease && (
                        <p className="text-xs text-blue-600">Half Feat - Includes ability score increase</p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeat(selectedFeat)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground mb-3">
                    {feat.description}
                  </div>

                  {/* Ability Score Increase (Half Feats) */}
                  {feat.abilityScoreIncrease && (
                    <div className="mb-3">
                      <Label className="text-sm font-medium">Ability Score Increase (+1)</Label>
                      <Select
                        value={Object.keys(selectedFeat.abilityScoreIncrease || {})[0] || ''}
                        onValueChange={(ability) => updateAbilityIncrease(selectedFeat.id, ability, 1)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose ability to increase" />
                        </SelectTrigger>
                        <SelectContent>
                          {feat.abilityScoreIncrease.options.map(ability => (
                            <SelectItem key={ability} value={ability}>
                              {ability}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Feat Choices */}
                  {feat.choices && feat.choices.map(choice => (
                    <div key={choice.id} className="mb-3">
                      <Label className="text-sm font-medium">{choice.name}</Label>
                      <p className="text-xs text-muted-foreground mb-2">{choice.description}</p>
                      <Select
                        value={selectedFeat.choices?.[choice.id] || ''}
                        onValueChange={(selection) => updateFeatChoice(selectedFeat.id, choice.id, selection)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Make selection..." />
                        </SelectTrigger>
                        <SelectContent>
                          {choice.options.map(option => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* ASI Alternative */}
        {unusedASILevels.length > 0 && value.feats.length === 0 && (
          <div className="p-4 border border-dashed rounded-lg text-center">
            <div className="text-sm text-muted-foreground mb-2">
              <Info className="w-4 h-4 inline mr-1" />
              Instead of taking feats, you can use ASI levels to increase ability scores by +2 total
            </div>
            <div className="text-xs text-muted-foreground">
              (You can split this as +1/+1 to two different abilities or +2 to one ability)
            </div>
          </div>
        )}

        {!canAddFeat && value.feats.length === 0 && (
          <div className="p-4 border border-dashed rounded-lg text-center text-sm text-muted-foreground">
            No ASI levels available yet. Gain your first at character level 4.
          </div>
        )}
      </CardContent>
    </Card>
  )
}