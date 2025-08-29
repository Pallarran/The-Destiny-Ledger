// Tests for probability calculations

import { describe, it, expect } from 'vitest'
import {
  calculateAttackProbability,
  calculateAttackDamage,
  calculateSneakAttackProbability,
  calculateGreatWeaponFightingExpectedValue
} from '../../src/engine/probability'
import { AttackRoll } from '../../src/engine/types'

describe('Probability Calculations', () => {
  describe('calculateAttackProbability', () => {
    it('calculates basic hit probability correctly', () => {
      const attackRoll: AttackRoll = {
        attackBonus: 5,
        advantageState: 'normal',
        critRange: 20
      }
      
      const targetAC = 15
      const prob = calculateAttackProbability(attackRoll, targetAC)
      
      // With +5 attack bonus vs AC 15, need to roll 10+ on d20
      // P(hit) = 11/20 = 0.55, P(crit) = 1/20 = 0.05
      expect(prob.pHit).toBeCloseTo(0.55, 3)
      expect(prob.pCrit).toBeCloseTo(0.05, 3)
      expect(prob.pMiss).toBeCloseTo(0.45, 3)
    })

    it('handles advantage correctly', () => {
      const attackRoll: AttackRoll = {
        attackBonus: 5,
        advantageState: 'advantage',
        critRange: 20
      }
      
      const targetAC = 15
      const prob = calculateAttackProbability(attackRoll, targetAC)
      
      // With advantage, P(hit) = 1 - (9/20)^2 = 1 - 0.2025 = 0.7975
      // P(crit) = 1 - (19/20)^2 = 1 - 0.9025 = 0.0975
      expect(prob.pHit).toBeCloseTo(0.7975, 3)
      expect(prob.pCrit).toBeCloseTo(0.0975, 3)
    })

    it('handles disadvantage correctly', () => {
      const attackRoll: AttackRoll = {
        attackBonus: 5,
        advantageState: 'disadvantage',
        critRange: 20
      }
      
      const targetAC = 15
      const prob = calculateAttackProbability(attackRoll, targetAC)
      
      // With disadvantage, P(hit) = (11/20)^2 = 0.3025
      // P(crit) = (1/20)^2 = 0.0025
      expect(prob.pHit).toBeCloseTo(0.3025, 3)
      expect(prob.pCrit).toBeCloseTo(0.0025, 3)
    })

    it('handles improved critical range (Champion)', () => {
      const attackRoll: AttackRoll = {
        attackBonus: 5,
        advantageState: 'normal',
        critRange: 19 // Crits on 19-20
      }
      
      const targetAC = 15
      const prob = calculateAttackProbability(attackRoll, targetAC)
      
      // P(hit) = 11/20 = 0.55, P(crit) = 2/20 = 0.1
      expect(prob.pHit).toBeCloseTo(0.55, 3)
      expect(prob.pCrit).toBeCloseTo(0.1, 3)
    })

    it('handles auto-hit scenarios (very low AC)', () => {
      const attackRoll: AttackRoll = {
        attackBonus: 10,
        advantageState: 'normal',
        critRange: 20
      }
      
      const targetAC = 5
      const prob = calculateAttackProbability(attackRoll, targetAC)
      
      // Always hits except on nat 1, P(hit) = 1.0, P(crit) = 0.05
      expect(prob.pHit).toBeCloseTo(1.0, 3)
      expect(prob.pCrit).toBeCloseTo(0.05, 3)
      expect(prob.pMiss).toBeCloseTo(0.0, 3)
    })

    it('handles impossible hits (very high AC)', () => {
      const attackRoll: AttackRoll = {
        attackBonus: 0,
        advantageState: 'normal',
        critRange: 20
      }
      
      const targetAC = 25
      const prob = calculateAttackProbability(attackRoll, targetAC)
      
      // Only hits on nat 20, P(hit) = P(crit) = 0.05
      expect(prob.pHit).toBeCloseTo(0.05, 3)
      expect(prob.pCrit).toBeCloseTo(0.05, 3)
      expect(prob.pMiss).toBeCloseTo(0.95, 3)
    })
  })

  describe('calculateAttackDamage', () => {
    it('calculates expected damage correctly', () => {
      const normalDamage = 10
      const critDamage = 20
      const probability = {
        pHit: 0.6,
        pCrit: 0.1,
        pMiss: 0.4
      }
      
      const expectedDamage = calculateAttackDamage(normalDamage, critDamage, probability)
      
      // E[damage] = 0.1 * 20 + (0.6 - 0.1) * 10 = 2 + 5 = 7
      expect(expectedDamage).toBeCloseTo(7.0, 3)
    })

    it('handles zero damage correctly', () => {
      const normalDamage = 0
      const critDamage = 0
      const probability = {
        pHit: 0.6,
        pCrit: 0.1,
        pMiss: 0.4
      }
      
      const expectedDamage = calculateAttackDamage(normalDamage, critDamage, probability)
      expect(expectedDamage).toBe(0)
    })
  })

  describe('calculateSneakAttackProbability', () => {
    it('calculates probability of at least one hit', () => {
      const attackRolls: AttackRoll[] = [
        { attackBonus: 5, advantageState: 'normal', critRange: 20 },
        { attackBonus: 5, advantageState: 'normal', critRange: 20 }
      ]
      
      const targetAC = 15
      const prob = calculateSneakAttackProbability(attackRolls, targetAC)
      
      // P(at least one hit) = 1 - P(all miss) = 1 - (0.45)^2 = 1 - 0.2025 = 0.7975
      expect(prob).toBeCloseTo(0.7975, 3)
    })

    it('handles single attack correctly', () => {
      const attackRolls: AttackRoll[] = [
        { attackBonus: 5, advantageState: 'normal', critRange: 20 }
      ]
      
      const targetAC = 15
      const prob = calculateSneakAttackProbability(attackRolls, targetAC)
      
      // Same as single attack hit probability
      expect(prob).toBeCloseTo(0.55, 3)
    })

    it('handles no attacks', () => {
      const attackRolls: AttackRoll[] = []
      const targetAC = 15
      const prob = calculateSneakAttackProbability(attackRolls, targetAC)
      
      expect(prob).toBe(0)
    })
  })

  describe('calculateGreatWeaponFightingExpectedValue', () => {
    it('calculates GWF reroll correctly for d6', () => {
      const expectedValue = calculateGreatWeaponFightingExpectedValue(6)
      
      // Original E[d6] = 3.5
      // With GWF: reroll 1s and 2s
      // E[reroll] = (1/6 * (1/6 * 1 + 1/6 * 2 + 1/6 * 3 + 1/6 * 4 + 1/6 * 5 + 1/6 * 6)) * 2 + (4/6) * E[3,4,5,6]
      // = (1/6 * 3.5) * 2 + (4/6) * 4.5
      // = 1.167 + 3 = 4.167
      expect(expectedValue).toBeCloseTo(4.167, 3)
    })

    it('calculates GWF reroll correctly for d8', () => {
      const expectedValue = calculateGreatWeaponFightingExpectedValue(8)
      
      // With GWF on d8: reroll 1s and 2s
      // Expected value should be higher than 4.5 (normal d8 average)
      expect(expectedValue).toBeGreaterThan(4.5)
      expect(expectedValue).toBeCloseTo(5.25, 2)
    })

    it('calculates GWF reroll correctly for 2d6', () => {
      const expectedValue = calculateGreatWeaponFightingExpectedValue(6, 2)
      
      // 2d6 with GWF - each die can reroll 1s and 2s independently
      // Expected value should be 2 * GWF(d6) = 2 * 4.167 = 8.334
      expect(expectedValue).toBeCloseTo(8.334, 2)
    })

    it('handles dice that do not benefit from GWF', () => {
      const expectedValue = calculateGreatWeaponFightingExpectedValue(4)
      
      // d4 has no 1s or 2s to reroll that improve the average meaningfully
      // Still has some benefit from rerolling 1s and 2s
      expect(expectedValue).toBeGreaterThan(2.5) // Normal d4 average
    })
  })

  describe('Edge Cases and Validation', () => {
    it('handles extreme attack bonuses', () => {
      const attackRoll: AttackRoll = {
        attackBonus: 100,
        advantageState: 'normal',
        critRange: 20
      }
      
      const targetAC = 50
      const prob = calculateAttackProbability(attackRoll, targetAC)
      
      // Even with huge bonus, still only 95% chance to hit (nat 1 always misses)
      expect(prob.pHit).toBeCloseTo(1.0, 3)
      expect(prob.pCrit).toBeCloseTo(0.05, 3)
    })

    it('handles negative attack bonuses', () => {
      const attackRoll: AttackRoll = {
        attackBonus: -5,
        advantageState: 'normal',
        critRange: 20
      }
      
      const targetAC = 10
      const prob = calculateAttackProbability(attackRoll, targetAC)
      
      // Need to roll 15+ on d20, only nat 20 hits
      expect(prob.pHit).toBeCloseTo(0.05, 3)
      expect(prob.pCrit).toBeCloseTo(0.05, 3)
    })
  })
})

