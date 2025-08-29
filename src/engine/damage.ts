// Damage calculation utilities

import { DamageRoll, FightingStyle } from './types'

/**
 * Parse a damage string like "1d6+3" or "2d8-1" into components
 */
export function parseDamageString(damageString: string): { count: number; sides: number; bonus: number } {
  // Remove all spaces
  const cleaned = damageString.replace(/\s+/g, '')
  
  // Handle simple numbers (no dice)
  if (/^\d+$/.test(cleaned)) {
    return { count: 0, sides: 0, bonus: parseInt(cleaned) }
  }
  
  // Match pattern like "2d8+5" or "1d6-2"
  const match = cleaned.match(/^(\d+)d(\d+)([+-]\d+)?$/)
  if (!match) {
    return { count: 0, sides: 0, bonus: 0 }
  }
  
  const count = parseInt(match[1])
  const sides = parseInt(match[2])
  const bonus = match[3] ? parseInt(match[3]) : 0
  
  return { count, sides, bonus }
}

/**
 * Calculate expected damage from a dice string
 */
export function calculateExpectedDamage(diceString: string): number {
  const parsed = parseDamageString(diceString)
  if (parsed.count === 0 && parsed.sides === 0) {
    return parsed.bonus
  }
  
  const diceAverage = parsed.count * (parsed.sides + 1) / 2
  return diceAverage + parsed.bonus
}

/**
 * Parse dice notation (e.g., "1d8", "2d6") and return average damage
 */
export function parseDiceNotation(dice: string): { count: number; sides: number; average: number } {
  const match = dice.match(/(\d+)d(\d+)/)
  if (!match) {
    // Handle flat numbers
    const flatValue = parseInt(dice)
    if (!isNaN(flatValue)) {
      return { count: 1, sides: flatValue, average: flatValue }
    }
    throw new Error(`Invalid dice notation: ${dice}`)
  }
  
  const count = parseInt(match[1])
  const sides = parseInt(match[2])
  const average = count * (sides + 1) / 2
  
  return { count, sides, average }
}

/**
 * Calculate expected damage from a DamageRoll
 */
export function calculateDamageExpectation(damage: DamageRoll): number {
  const diceResult = parseDiceNotation(damage.baseDice)
  return diceResult.average + damage.bonusDamage
}

/**
 * Apply Great Weapon Fighting reroll mechanics
 * Rerolls 1s and 2s on weapon damage dice
 */
export function applyGreatWeaponFighting(
  baseDice: string,
  bonusDamage: number = 0
): number {
  const { count, sides } = parseDiceNotation(baseDice)
  
  // For each die, calculate expected value with reroll of 1s and 2s
  let expectedPerDie: number
  
  if (sides < 3) {
    // For d2 or lower, rerolling doesn't change anything
    expectedPerDie = (sides + 1) / 2
  } else {
    // Probability of rolling 1 or 2: 2/sides
    // When rerolling, we get average of all possible values: (1 + sides) / 2
    const rerollProb = 2 / sides
    const normalProb = 1 - rerollProb
    
    // Expected value without reroll for values 3-sides
    const normalExpected = (3 + sides) / 2
    
    // Expected value with one reroll (assuming we don't reroll again)
    const rerollExpected = (1 + sides) / 2
    
    expectedPerDie = normalProb * normalExpected + rerollProb * rerollExpected
  }
  
  return count * expectedPerDie + bonusDamage
}

/**
 * Apply fighting style bonuses to damage calculation
 */
export function applyFightingStyleDamage(
  baseDamage: number,
  fightingStyles: FightingStyle[],
  weaponType: 'one_handed' | 'two_handed' | 'ranged',
  isWeaponDice: boolean = true
): number {
  let modifiedDamage = baseDamage
  
  for (const style of fightingStyles) {
    switch (style.type) {
      case 'dueling':
        // +2 damage when wielding one-handed weapon with no other weapon
        if (weaponType === 'one_handed') {
          modifiedDamage += 2
        }
        break
        
      case 'great_weapon_fighting':
        // This is handled in the dice calculation itself
        // See applyGreatWeaponFighting function
        break
        
      default:
        // Apply any direct damage bonuses
        if (style.bonusDamage) {
          modifiedDamage += style.bonusDamage
        }
    }
  }
  
  return modifiedDamage
}

/**
 * Calculate critical hit damage
 * In 5e, you double the dice but not the modifiers
 */
export function calculateCriticalDamage(
  baseDamage: DamageRoll,
  critBonus?: DamageRoll
): number {
  // Double the base dice
  const { count, sides } = parseDiceNotation(baseDamage.baseDice)
  const critDiceAverage = count * 2 * (sides + 1) / 2
  
  // Add regular bonus damage (not doubled)
  let totalCritDamage = critDiceAverage + baseDamage.bonusDamage
  
  // Add any additional crit-specific damage
  if (critBonus) {
    totalCritDamage += calculateDamageExpectation(critBonus)
  }
  
  return totalCritDamage
}

/**
 * Calculate Sneak Attack damage
 * Starts at 1d6 at level 1, increases by 1d6 every 2 levels
 */
export function calculateSneakAttackDamage(rogueLevel: number): number {
  const sneakDice = Math.ceil(rogueLevel / 2)
  return sneakDice * 3.5 // Average of d6
}

/**
 * Comprehensive damage calculation for a single attack
 */
export interface DamageCalculationParams {
  baseDamage: DamageRoll
  critBonus?: DamageRoll
  fightingStyles?: FightingStyle[]
  weaponType?: 'one_handed' | 'two_handed' | 'ranged'
  sneakAttackLevel?: number
  buffs?: Array<{ name: string; damage: DamageRoll }>
}

export function calculateCompleteDamage(params: DamageCalculationParams): {
  normalDamage: number
  critDamage: number
} {
  const {
    baseDamage,
    critBonus,
    fightingStyles = [],
    weaponType = 'one_handed',
    sneakAttackLevel = 0,
    buffs = []
  } = params
  
  // Base weapon damage
  let normalDamage: number
  
  // Check if Great Weapon Fighting applies
  const hasGWF = fightingStyles.some(style => style.type === 'great_weapon_fighting')
  
  if (hasGWF && weaponType === 'two_handed') {
    normalDamage = applyGreatWeaponFighting(baseDamage.baseDice, baseDamage.bonusDamage)
  } else {
    normalDamage = calculateDamageExpectation(baseDamage)
  }
  
  // Apply fighting style bonuses
  normalDamage = applyFightingStyleDamage(normalDamage, fightingStyles, weaponType)
  
  // Add buff damage
  for (const buff of buffs) {
    normalDamage += calculateDamageExpectation(buff.damage)
  }
  
  // Calculate crit damage
  let critDamage = calculateCriticalDamage(baseDamage, critBonus)
  
  // Apply fighting style bonuses to crit (non-dice bonuses)
  const nonDiceBonuses = normalDamage - calculateDamageExpectation(baseDamage)
  critDamage += nonDiceBonuses
  
  // Sneak Attack damage (only on the first qualifying hit)
  if (sneakAttackLevel > 0) {
    const sneakDamage = calculateSneakAttackDamage(sneakAttackLevel)
    normalDamage += sneakDamage
    // Sneak Attack dice are also doubled on crit
    critDamage += sneakDamage * 2
  }
  
  return {
    normalDamage,
    critDamage
  }
}