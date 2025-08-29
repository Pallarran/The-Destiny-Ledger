import { useState } from 'react'
import { Dice6, Calculator, Edit3 } from 'lucide-react'
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
    <div className="card-fantasy p-6">
      <h3 className="text-xl font-serif font-bold text-arcane-800 mb-4">Ability Scores</h3>
      
      {/* Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-serif font-medium text-parchment-700 mb-3">
          Generation Method
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { method: 'standard' as const, icon: Dice6, name: 'Standard Array', desc: 'Use the standard 15, 14, 13, 12, 10, 8 array' },
            { method: 'pointbuy' as const, icon: Calculator, name: 'Point Buy', desc: '27 points to distribute (8-15 range)' },
            { method: 'manual' as const, icon: Edit3, name: 'Manual Entry', desc: 'Enter scores directly' }
          ].map(({ method, icon: Icon, name, desc }) => (
            <button
              key={method}
              onClick={() => handleMethodChange(method)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                abilityScores.method === method
                  ? 'border-arcane-500 bg-arcane-50/50'
                  : 'border-parchment-300 bg-parchment-50 hover:border-arcane-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 text-arcane-600" />
                <span className="font-serif font-medium text-arcane-800">{name}</span>
              </div>
              <p className="text-xs text-parchment-600">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Point Buy Cost Display */}
      {abilityScores.method === 'pointbuy' && (
        <div className="mb-4 p-3 bg-arcane-50 rounded-lg border border-arcane-200">
          <div className="text-sm font-serif text-arcane-700">
            Points Used: <span className="font-bold">{pointBuySpent}</span> / 27
          </div>
          <div className="w-full bg-parchment-200 rounded-full h-2 mt-2">
            <div 
              className="bg-arcane-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(pointBuySpent / 27) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Ability Score Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {abilities.map(ability => {
          const score = abilityScores.scores[ability.shortName as keyof AbilityScoresType['scores']]
          const modifier = Math.floor((score - 10) / 2)
          
          return (
            <div key={ability.id} className="p-4 bg-parchment-50 rounded-lg border border-parchment-200">
              <label className="block text-sm font-serif font-medium text-arcane-700 mb-2">
                {ability.name} ({ability.shortName})
              </label>
              
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={abilityScores.method === 'pointbuy' ? 8 : 3}
                  max={abilityScores.method === 'pointbuy' ? 15 : 20}
                  value={score}
                  onChange={(e) => handleScoreChange(
                    ability.shortName as keyof AbilityScoresType['scores'], 
                    parseInt(e.target.value) || 8
                  )}
                  className="w-16 px-2 py-1 text-center border border-parchment-300 rounded font-mono text-lg focus:outline-none focus:ring-2 focus:ring-arcane-500"
                />
                
                <div className="text-center min-w-[3rem]">
                  <div className="text-xs text-parchment-600 font-serif">Modifier</div>
                  <div className={`text-lg font-bold font-mono ${
                    modifier >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {modifier >= 0 ? '+' : ''}{modifier}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Standard Array Assignment Helper */}
      {abilityScores.method === 'standard' && (
        <div className="mt-4 p-4 bg-parchment-100 rounded-lg border border-parchment-300">
          <h4 className="font-serif font-medium text-parchment-700 mb-2">Standard Array</h4>
          <p className="text-sm text-parchment-600 mb-3">
            Drag and drop or click to assign values: {STANDARD_ARRAY.join(', ')}
          </p>
          <div className="text-xs text-parchment-500">
            Tip: Assign your highest scores (15, 14, 13) to your class's primary abilities.
          </div>
        </div>
      )}
    </div>
  )
}