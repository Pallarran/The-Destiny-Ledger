// Tests for the main DPR engine

import { describe, it, expect } from 'vitest'
import {
  calculateDPR,
  calculateDPRCurves,
  calculateCompleteDPR
} from '../../src/engine/dpr-engine'
import { 
  BuildConfiguration, 
  DPRCalculationInput,
  Attack,
  AttackSequence
} from '../../src/engine/types'

// Helper function to create a basic build configuration
function createBasicBuild(): BuildConfiguration {
  const basicAttack: Attack = {
    name: 'Longsword',
    attackRoll: {
      attackBonus: 7, // +4 STR + 3 prof
      advantageState: 'normal',
      critRange: 20
    },
    damage: {
      baseDice: '1d8',
      bonusDamage: 4, // STR modifier
      damageType: 'slashing'
    },
    critDamage: {
      baseDice: '1d8',
      bonusDamage: 0,
      damageType: 'slashing'
    }
  }

  const attackSequence: AttackSequence = {
    attacks: [basicAttack],
    extraAttacks: 1, // Level 5 Fighter Extra Attack
    actionSurgeRound: 1
  }

  return {
    level: 5,
    abilityScores: {
      STR: 18, DEX: 14, CON: 16, INT: 10, WIS: 12, CHA: 8
    },
    classFeatures: [],
    fightingStyles: [],
    attackSequence,
    buffs: []
  }
}