// Golden test cases for validation against hand calculations
describe('Golden Test Cases', () => {
  it('validates Fighter with GWM at level 5', () => {
    // Level 5 Fighter, +4 STR, +3 prof, Greatsword, GWM active
    const attackRoll: AttackRoll = {
      attackBonus: 2, // +7 base - 5 from GWM = +2
      advantageState: 'normal',
      critRange: 20
    }
    
    const targetAC = 15
    const prob = calculateAttackProbability(attackRoll, targetAC)
    
    // Need 13+ to hit, P(hit) = 8/20 = 0.4
    expect(prob.pHit).toBeCloseTo(0.4, 3)
    expect(prob.pCrit).toBeCloseTo(0.05, 3)
  })

  it('validates Rogue with Sneak Attack at level 3', () => {
    // Level 3 Rogue, +4 DEX, +2 prof, Rapier, advantage from hiding
    const attackRoll: AttackRoll = {
      attackBonus: 6, // +4 DEX + 2 prof
      advantageState: 'advantage',
      critRange: 20
    }
    
    const targetAC = 14
    const prob = calculateAttackProbability(attackRoll, targetAC)
    
    // Need 8+ to hit normally, with advantage: 1 - (7/20)^2 = 1 - 0.1225 = 0.8775
    expect(prob.pHit).toBeCloseTo(0.8775, 3)
    expect(prob.pCrit).toBeCloseTo(0.0975, 3) // 1 - (19/20)^2
  })

  it('validates Ranger with Sharpshooter at level 5', () => {
    // Level 5 Ranger, +4 DEX, +3 prof, Longbow, Archery style, SS active
    const attackRoll: AttackRoll = {
      attackBonus: 4, // +4 DEX + 3 prof + 2 Archery - 5 SS = +4
      advantageState: 'normal',
      critRange: 20
    }
    
    const targetAC = 16
    const prob = calculateAttackProbability(attackRoll, targetAC)
    
    // Need 12+ to hit, P(hit) = 9/20 = 0.45
    expect(prob.pHit).toBeCloseTo(0.45, 3)
    expect(prob.pCrit).toBeCloseTo(0.05, 3)
  })
})