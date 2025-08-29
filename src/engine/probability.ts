// Core probability calculations for attack rolls and damage

import { AttackRoll, ProbabilityOutcome } from './types'

/**
 * Calculate hit and crit probabilities for a given attack bonus vs AC
 * Uses closed-form math: pHit = clamp((21 + attackBonus - AC)/20, 0, 1)
 */
export function calculateHitProbability(
  attackBonus: number, 
  targetAC: number, 
  critRange: number = 20
): ProbabilityOutcome {
  // Base probability calculation
  const rawHitChance = (21 + attackBonus - targetAC) / 20
  const baseHit = Math.max(0, Math.min(1, rawHitChance))
  
  // Crit probability - always hits on natural 20 (or improved range)
  const critThreshold = 21 - critRange
  const baseCrit = critRange / 20
  
  // Ensure crit is within hit probability bounds
  const actualCrit = Math.min(baseCrit, baseHit)
  
  return {
    pHit: baseHit,
    pCrit: actualCrit,
    pMiss: 1 - baseHit
  }
}

/**
 * Apply advantage/disadvantage to probability calculations
 * Advantage: 1 - (1 - p)^2 for both hit and crit windows
 * Disadvantage: p^2 for both hit and crit windows
 */
export function applyAdvantageDisadvantage(
  baseProb: ProbabilityOutcome,
  advantageState: 'normal' | 'advantage' | 'disadvantage'
): ProbabilityOutcome {
  if (advantageState === 'normal') {
    return baseProb
  }
  
  const { pHit, pCrit } = baseProb
  
  if (advantageState === 'advantage') {
    // For advantage, calculate exact joint probabilities
    // P(hit with advantage) = 1 - P(miss on both rolls)
    const advHit = 1 - Math.pow(1 - pHit, 2)
    
    // For crit with advantage, need to be more careful
    // P(crit) = P(at least one natural 20 in crit range)
    const advCrit = 1 - Math.pow(1 - pCrit, 2)
    
    return {
      pHit: advHit,
      pCrit: Math.min(advCrit, advHit), // Crit can't exceed hit
      pMiss: 1 - advHit
    }
  } else {
    // Disadvantage: both rolls must succeed
    const disHit = Math.pow(pHit, 2)
    const disCrit = Math.pow(pCrit, 2)
    
    return {
      pHit: disHit,
      pCrit: Math.min(disCrit, disHit),
      pMiss: 1 - disHit
    }
  }
}

/**
 * Calculate complete attack probability including advantage state
 */
export function calculateAttackProbability(
  attack: AttackRoll,
  targetAC: number
): ProbabilityOutcome {
  const baseProb = calculateHitProbability(
    attack.attackBonus,
    targetAC,
    attack.critRange
  )
  
  return applyAdvantageDisadvantage(baseProb, attack.advantageState)
}

/**
 * Calculate probability of at least one qualifying hit for Sneak Attack
 * Used when multiple attacks could trigger SA (first hit wins)
 */
export function calculateSneakAttackProbability(
  attacks: AttackRoll[],
  targetAC: number,
  qualifyingCondition?: (attack: AttackRoll) => boolean
): number {
  const qualifyingAttacks = qualifyingCondition 
    ? attacks.filter(qualifyingCondition)
    : attacks
    
  if (qualifyingAttacks.length === 0) return 0
  
  // P(at least one hit) = 1 - P(all miss)
  let probAllMiss = 1
  
  for (const attack of qualifyingAttacks) {
    const prob = calculateAttackProbability(attack, targetAC)
    probAllMiss *= prob.pMiss
  }
  
  return 1 - probAllMiss
}

/**
 * Calculate expected damage from a single attack
 */
export function calculateAttackDamage(
  normalDamage: number,
  critDamage: number,
  probability: ProbabilityOutcome
): number {
  const { pHit, pCrit } = probability
  
  // Expected damage = P(crit) * critDamage + P(hit but not crit) * normalDamage
  const expectedDamage = pCrit * critDamage + (pHit - pCrit) * normalDamage
  
  return expectedDamage
}

/**
 * Utility function to clamp values within bounds
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Roll advantage/disadvantage simulation for validation
 * (Used in tests to verify closed-form calculations)
 */
export function simulateAdvantageRoll(
  attackBonus: number,
  targetAC: number,
  advantageState: 'normal' | 'advantage' | 'disadvantage',
  iterations: number = 100000
): { hitRate: number; critRate: number } {
  let hits = 0
  let crits = 0
  
  for (let i = 0; i < iterations; i++) {
    let rolls: number[]
    
    if (advantageState === 'advantage') {
      rolls = [Math.ceil(Math.random() * 20), Math.ceil(Math.random() * 20)]
    } else if (advantageState === 'disadvantage') {
      rolls = [Math.ceil(Math.random() * 20), Math.ceil(Math.random() * 20)]
    } else {
      rolls = [Math.ceil(Math.random() * 20)]
    }
    
    let finalRoll: number
    if (advantageState === 'advantage') {
      finalRoll = Math.max(...rolls)
    } else if (advantageState === 'disadvantage') {
      finalRoll = Math.min(...rolls)
    } else {
      finalRoll = rolls[0]
    }
    
    // Check for crit (natural 20)
    if (finalRoll === 20) {
      crits++
      hits++ // Crit always hits
    } else if (finalRoll + attackBonus >= targetAC) {
      hits++
    }
  }
  
  return {
    hitRate: hits / iterations,
    critRate: crits / iterations
  }
}