// Ability Score Management Component

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { abilities } from '@/rules'

export interface AbilityScoresState {
  method: 'standard' | 'pointbuy' | 'manual'
  scores: {
    STR: number
    DEX: number
    CON: number
    INT: number
    WIS: number
    CHA: number
  }
  pointBuyRemaining?: number
}

interface AbilityScoresProps {
  value: AbilityScoresState
  onChange: (value: AbilityScoresState) => void
}

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8]
const POINT_BUY_COSTS = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
}

export function AbilityScores({ value, onChange }: AbilityScoresProps) {
  const [assignableScores, setAssignableScores] = useState<number[]>(STANDARD_ARRAY)

  const handleMethodChange = (method: AbilityScoresState['method']) => {
    let newScores = value.scores
    let pointBuyRemaining = undefined

    if (method === 'standard') {
      // Reset to default assignment
      newScores = { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 }
    } else if (method === 'pointbuy') {
      // Set to base point buy values
      newScores = { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 }
      pointBuyRemaining = 27
    }

    onChange({
      ...value,
      method,
      scores: newScores,
      pointBuyRemaining
    })
  }

  const handleScoreChange = (ability: keyof AbilityScoresState['scores'], newScore: number) => {
    const newScores = { ...value.scores, [ability]: newScore }

    if (value.method === 'pointbuy') {
      // Calculate remaining points
      const totalCost = Object.values(newScores).reduce((sum, score) => {
        return sum + (POINT_BUY_COSTS[score as keyof typeof POINT_BUY_COSTS] || 0)
      }, 0)
      const remaining = 27 - totalCost

      onChange({
        ...value,
        scores: newScores,
        pointBuyRemaining: remaining
      })
    } else {
      onChange({
        ...value,
        scores: newScores
      })
    }
  }

  const getModifier = (score: number) => {
    return Math.floor((score - 10) / 2)
  }

  const formatModifier = (modifier: number) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ability Scores</CardTitle>
        <CardDescription>
          Determine your character's core abilities using one of the standard methods.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Method Selection */}
        <div className="space-y-2">
          <Label>Generation Method</Label>
          <Select value={value.method} onValueChange={handleMethodChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Array (15, 14, 13, 12, 10, 8)</SelectItem>
              <SelectItem value="pointbuy">Point Buy (27 points)</SelectItem>
              <SelectItem value="manual">Manual Entry</SelectItem>
            </SelectContent>
          </Select>
          
          {value.method === 'pointbuy' && (
            <div className="text-sm text-muted-foreground">
              Points remaining: <span className={`font-medium ${(value.pointBuyRemaining || 0) < 0 ? 'text-red-500' : ''}`}>
                {value.pointBuyRemaining || 0}
              </span>
            </div>
          )}
        </div>

        {/* Ability Score Inputs */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {abilities.map((ability) => (
            <div key={ability.id} className="space-y-2">
              <Label className="text-sm font-medium">
                {ability.name} ({ability.shortName})
              </Label>
              
              {value.method === 'standard' ? (
                <Select
                  value={value.scores[ability.shortName].toString()}
                  onValueChange={(val) => handleScoreChange(ability.shortName, parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STANDARD_ARRAY.map((score) => (
                      <SelectItem key={score} value={score.toString()}>
                        {score} ({formatModifier(getModifier(score))})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : value.method === 'pointbuy' ? (
                <Select
                  value={value.scores[ability.shortName].toString()}
                  onValueChange={(val) => handleScoreChange(ability.shortName, parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(POINT_BUY_COSTS).map((score) => (
                      <SelectItem key={score} value={score}>
                        {score} ({formatModifier(getModifier(parseInt(score)))}) - {POINT_BUY_COSTS[parseInt(score) as keyof typeof POINT_BUY_COSTS]} pts
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-1">
                  <Input
                    type="number"
                    min={3}
                    max={20}
                    value={value.scores[ability.shortName]}
                    onChange={(e) => handleScoreChange(ability.shortName, parseInt(e.target.value) || 8)}
                    className="text-center"
                  />
                  <div className="text-xs text-center text-muted-foreground">
                    {formatModifier(getModifier(value.scores[ability.shortName]))}
                  </div>
                </div>
              )}
              
              {(value.method === 'standard' || value.method === 'pointbuy') && (
                <div className="text-xs text-center text-muted-foreground">
                  {formatModifier(getModifier(value.scores[ability.shortName]))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Point Buy Helper */}
        {value.method === 'pointbuy' && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium mb-2">Point Buy Costs</div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {Object.entries(POINT_BUY_COSTS).map(([score, cost]) => (
                <div key={score} className="text-center">
                  <div className="font-medium">{score}</div>
                  <div className="text-muted-foreground">{cost} pts</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}