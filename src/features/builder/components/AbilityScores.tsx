import { useState } from 'react'
import { Dice6, Plus, Minus } from 'lucide-react'
import { AbilityScores as AbilityScoresType } from '../../../stores/types'
import { abilities } from '../../../rules/loader'

interface AbilityScoresProps {
  abilityScores: AbilityScoresType
  onChange: (scores: AbilityScoresType) => void
}

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8]
const POINT_BUY_DEFAULT = { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 }
const POINT_BUY_COSTS = [0, 1, 2, 3, 4, 5, 7, 9]

export function AbilityScores({ abilityScores, onChange }: AbilityScoresProps) {
  const [pointBuySpent, setPointBuySpent] = useState(0)
  
  const handleMethodChange = (method: AbilityScoresType['method']) => {
    let newScores = { ...abilityScores.scores }
    
    switch (method) {
      case 'standard':
        // Assign standard array in default order
        newScores = {
          STR: STANDARD_ARRAY[0],
          DEX: STANDARD_ARRAY[1], 
          CON: STANDARD_ARRAY[2],
          INT: STANDARD_ARRAY[3],
          WIS: STANDARD_ARRAY[4],
          CHA: STANDARD_ARRAY[5],
        }
        break
      case 'pointbuy':
        newScores = { ...POINT_BUY_DEFAULT }
        setPointBuySpent(0)
        break
      case 'manual':
        // Keep current scores for manual entry
        break
    }
    
    onChange({
      method,
      scores: newScores,
      pointBuyLimit: method === 'pointbuy' ? 27 : undefined
    })
  }

  const handleScoreChange = (abilityId: keyof AbilityScoresType['scores'], value: number) => {
    const newScores = { ...abilityScores.scores, [abilityId]: value }
    
    if (abilityScores.method === 'pointbuy') {
      // Calculate point buy cost
      const totalCost = Object.values(newScores).reduce((sum, score) => {
        const cost = score >= 8 && score <= 15 ? POINT_BUY_COSTS[score - 8] : 0
        return sum + cost
      }, 0)
      
      if (totalCost <= 27) {
        setPointBuySpent(totalCost)
        onChange({ ...abilityScores, scores: newScores })
      }
    } else {
      onChange({ ...abilityScores, scores: newScores })
    }
  }

  return (
    <div className="panel p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-ink mb-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-accent-arcane/20 flex items-center justify-center border border-accent-arcane/30">
            <Dice6 className="w-4 h-4 text-accent-arcane" />
          </div>
          Ability Scores
        </h2>
        <p className="text-muted-ink">Set your character's fundamental attributes</p>
      </div>
      
      {/* Method Selection matching concept */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-semibold text-ink">Method</span>
          <div className="flex gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="method"
                checked={abilityScores.method === 'pointbuy'}
                onChange={() => handleMethodChange('pointbuy')}
                className="text-accent-arcane"
              />
              <span className="text-sm text-ink">Point Buy</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="method"
                checked={abilityScores.method === 'pointbuy'}
                onChange={() => handleMethodChange('pointbuy')}
                className="text-accent-arcane"
              />
              <span className="text-sm text-ink">Point Buy</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={abilityScores.method === 'manual'}
                onChange={() => handleMethodChange('manual')}
                className="text-accent-arcane"
              />
              <span className="text-sm text-ink">Manual</span>
            </label>
          </div>
        </div>

        {/* Point Buy Progress matching concept */}
        {abilityScores.method === 'pointbuy' && (
          <div className="bg-accent-arcane/10 border border-accent-arcane/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-accent-arcane">Point Buy Budget</span>
              <span className="text-sm font-bold text-ink">{pointBuySpent}/27 points spent</span>
            </div>
            <div className="w-full bg-border-etch rounded-full h-2">
              <div 
                className="bg-accent-arcane h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((pointBuySpent / 27) * 100, 100)}%` }}
              />
            </div>
            {pointBuySpent < 27 && (
              <p className="text-sm text-muted-ink mt-2 font-medium">
                Unspent Point Buy points
              </p>
            )}
          </div>
        )}
      </div>

      {/* Ornate Ability Score Cards exactly matching concept image */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {abilities.map(ability => {
          const score = abilityScores.scores[ability.shortName as keyof AbilityScoresType['scores']]
          const modifier = Math.floor((score - 10) / 2)
          
          return (
            <div key={ability.id} className="ability-card group relative">
              {/* Ornate top icon matching concept */}
              <div className="w-8 h-8 mx-auto mb-3 rounded bg-border-etch flex items-center justify-center">
                <span className="text-xs font-bold text-ink">{ability.shortName.charAt(0)}</span>
              </div>
              
              {/* Ability Name */}
              <div className="text-center mb-4">
                <div className="text-sm font-bold text-ink">{ability.shortName}</div>
              </div>
              
              {/* Large Score Display exactly like concept */}
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-ink">{score}</div>
              </div>
              
              {/* Warning/Modifier Badge */}
              {modifier > 0 && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-accent-gold rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-ink">!</span>
                  </div>
                </div>
              )}
              
              {/* Adjustment Buttons exactly matching concept */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={() => handleScoreChange(
                    ability.shortName as keyof AbilityScoresType['scores'], 
                    Math.max((abilityScores.method === 'pointbuy' ? 8 : 3), score - 1)
                  )}
                  className="w-8 h-8 rounded-full bg-border-etch hover:bg-accent-gold flex items-center justify-center transition-colors"
                  disabled={score <= (abilityScores.method === 'pointbuy' ? 8 : 3)}
                >
                  <Minus className="w-4 h-4 text-ink" />
                </button>
                
                <button
                  onClick={() => handleScoreChange(
                    ability.shortName as keyof AbilityScoresType['scores'], 
                    Math.min((abilityScores.method === 'pointbuy' ? 15 : 20), score + 1)
                  )}
                  className="w-8 h-8 rounded-full bg-border-etch hover:bg-accent-gold flex items-center justify-center transition-colors"
                  disabled={score >= (abilityScores.method === 'pointbuy' ? 15 : 20)}
                >
                  <Plus className="w-4 h-4 text-ink" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Validation Section matching concept */}
      <div className="validation-bar">
        <h4 className="text-sm font-semibold text-panel mb-3 flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent-arcane/20 flex items-center justify-center">
            <span className="text-xs text-accent-arcane">✓</span>
          </div>
          Validation
        </h4>
        <div className="flex items-center gap-2 text-sm text-danger mb-2">
          <div className="w-4 h-4 rounded-full bg-danger/20 flex items-center justify-center">
            <span className="text-xs text-danger">!</span>
          </div>
          <span>Concentration Conflict: Haste & Bless enabled</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-danger">
          <div className="w-4 h-4 rounded-full bg-danger/20 flex items-center justify-center">
            <span className="text-xs text-danger">!</span>
          </div>
          <span>Missing Proficiency: Acrobatics</span>
        </div>
      </div>
    </div>
  )
}