describe('DPR Engine', () => {
  describe('calculateDPR', () => {
    it('calculates basic single-round DPR correctly', () => {
      const build = createBasicBuild()
      const input: DPRCalculationInput = {
        build,
        targetAC: 15,
        rounds: 1,
        allowRound0Buffs: false
      }

      const result = calculateDPR(input)

      expect(result.rounds).toHaveLength(1)
      expect(result.totalDPR).toBeGreaterThan(0)
      expect(result.averageDPR).toBe(result.totalDPR)
      
      // Level 5 Fighter should have 2 attacks per round
      expect(result.rounds[0].attacks).toHaveLength(2)
    })

    it('calculates three-round nova DPR correctly', () => {
      const build = createBasicBuild()
      const input: DPRCalculationInput = {
        build,
        targetAC: 15,
        rounds: 3,
        allowRound0Buffs: false
      }

      const result = calculateDPR(input)

      expect(result.rounds).toHaveLength(3)
      expect(result.totalDPR).toBeGreaterThan(0)
      expect(result.averageDPR).toBeCloseTo(result.totalDPR / 3, 2)
      
      // Round 1 should have Action Surge (4 attacks total)
      expect(result.rounds[0].attacks).toHaveLength(4)
      expect(result.rounds[0].actionSurgeUsed).toBe(true)
      
      // Other rounds should have normal attacks (2 attacks)
      expect(result.rounds[1].attacks).toHaveLength(2)
      expect(result.rounds[2].attacks).toHaveLength(2)
    })

    it('handles buffs correctly', () => {
      const build = createBasicBuild()
      build.buffs = [{
        id: 'bless',
        name: 'Bless',
        attackBonus: 2.5, // Average of +1d4
        actionCost: 'action',
        concentration: true,
        duration: 'concentration_10_minutes'
      }]

      const input: DPRCalculationInput = {
        build,
        targetAC: 15,
        rounds: 1,
        allowRound0Buffs: true
      }

      const result = calculateDPR(input)

      // Each attack should have the buff bonus applied
      const attack = result.rounds[0].attacks[0]
      expect(attack.attack.attackRoll.attackBonus).toBe(9.5) // 7 + 2.5 from Bless
    })

    it('handles Sneak Attack correctly', () => {
      // Create a Rogue build
      const rogueAttack: Attack = {
        name: 'Shortsword',
        attackRoll: {
          attackBonus: 6, // +4 DEX + 2 prof
          advantageState: 'advantage', // Hidden rogue
          critRange: 20
        },
        damage: {
          baseDice: '1d6',
          bonusDamage: 4, // DEX modifier
          damageType: 'piercing'
        },
        critDamage: {
          baseDice: '1d6',
          bonusDamage: 0,
          damageType: 'piercing'
        }
      }

      const build = createBasicBuild()
      build.level = 3
      build.attackSequence = {
        attacks: [rogueAttack],
        extraAttacks: 0, // No Extra Attack for Rogue
        actionSurgeRound: undefined // No Action Surge
      }
      build.classFeatures = [{
        id: 'sneak_attack',
        name: 'Sneak Attack',
        value: 2 // 2d6 at level 3
      }]

      const input: DPRCalculationInput = {
        build,
        targetAC: 14,
        rounds: 1,
        allowRound0Buffs: false
      }

      const result = calculateDPR(input)

      // Should apply Sneak Attack damage to the first qualifying hit
      expect(result.totalDPR).toBeGreaterThan(8) // Base damage + Sneak Attack
      expect(result.breakdown.sneakAttackDamage).toBeGreaterThan(0)
    })
  })

  describe('calculateDPRCurves', () => {
    it('generates DPR curves across AC range', () => {
      const build = createBasicBuild()
      const curves = calculateDPRCurves(build, { min: 10, max: 20, step: 1 }, 3)

      expect(curves.ac).toHaveLength(11) // AC 10-20
      expect(curves.normal).toHaveLength(11)
      expect(curves.advantage).toHaveLength(11)
      expect(curves.disadvantage).toHaveLength(11)

      // DPR should decrease as AC increases
      expect(curves.normal[0]).toBeGreaterThan(curves.normal[10])
      
      // Advantage should be better than normal, which should be better than disadvantage
      for (let i = 0; i < curves.ac.length; i++) {
        expect(curves.advantage[i]).toBeGreaterThanOrEqual(curves.normal[i])
        expect(curves.normal[i]).toBeGreaterThanOrEqual(curves.disadvantage[i])
      }
    })

    it('handles step size correctly', () => {
      const build = createBasicBuild()
      const curves = calculateDPRCurves(build, { min: 10, max: 20, step: 2 }, 1)

      expect(curves.ac).toEqual([10, 12, 14, 16, 18, 20])
      expect(curves.normal).toHaveLength(6)
    })
  })

  describe('calculateCompleteDPR', () => {
    it('provides complete analysis including curves and thresholds', () => {
      const build = createBasicBuild()
      // Add GWM feat to trigger threshold analysis
      build.classFeatures.push({
        id: 'great_weapon_master',
        name: 'Great Weapon Master',
        value: true
      })

      const result = calculateCompleteDPR(build)

      expect(result.curves).toBeDefined()
      expect(result.curves.ac).toHaveLength(21) // Default AC 10-30
      expect(result.gwmThresholds).toBeDefined()
      expect(result.gwmThresholds.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('handles build with no attacks', () => {
      const build = createBasicBuild()
      build.attackSequence.attacks = []

      const input: DPRCalculationInput = {
        build,
        targetAC: 15,
        rounds: 1,
        allowRound0Buffs: false
      }

      const result = calculateDPR(input)
      expect(result.totalDPR).toBe(0)
      expect(result.rounds[0].attacks).toHaveLength(0)
    })

    it('handles zero rounds', () => {
      const build = createBasicBuild()
      const input: DPRCalculationInput = {
        build,
        targetAC: 15,
        rounds: 0,
        allowRound0Buffs: false
      }

      const result = calculateDPR(input)
      expect(result.totalDPR).toBe(0)
      expect(result.rounds).toHaveLength(0)
    })

    it('handles extremely high AC', () => {
      const build = createBasicBuild()
      const input: DPRCalculationInput = {
        build,
        targetAC: 50,
        rounds: 1,
        allowRound0Buffs: false
      }

      const result = calculateDPR(input)
      
      // Should only hit on natural 20s
      expect(result.totalDPR).toBeGreaterThan(0) // Some damage from crits
      expect(result.totalDPR).toBeLessThan(2) // But very low
    })

    it('handles extremely low AC', () => {
      const build = createBasicBuild()
      const input: DPRCalculationInput = {
        build,
        targetAC: 5,
        rounds: 1,
        allowRound0Buffs: false
      }

      const result = calculateDPR(input)
      
      // Should almost always hit
      expect(result.totalDPR).toBeGreaterThan(15) // High damage from reliable hits
    })
  })
})

// Golden test cases for specific builds
describe('Golden Test Cases - Accuracy Validation', () => {
  it('Level 5 Fighter with Greatsword (no GWM)', () => {
    const greatswordAttack: Attack = {
      name: 'Greatsword',
      attackRoll: {
        attackBonus: 7, // +4 STR + 3 prof
        advantageState: 'normal',
        critRange: 20
      },
      damage: {
        baseDice: '2d6',
        bonusDamage: 4, // STR modifier
        damageType: 'slashing'
      },
      critDamage: {
        baseDice: '2d6',
        bonusDamage: 0,
        damageType: 'slashing'
      }
    }

    const build: BuildConfiguration = {
      level: 5,
      abilityScores: { STR: 18, DEX: 14, CON: 16, INT: 10, WIS: 12, CHA: 8 },
      classFeatures: [],
      fightingStyles: [],
      attackSequence: {
        attacks: [greatswordAttack],
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
    
    // Hand calculation for verification:
    // Round 1 (Action Surge): 4 attacks
    // Round 2-3: 2 attacks each
    // Total: 8 attacks over 3 rounds
    // Hit chance vs AC 15: need 8+ on d20 = 65% = 0.65
    // Average damage per hit: 2d6+4 = 11
    // Expected DPR: 8 * 0.65 * 11 ≈ 57.2 (plus crit damage)
    
    expect(result.totalDPR).toBeGreaterThan(55)
    expect(result.totalDPR).toBeLessThan(65)
  })

  it('Level 5 Rogue with Shortbow and Sneak Attack', () => {
    const shortbowAttack: Attack = {
      name: 'Shortbow',
      attackRoll: {
        attackBonus: 7, // +4 DEX + 3 prof
        advantageState: 'advantage', // Hiding for Sneak Attack
        critRange: 20
      },
      damage: {
        baseDice: '1d6',
        bonusDamage: 4, // DEX modifier
        damageType: 'piercing'
      },
      critDamage: {
        baseDice: '1d6',
        bonusDamage: 0,
        damageType: 'piercing'
      }
    }

    const build: BuildConfiguration = {
      level: 5,
      abilityScores: { STR: 10, DEX: 18, CON: 14, INT: 12, WIS: 14, CHA: 8 },
      classFeatures: [{
        id: 'sneak_attack',
        name: 'Sneak Attack',
        value: 3 // 3d6 at level 5
      }],
      fightingStyles: [],
      attackSequence: {
        attacks: [shortbowAttack],
        extraAttacks: 0,
        actionSurgeRound: undefined
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
    
    // Hand calculation:
    // 1 attack per round, 3 rounds = 3 attacks
    // With advantage vs AC 14, need 7+ normally
    // P(hit with advantage) = 1 - (6/20)^2 = 1 - 0.09 = 0.91
    // Damage per hit: 1d6+4+3d6 = 3.5+4+10.5 = 18
    // Expected DPR: 3 * 0.91 * 18 ≈ 49.1
    
    expect(result.totalDPR).toBeGreaterThan(45)
    expect(result.totalDPR).toBeLessThan(55)
  })

  it('Level 5 Ranger with Longbow, Archery, and Hunter\'s Mark', () => {
    const longbowAttack: Attack = {
      name: 'Longbow',
      attackRoll: {
        attackBonus: 9, // +4 DEX + 3 prof + 2 Archery
        advantageState: 'normal',
        critRange: 20
      },
      damage: {
        baseDice: '1d8',
        bonusDamage: 4, // DEX modifier
        damageType: 'piercing'
      },
      critDamage: {
        baseDice: '1d8',
        bonusDamage: 0,
        damageType: 'piercing'
      }
    }

    const build: BuildConfiguration = {
      level: 5,
      abilityScores: { STR: 12, DEX: 18, CON: 14, INT: 10, WIS: 16, CHA: 10 },
      classFeatures: [],
      fightingStyles: [{
        id: 'archery',
        name: 'Archery',
        bonusToHit: 2
      }],
      attackSequence: {
        attacks: [longbowAttack],
        extraAttacks: 1,
        actionSurgeRound: undefined
      },
      buffs: [{
        id: 'hunters_mark',
        name: 'Hunter\'s Mark',
        extraDamage: {
          baseDice: '1d6',
          bonusDamage: 0,
          damageType: 'magical'
        },
        concentration: true,
        duration: 'concentration_1_hour'
      }]
    }

    const input: DPRCalculationInput = {
      build,
      targetAC: 16,
      rounds: 3,
      allowRound0Buffs: true
    }

    const result = calculateDPR(input)
    
    // Hand calculation:
    // 2 attacks per round, 3 rounds = 6 attacks
    // Hit chance vs AC 16: need 7+ with +9 = 70% = 0.7
    // Damage per hit: 1d8+4+1d6 = 4.5+4+3.5 = 12
    // Expected DPR: 6 * 0.7 * 12 = 50.4
    
    expect(result.totalDPR).toBeGreaterThan(48)
    expect(result.totalDPR).toBeLessThan(56)
  })
})