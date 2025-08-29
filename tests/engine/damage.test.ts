// Tests for damage calculations

import { describe, it, expect } from 'vitest'
import {
  calculateCompleteDamage,
  calculateSneakAttackDamage,
  parseDamageString,
  calculateExpectedDamage
} from '../../src/engine/damage'
import { DamageInput, FightingStyle } from '../../src/engine/types'

describe('Damage Calculations', () => {
  describe('parseDamageString', () => {
    it('parses simple dice notation correctly', () => {
      const result = parseDamageString('1d6')
      expect(result).toEqual({
        count: 1,
        sides: 6,
        bonus: 0
      })
    })

    it('parses dice with bonus correctly', () => {
      const result = parseDamageString('2d8+5')
      expect(result).toEqual({
        count: 2,
        sides: 8,
        bonus: 5
      })
    })

    it('parses dice with negative bonus', () => {
      const result = parseDamageString('1d4-2')
      expect(result).toEqual({
        count: 1,
        sides: 4,
        bonus: -2
      })
    })

    it('handles spaces in notation', () => {
      const result = parseDamageString(' 3d10 + 7 ')
      expect(result).toEqual({
        count: 3,
        sides: 10,
        bonus: 7
      })
    })

    it('handles just a bonus number', () => {
      const result = parseDamageString('5')
      expect(result).toEqual({
        count: 0,
        sides: 0,
        bonus: 5
      })
    })

    it('handles invalid input gracefully', () => {
      const result = parseDamageString('invalid')
      expect(result).toEqual({
        count: 0,
        sides: 0,
        bonus: 0
      })
    })
  })

  describe('calculateExpectedDamage', () => {
    it('calculates expected damage for simple dice', () => {
      const damage = calculateExpectedDamage('1d6')
      expect(damage).toBeCloseTo(3.5, 2) // (1+6)/2
    })

    it('calculates expected damage for multiple dice', () => {
      const damage = calculateExpectedDamage('2d6')
      expect(damage).toBeCloseTo(7.0, 2) // 2 * (1+6)/2
    })

    it('calculates expected damage with bonus', () => {
      const damage = calculateExpectedDamage('1d8+3')
      expect(damage).toBeCloseTo(7.5, 2) // (1+8)/2 + 3
    })

    it('handles flat bonuses', () => {
      const damage = calculateExpectedDamage('5')
      expect(damage).toBe(5)
    })

    it('handles zero damage', () => {
      const damage = calculateExpectedDamage('0')
      expect(damage).toBe(0)
    })
  })

  describe('calculateSneakAttackDamage', () => {
    it('calculates sneak attack damage for level 1', () => {
      const damage = calculateSneakAttackDamage(1)
      expect(damage).toBeCloseTo(3.5, 2) // 1d6
    })

    it('calculates sneak attack damage for level 3', () => {
      const damage = calculateSneakAttackDamage(3)
      expect(damage).toBeCloseTo(7.0, 2) // 2d6
    })

    it('calculates sneak attack damage for level 5', () => {
      const damage = calculateSneakAttackDamage(5)
      expect(damage).toBeCloseTo(10.5, 2) // 3d6
    })

    it('calculates sneak attack damage for level 20', () => {
      const damage = calculateSneakAttackDamage(20)
      expect(damage).toBeCloseTo(35.0, 2) // 10d6
    })

    it('handles invalid levels', () => {
      expect(calculateSneakAttackDamage(0)).toBe(0)
      expect(calculateSneakAttackDamage(-5)).toBe(0)
      expect(calculateSneakAttackDamage(25)).toBe(35.0) // Caps at level 20
    })
  })

  describe('calculateCompleteDamage', () => {
    const basicDamageInput: DamageInput = {
      baseDamage: {
        baseDice: '1d8',
        bonusDamage: 3,
        damageType: 'slashing'
      },
      critBonus: {
        baseDice: '1d8',
        bonusDamage: 0,
        damageType: 'slashing'
      },
      fightingStyles: [],
      weaponType: 'one_handed'
    }

    it('calculates basic damage correctly', () => {
      const result = calculateCompleteDamage(basicDamageInput)
      
      expect(result.normalDamage).toBeCloseTo(7.5, 2) // 1d8 + 3 = 4.5 + 3
      expect(result.critDamage).toBeCloseTo(12.0, 2) // 2d8 + 3 = 9 + 3
    })

    it('applies Dueling fighting style correctly', () => {
      const duelingStyle: FightingStyle = {
        id: 'dueling',
        name: 'Dueling',
        bonusDamage: 2,
        condition: 'one_handed_weapon'
      }

      const input: DamageInput = {
        ...basicDamageInput,
        fightingStyles: [duelingStyle]
      }

      const result = calculateCompleteDamage(input)
      
      expect(result.normalDamage).toBeCloseTo(9.5, 2) // 1d8 + 3 + 2 = 4.5 + 5
      expect(result.critDamage).toBeCloseTo(14.0, 2) // 2d8 + 3 + 2 = 9 + 5
    })

    it('applies Great Weapon Fighting correctly', () => {
      const gwfStyle: FightingStyle = {
        id: 'great_weapon_fighting',
        name: 'Great Weapon Fighting',
        rerollLowDamage: true
      }

      const input: DamageInput = {
        baseDamage: {
          baseDice: '2d6',
          bonusDamage: 4,
          damageType: 'slashing'
        },
        critBonus: {
          baseDice: '2d6',
          bonusDamage: 0,
          damageType: 'slashing'
        },
        fightingStyles: [gwfStyle],
        weaponType: 'two_handed'
      }

      const result = calculateCompleteDamage(input)
      
      // With GWF, 2d6 expected value increases from 7.0 to ~8.33
      expect(result.normalDamage).toBeGreaterThan(11.0) // 2d6 + 4 with GWF
      expect(result.normalDamage).toBeCloseTo(12.33, 1)
    })

    it('applies multiple buff damages correctly', () => {
      const input: DamageInput = {
        ...basicDamageInput,
        buffs: [
          {
            name: 'Hunter\'s Mark',
            damage: {
              baseDice: '1d6',
              bonusDamage: 0,
              damageType: 'magical'
            }
          },
          {
            name: 'Divine Favor',
            damage: {
              baseDice: '1d4',
              bonusDamage: 0,
              damageType: 'radiant'
            }
          }
        ]
      }

      const result = calculateCompleteDamage(input)
      
      // Base: 1d8+3 = 7.5, Buffs: 1d6+1d4 = 3.5+2.5 = 6.0
      expect(result.normalDamage).toBeCloseTo(13.5, 2)
      // Crit: 2d8+3+2d6+2d4 = 9+3+7+5 = 24
      expect(result.critDamage).toBeCloseTo(24.0, 2)
    })

    it('handles versatile weapons correctly', () => {
      const versatileInput: DamageInput = {
        baseDamage: {
          baseDice: '1d8',
          bonusDamage: 3,
          damageType: 'slashing',
          versatileDice: '1d10'
        },
        critBonus: {
          baseDice: '1d10', // Using versatile damage for crit
          bonusDamage: 0,
          damageType: 'slashing'
        },
        fightingStyles: [],
        weaponType: 'versatile_two_handed'
      }

      const result = calculateCompleteDamage(versatileInput)
      
      // Two-handed versatile: 1d10+3 = 5.5+3 = 8.5
      expect(result.normalDamage).toBeCloseTo(8.5, 2)
      // Crit: 2d10+3 = 11+3 = 14
      expect(result.critDamage).toBeCloseTo(14.0, 2)
    })
  })

  describe('Edge Cases', () => {
    it('handles zero damage dice', () => {
      const input: DamageInput = {
        baseDamage: {
          baseDice: '0',
          bonusDamage: 5,
          damageType: 'bludgeoning'
        },
        critBonus: {
          baseDice: '0',
          bonusDamage: 0,
          damageType: 'bludgeoning'
        },
        fightingStyles: [],
        weaponType: 'one_handed'
      }

      const result = calculateCompleteDamage(input)
      
      expect(result.normalDamage).toBe(5)
      expect(result.critDamage).toBe(5) // No extra dice to double
    })

    it('handles negative damage gracefully', () => {
      const input: DamageInput = {
        baseDamage: {
          baseDice: '1d4',
          bonusDamage: -10,
          damageType: 'bludgeoning'
        },
        critBonus: {
          baseDice: '1d4',
          bonusDamage: 0,
          damageType: 'bludgeoning'
        },
        fightingStyles: [],
        weaponType: 'one_handed'
      }

      const result = calculateCompleteDamage(input)
      
      // Damage should not go below 0
      expect(result.normalDamage).toBe(0)
      expect(result.critDamage).toBe(0)
    })

    it('handles very large dice correctly', () => {
      const result = calculateExpectedDamage('1d100')
      expect(result).toBeCloseTo(50.5, 1)
    })
  })
})

