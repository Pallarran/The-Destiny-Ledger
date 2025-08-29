// Damage calculation utilities

import { DamageRoll, FightingStyle, DamageInput } from './types'

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
    // Handle flat numbers and zero
    const flatValue = parseInt(dice)
    if (!isNaN(flatValue)) {
      if (flatValue === 0) {
        return { count: 0, sides: 0, average: 0 }
      }
      return { count: 0, sides: 0, average: flatValue } // Flat modifier, no dice
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
  if (rogueLevel <= 0) return 0
  if (rogueLevel > 20) rogueLevel = 20 // Cap at level 20
  
  const sneakDice = Math.ceil(rogueLevel / 2)
  return sneakDice * 3.5 // Average of d6
}

/**
 * Comprehensive damage calculation for a single attack
 */
export function calculateCompleteDamage(params: DamageInput): {
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
  
  // Determine the dice to use for this weapon
  let weaponDice = baseDamage.baseDice
  if (weaponType === 'versatile_two_handed' && baseDamage.versatileDice) {
    weaponDice = baseDamage.versatileDice
  }
  
  // Base weapon damage
  let normalDamage: number
  
  // Check if Great Weapon Fighting applies
  const hasGWF = fightingStyles.some(style => 
    style.type === 'great_weapon_fighting' || style.rerollLowDamage)
  
  if (hasGWF && (weaponType === 'two_handed' || weaponType === 'versatile_two_handed')) {
    normalDamage = applyGreatWeaponFighting(weaponDice, baseDamage.bonusDamage)
  } else {
    // Calculate using the appropriate dice
    const diceResult = parseDiceNotation(weaponDice)
    normalDamage = diceResult.average + baseDamage.bonusDamage
  }
  
  // Apply fighting style bonuses (like Dueling +2 damage)
  for (const style of fightingStyles) {
    if (style.bonusDamage) {
      if (style.condition === 'one_handed_weapon' && weaponType === 'one_handed') {
        normalDamage += style.bonusDamage
      } else if (style.condition === 'ranged_weapon' && weaponType === 'ranged') {
        normalDamage += style.bonusDamage
      } else if (!style.condition) {
        normalDamage += style.bonusDamage
      }
    }
  }
  
  // Add buff damage
  for (const buff of buffs) {
    normalDamage += calculateDamageExpectation(buff.damage)
  }
  
  // Calculate crit damage (weapon dice + crit bonus dice, static bonuses once)
  let critDamage: number
  
  // Base weapon dice average (use versatile dice if applicable)
  const { count, sides } = parseDiceNotation(weaponDice)
  const weaponDiceAverage = count * (sides + 1) / 2
  critDamage = weaponDiceAverage  // Base weapon dice
  
  // Add crit bonus dice (typically equals weapon dice for standard crits)
  if (critBonus) {
    critDamage += calculateDamageExpectation(critBonus)
  }
  
  // Add static bonuses once (weapon bonus, fighting styles, buffs)
  critDamage += baseDamage.bonusDamage
  
  // Add fighting style bonuses (non-dice bonuses only)
  for (const style of fightingStyles) {
    if (style.bonusDamage) {
      if (style.condition === 'one_handed_weapon' && weaponType === 'one_handed') {
        critDamage += style.bonusDamage
      } else if (style.condition === 'ranged_weapon' && weaponType === 'ranged') {
        critDamage += style.bonusDamage
      } else if (!style.condition) {
        critDamage += style.bonusDamage
      }
    }
  }
  
  // Add buff damage (dice doubled on crit, static bonuses once)
  for (const buff of buffs) {
    const buffBaseDamage = calculateDamageExpectation(buff.damage)
    const { count: buffCount, sides: buffSides } = parseDiceNotation(buff.damage.baseDice)
    const buffDiceAverage = buffCount * (buffSides + 1) / 2
    const buffStaticBonus = buff.damage.bonusDamage
    // Double dice, add static bonus once
    critDamage += (buffDiceAverage * 2) + buffStaticBonus
  }
  
  // Sneak Attack damage (only on the first qualifying hit)
  if (sneakAttackLevel > 0) {
    const sneakDamage = calculateSneakAttackDamage(sneakAttackLevel)
    normalDamage += sneakDamage
    // Sneak Attack dice are also doubled on crit
    critDamage += sneakDamage * 2
  }
  
  // Ensure damage doesn't go below 0
  normalDamage = Math.max(0, normalDamage)
  critDamage = Math.max(0, critDamage)
  
  return {
    normalDamage,
    critDamage
  }
}