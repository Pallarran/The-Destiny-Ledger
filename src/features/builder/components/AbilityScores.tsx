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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ability Scores</h2>
        <p className="text-gray-600">Set your character's fundamental attributes</p>
      </div>
      
      {/* Modern Method Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Generation Method</h3>
          <p className="text-sm text-gray-600">Choose how to determine your ability scores</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { method: 'standard' as const, icon: Dice6, name: 'Standard Array', desc: 'Use the balanced 15, 14, 13, 12, 10, 8 array' },
            { method: 'pointbuy' as const, icon: Calculator, name: 'Point Buy', desc: 'Customize with 27 points (8-15 range)' },
            { method: 'manual' as const, icon: Edit3, name: 'Manual Entry', desc: 'Enter any scores directly' }
          ].map(({ method, icon: Icon, name, desc }) => (
            <button
              key={method}
              onClick={() => handleMethodChange(method)}
              className={`group p-5 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                abilityScores.method === method
                  ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                  : 'border-gray-300 bg-white hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  abilityScores.method === method
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-gray-900">{name}</span>
              </div>
              <p className="text-sm text-gray-600">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Modern Point Buy Display */}
      {abilityScores.method === 'pointbuy' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-700">Point Buy Budget</span>
            <span className="text-lg font-bold text-blue-900">{pointBuySpent} / 27</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(pointBuySpent / 27) * 100}%` }}
            />
          </div>
          {pointBuySpent > 27 && (
            <p className="text-sm text-red-600 mt-2 font-medium">⚠️ Exceeds point limit</p>
          )}
        </div>
      )}

      {/* Modern Ability Score Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Ability Scores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {abilities.map(ability => {
            const score = abilityScores.scores[ability.shortName as keyof AbilityScoresType['scores']]
            const modifier = Math.floor((score - 10) / 2)
            
            return (
              <div key={ability.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{ability.name}</h4>
                    <span className="text-sm text-gray-500 font-mono">{ability.shortName}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    modifier >= 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {modifier >= 0 ? '+' : ''}{modifier}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min={abilityScores.method === 'pointbuy' ? 8 : 3}
                    max={abilityScores.method === 'pointbuy' ? 15 : 20}
                    value={score}
                    onChange={(e) => handleScoreChange(
                      ability.shortName as keyof AbilityScoresType['scores'], 
                      parseInt(e.target.value) || 8
                    )}
                    className="flex-1 px-4 py-2 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Score</div>
                    <div className="text-lg font-bold text-gray-900">{score}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modern Standard Array Helper */}
      {abilityScores.method === 'standard' && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Dice6 className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Standard Array Values</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {STANDARD_ARRAY.map((value, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white border border-indigo-200 text-indigo-700">
                    {value}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Assign your highest scores (15, 14, 13) to your class's most important abilities for optimal performance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}