// Integration tests with actual weapon data
describe('Weapon Damage Integration', () => {
  it('calculates greatsword damage correctly', () => {
    const greatswordInput: DamageInput = {
      baseDamage: {
        baseDice: '2d6',
        bonusDamage: 4, // STR modifier
        damageType: 'slashing'
      },
      critBonus: {
        baseDice: '2d6',
        bonusDamage: 0,
        damageType: 'slashing'
      },
      fightingStyles: [],
      weaponType: 'two_handed'
    }

    const result = calculateCompleteDamage(greatswordInput)
    
    expect(result.normalDamage).toBeCloseTo(11.0, 2) // 2d6+4 = 7+4
    expect(result.critDamage).toBeCloseTo(18.0, 2) // 4d6+4 = 14+4
  })

  it('calculates longbow with Sharpshooter correctly', () => {
    const longbowInput: DamageInput = {
      baseDamage: {
        baseDice: '1d8',
        bonusDamage: 14, // DEX modifier + Sharpshooter
        damageType: 'piercing'
      },
      critBonus: {
        baseDice: '1d8',
        bonusDamage: 0,
        damageType: 'piercing'
      },
      fightingStyles: [],
      weaponType: 'ranged'
    }

    const result = calculateCompleteDamage(longbowInput)
    
    expect(result.normalDamage).toBeCloseTo(18.5, 2) // 1d8+14 = 4.5+14
    expect(result.critDamage).toBeCloseTo(23.0, 2) // 2d8+14 = 9+14
  })

  it('calculates rapier with Sneak Attack correctly', () => {
    const rapierInput: DamageInput = {
      baseDamage: {
        baseDice: '1d8',
        bonusDamage: 4, // DEX modifier
        damageType: 'piercing'
      },
      critBonus: {
        baseDice: '1d8',
        bonusDamage: 0,
        damageType: 'piercing'
      },
      fightingStyles: [],
      weaponType: 'one_handed',
      buffs: [
        {
          name: 'Sneak Attack',
          damage: {
            baseDice: '3d6', // Level 5 rogue
            bonusDamage: 0,
            damageType: 'piercing'
          }
        }
      ]
    }

    const result = calculateCompleteDamage(rapierInput)
    
    expect(result.normalDamage).toBeCloseTo(19.0, 2) // 1d8+4+3d6 = 4.5+4+10.5 = 19.0
    expect(result.critDamage).toBeCloseTo(34.0, 2) // 2d8+4+6d6 = 9+4+21 = 34.0
  })
})