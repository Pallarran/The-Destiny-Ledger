// Integration tests for the complete DPR engine

import { describe, it, expect } from 'vitest'
import { 
  calculateDPR, 
  calculateDPRCurves, 
  calculateCompleteDPR 
} from '../../src/engine/dpr-engine'
import {
  rulesLoader,
  getClass,
  getWeapon,
  getFeat
} from '../../src/rules'
import { BuildConfiguration, DPRCalculationInput } from '../../src/engine/types'

describe('Complete DPR Engine Integration', () => {
  describe('Rules Integration', () => {
    it('loads SRD data correctly', () => {
      const fighter = getClass('fighter')
      expect(fighter).toBeDefined()
      expect(fighter?.name).toBe('Fighter')

      const greatsword = getWeapon('greatsword')
      expect(greatsword).toBeDefined()
      expect(greatsword?.damage.dice[0].sides).toBe(6)

      const gwm = getFeat('great_weapon_master')
      expect(gwm).toBeDefined()
      expect(gwm?.name).toBe('Great Weapon Master')
    })

    it('validates class progression correctly', () => {
      const validProgression = [
        { classId: 'fighter', level: 1 },
        { classId: 'fighter', level: 2 },
        { classId: 'rogue', level: 1 }
      ]

      const isValid = rulesLoader.validateClassProgression(validProgression)
      expect(isValid).toBe(true)

      const invalidProgression = [
        { classId: 'nonexistent', level: 1 }
      ]

      const isInvalid = rulesLoader.validateClassProgression(invalidProgression)
      expect(isInvalid).toBe(false)
    })
  })

  describe('End-to-End Build Testing', () => {
    it('processes a complete Fighter build correctly', () => {
      const fighter = getClass('fighter')!
      const greatsword = getWeapon('greatsword')!
      
      const build: BuildConfiguration = {
        level: 5,
        abilityScores: {
          STR: 18, DEX: 14, CON: 16, INT: 10, WIS: 12, CHA: 8
        },
        classFeatures: [
          {
            id: 'fighting_style',
            name: 'Fighting Style',
            value: 'great_weapon_fighting'
          },
          {
            id: 'extra_attack',
            name: 'Extra Attack',
            value: true
          },
          {
            id: 'action_surge',
            name: 'Action Surge',
            value: true
          }
        ],
        fightingStyles: [
          {
            id: 'great_weapon_fighting',
            name: 'Great Weapon Fighting',
            rerollLowDamage: true
          }
        ],
        attackSequence: {
          attacks: [{
            name: greatsword.name,
            attackRoll: {
              attackBonus: 7, // +4 STR + 3 prof
              advantageState: 'normal',
              critRange: 20
            },
            damage: {
              baseDice: '2d6',
              bonusDamage: 4,
              damageType: 'slashing'
            },
            critDamage: {
              baseDice: '2d6',
              bonusDamage: 0,
              damageType: 'slashing'
            }
          }],
          extraAttacks: 1,
          actionSurgeRound: 1
        },
        buffs: []
      }

      const input: DPRCalculationInput = {
        build,
        targetAC: 15,
        rounds: 3,
        allowRound0Buffs: false
      }

      const result = calculateDPR(input)
      
      expect(result.totalDPR).toBeGreaterThan(50)
      expect(result.totalDPR).toBeLessThan(80)
      expect(result.rounds).toHaveLength(3)
    })

    it('handles multiclass builds correctly', () => {
      const build: BuildConfiguration = {
        level: 6, // Fighter 5, Rogue 1
        abilityScores: {
          STR: 16, DEX: 16, CON: 14, INT: 10, WIS: 12, CHA: 8
        },
        classFeatures: [
          {
            id: 'extra_attack',
            name: 'Extra Attack',
            value: true
          },
          {
            id: 'sneak_attack',
            name: 'Sneak Attack',
            value: 1 // 1d6 from Rogue 1
          }
        ],
        fightingStyles: [],
        attackSequence: {
          attacks: [{
            name: 'Shortsword',
            attackRoll: {
              attackBonus: 6, // +3 DEX + 3 prof
              advantageState: 'advantage',
              critRange: 20
            },
            damage: {
              baseDice: '1d6',
              bonusDamage: 3,
              damageType: 'piercing'
            },
            critDamage: {
              baseDice: '1d6',
              bonusDamage: 0,
              damageType: 'piercing'
            }
          }],
          extraAttacks: 1,
          actionSurgeRound: 1
        },
        buffs: []
      }

      const input: DPRCalculationInput = {
        build,
        targetAC: 14,
        rounds: 3,
        allowRound0Buffs: false
      }

      const result = calculateDPR(input)
      
      expect(result.breakdown.sneakAttackDamage).toBeGreaterThan(0)
      expect(result.totalDPR).toBeGreaterThan(30)
    })
  })

  describe('Performance Validation', () => {
    it('meets performance budget for single DPR calculation', () => {
      const build: BuildConfiguration = {
        level: 10,
        abilityScores: {
          STR: 20, DEX: 14, CON: 16, INT: 10, WIS: 12, CHA: 8
        },
        classFeatures: [],
        fightingStyles: [],
        attackSequence: {
          attacks: [{
            name: 'Greatsword',
            attackRoll: {
              attackBonus: 10,
              advantageState: 'normal',
              critRange: 20
            },
            damage: {
              baseDice: '2d6',
              bonusDamage: 5,
              damageType: 'slashing'
            },
            critDamage: {
              baseDice: '2d6',
              bonusDamage: 0,
              damageType: 'slashing'
            }
          }],
          extraAttacks: 1,
          actionSurgeRound: 1
        },
        buffs: []
      }

      // Test performance of curve calculation (spec: ≤25ms for AC 10-30)
      const startTime = performance.now()
      
      const curves = calculateDPRCurves(build, { min: 10, max: 30, step: 1 }, 3)
      
      const endTime = performance.now()
      const duration = endTime - startTime

      expect(duration).toBeLessThan(25) // Performance budget
      expect(curves.ac).toHaveLength(21)
      expect(curves.normal).toHaveLength(21)
    })

    it('handles multiple rapid calculations efficiently', () => {
      const build: BuildConfiguration = {
        level: 5,
        abilityScores: {
          STR: 18, DEX: 14, CON: 16, INT: 10, WIS: 12, CHA: 8
        },
        classFeatures: [],
        fightingStyles: [],
        attackSequence: {
          attacks: [{
            name: 'Longsword',
            attackRoll: {
              attackBonus: 7,
              advantageState: 'normal',
              critRange: 20
            },
            damage: {
              baseDice: '1d8',
              bonusDamage: 4,
              damageType: 'slashing'
            },
            critDamage: {
              baseDice: '1d8',
              bonusDamage: 0,
              damageType: 'slashing'
            }
          }],
          extraAttacks: 1,
          actionSurgeRound: 1
        },
        buffs: []
      }

      const startTime = performance.now()
      
      // Perform 100 calculations to test consistency
      for (let i = 0; i < 100; i++) {
        const input: DPRCalculationInput = {
          build,
          targetAC: 10 + (i % 21),
          rounds: 3,
          allowRound0Buffs: false
        }
        calculateDPR(input)
      }
      
      const endTime = performance.now()
      const averageTime = (endTime - startTime) / 100

      expect(averageTime).toBeLessThan(5) // Should be very fast for individual calculations
    })
  })

  describe('Accuracy Validation Against Hand Calculations', () => {
    it('matches hand calculation for Level 1 Fighter', () => {
      const build: BuildConfiguration = {
        level: 1,
        abilityScores: {
          STR: 16, DEX: 14, CON: 14, INT: 10, WIS: 12, CHA: 8
        },
        classFeatures: [],
        fightingStyles: [],
        attackSequence: {
          attacks: [{
            name: 'Longsword',
            attackRoll: {
              attackBonus: 5, // +3 STR + 2 prof
              advantageState: 'normal',
              critRange: 20
            },
            damage: {
              baseDice: '1d8',
              bonusDamage: 3,
              damageType: 'slashing'
            },
            critDamage: {
              baseDice: '1d8',
              bonusDamage: 0,
              damageType: 'slashing'
            }
          }],
          extraAttacks: 0,
          actionSurgeRound: undefined
        },
        buffs: []
      }

      const input: DPRCalculationInput = {
        build,
        targetAC: 15,
        rounds: 1,
        allowRound0Buffs: false
      }

      const result = calculateDPR(input)
      
      // Hand calculation:
      // Attack bonus: +5, Target AC: 15, need 10+ on d20
      // Hit chance: 11/20 = 0.55
      // Crit chance: 1/20 = 0.05
      // Normal damage: 1d8+3 = 4.5+3 = 7.5
      // Crit damage: 2d8+3 = 9+3 = 12
      // Expected DPR: 0.05 * 12 + (0.55-0.05) * 7.5 = 0.6 + 3.75 = 4.35
      
      expect(result.totalDPR).toBeCloseTo(4.35, 1)
    })

    it('matches hand calculation for Level 3 Rogue with Sneak Attack', () => {
      const build: BuildConfiguration = {
        level: 3,
        abilityScores: {
          STR: 8, DEX: 18, CON: 14, INT: 12, WIS: 14, CHA: 10
        },
        classFeatures: [{
          id: 'sneak_attack',
          name: 'Sneak Attack',
          value: 2 // 2d6 at level 3
        }],
        fightingStyles: [],
        attackSequence: {
          attacks: [{
            name: 'Shortsword',
            attackRoll: {
              attackBonus: 6, // +4 DEX + 2 prof
              advantageState: 'advantage', // For Sneak Attack
              critRange: 20
            },
            damage: {
              baseDice: '1d6',
              bonusDamage: 4,
              damageType: 'piercing'
            },
            critDamage: {
              baseDice: '1d6',
              bonusDamage: 0,
              damageType: 'piercing'
            }
          }],
          extraAttacks: 0,
          actionSurgeRound: undefined
        },
        buffs: []
      }

      const input: DPRCalculationInput = {
        build,
        targetAC: 14,
        rounds: 1,
        allowRound0Buffs: false
      }

      const result = calculateDPR(input)
      
      // Hand calculation with advantage:
      // Need 8+ normally, with advantage: 1 - (7/20)^2 = 1 - 0.1225 = 0.8775
      // Crit with advantage: 1 - (19/20)^2 = 0.0975
      // Normal damage with SA: 1d6+4+2d6 = 3.5+4+7 = 14.5
      // Crit damage with SA: 2d6+4+4d6 = 7+4+14 = 25
      // Expected DPR: 0.0975 * 25 + (0.8775-0.0975) * 14.5 ≈ 2.44 + 11.31 = 13.75
      
      expect(result.totalDPR).toBeCloseTo(13.75, 0.5)
    })
  })
})