// GWM/Sharpshooter optimization and threshold calculations

import { AttackRoll, ProbabilityOutcome, GWMThresholdResult } from './types'
import { calculateAttackProbability, calculateAttackDamage } from './probability'

/**
 * Great Weapon Master / Sharpshooter feat mechanics
 * -5 to attack rolls, +10 to damage rolls
 */
export interface GWMSSParams {
  baseAttackBonus: number
  baseDamage: number
  critDamage: number
  advantageState: 'normal' | 'advantage' | 'disadvantage'
  critRange?: number
}

/**
 * Calculate DPR with and without GWM/SS for a specific AC
 */
export function calculateGWMThreshold(
  params: GWMSSParams,
  targetAC: number
): GWMThresholdResult {
  const { baseAttackBonus, baseDamage, critDamage, advantageState, critRange = 20 } = params
  
  // Without GWM/SS
  const normalAttack: AttackRoll = {
    attackBonus: baseAttackBonus,
    critRange,
    advantageState
  }
  
  const normalProb = calculateAttackProbability(normalAttack, targetAC)
  const normalDPR = calculateAttackDamage(baseDamage, critDamage, normalProb)
  
  // With GWM/SS (-5 attack, +10 damage)
  const gwmAttack: AttackRoll = {
    attackBonus: baseAttackBonus - 5,
    critRange,
    advantageState
  }
  
  const gwmProb = calculateAttackProbability(gwmAttack, targetAC)
  const gwmDPR = calculateAttackDamage(baseDamage + 10, critDamage + 10, gwmProb)
  
  const useGWM = gwmDPR > normalDPR
  const advantage = gwmDPR - normalDPR
  
  return {
    ac: targetAC,
    withGWM: {
      dpr: gwmDPR,
      hitChance: gwmProb.pHit
    },
    withoutGWM: {
      dpr: normalDPR,
      hitChance: normalProb.pHit
    },
    useGWM,
    advantage
  }
}

/**
 * Calculate optimal choice (GWM/SS vs normal) for a specific AC
 */
export function calculateOptimalChoice(
  params: GWMSSParams,
  targetAC: number
): {
  useGWM: boolean
  dpr: number
  regularDPR: number
  gwmDPR: number
} {
  const result = calculateGWMThreshold(params, targetAC)
  
  return {
    useGWM: result.useGWM,
    dpr: Math.max(result.withGWM.dpr, result.withoutGWM.dpr),
    regularDPR: result.withoutGWM.dpr,
    gwmDPR: result.withGWM.dpr
  }
}

/**
 * Find the AC threshold where GWM/SS becomes ineffective
 */
export function findGWMBreakpoint(
  params: GWMSSParams,
  acRange: { min: number; max: number } = { min: 10, max: 30 }
): number {
  const { min, max } = acRange
  
  // Binary search for the breakpoint
  let low = min
  let high = max
  let breakpoint = max
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const result = calculateGWMThreshold(params, mid)
    
    if (result.useGWM) {
      low = mid + 1
      breakpoint = mid + 1 // GWM is still good, breakpoint is higher
    } else {
      high = mid - 1
      breakpoint = mid // GWM is bad here, breakpoint might be this AC
    }
  }
  
  return Math.min(breakpoint, max)
}

/**
 * Find multiple GWM/SS breakpoints (alias for compatibility)
 */
export function findGWMBreakpoints(
  params: GWMSSParams,
  acRange?: { min: number; max: number }
): number[] {
  const breakpoint = findGWMBreakpoint(params, acRange)
  return [breakpoint]
}

/**
 * Generate complete GWM/SS threshold analysis across AC range
 */
export function generateGWMAnalysis(
  params: GWMSSParams,
  acRange: { min: number; max: number; step: number } = { min: 10, max: 30, step: 1 }
): GWMThresholdResult[] {
  const results: GWMThresholdResult[] = []
  
  for (let ac = acRange.min; ac <= acRange.max; ac += acRange.step) {
    results.push(calculateGWMThreshold(params, ac))
  }
  
  return results
}

/**
 * Calculate optimal attack sequence considering GWM/SS thresholds
 */
export interface OptimalAttackParams extends GWMSSParams {
  attacksPerRound: number
  rounds: number
  targetACs: number[]
}

export function calculateOptimalAttackSequence(
  params: OptimalAttackParams
): { ac: number; optimalDPR: number; useGWM: boolean }[] {
  const { attacksPerRound, rounds, targetACs } = params
  const results: { ac: number; optimalDPR: number; useGWM: boolean }[] = []
  
  for (const ac of targetACs) {
    const threshold = calculateGWMThreshold(params, ac)
    const attacksTotal = attacksPerRound * rounds
    
    const optimalDPR = Math.max(threshold.withGWM.dpr, threshold.withoutGWM.dpr) * attacksTotal
    
    results.push({
      ac,
      optimalDPR,
      useGWM: threshold.useGWM
    })
  }
  
  return results
}

/**
 * Advanced GWM optimization considering multiple attacks and features
 */
export interface AdvancedGWMParams {
  attacks: Array<{
    attackBonus: number
    damage: number
    critDamage: number
    canUseGWM: boolean
  }>
  advantageState: 'normal' | 'advantage' | 'disadvantage'
  critRange: number
}

export function optimizeGWMPerAttack(
  params: AdvancedGWMParams,
  targetAC: number
): Array<{ attackIndex: number; useGWM: boolean; dpr: number }> {
  const results: Array<{ attackIndex: number; useGWM: boolean; dpr: number }> = []
  
  params.attacks.forEach((attack, index) => {
    if (!attack.canUseGWM) {
      // Attack can't use GWM, calculate normal DPR
      const attackRoll: AttackRoll = {
        attackBonus: attack.attackBonus,
        critRange: params.critRange,
        advantageState: params.advantageState
      }
      
      const prob = calculateAttackProbability(attackRoll, targetAC)
      const dpr = calculateAttackDamage(attack.damage, attack.critDamage, prob)
      
      results.push({ attackIndex: index, useGWM: false, dpr })
    } else {
      // Compare GWM vs normal for this attack
      const gwmParams: GWMSSParams = {
        baseAttackBonus: attack.attackBonus,
        baseDamage: attack.damage,
        critDamage: attack.critDamage,
        advantageState: params.advantageState,
        critRange: params.critRange
      }
      
      const threshold = calculateGWMThreshold(gwmParams, targetAC)
      const optimalDPR = Math.max(threshold.withGWM.dpr, threshold.withoutGWM.dpr)
      
      results.push({
        attackIndex: index,
        useGWM: threshold.useGWM,
        dpr: optimalDPR
      })
    }
  })
  
  return results
}

/**
 * Calculate the expected improvement from advantage when using GWM/SS
 */
export function calculateGWMAdvantageValue(
  params: GWMSSParams,
  targetAC: number
): {
  normalAdvantage: number
  gwmAdvantage: number
  advantageImprovesGWM: boolean
} {
  // Calculate without advantage
  const normalParams = { ...params, advantageState: 'normal' as const }
  const normalThreshold = calculateGWMThreshold(normalParams, targetAC)
  
  // Calculate with advantage
  const advParams = { ...params, advantageState: 'advantage' as const }
  const advThreshold = calculateGWMThreshold(advParams, targetAC)
  
  const normalAdvantage = advThreshold.withoutGWM.dpr - normalThreshold.withoutGWM.dpr
  const gwmAdvantage = advThreshold.withGWM.dpr - normalThreshold.withGWM.dpr
  
  return {
    normalAdvantage,
    gwmAdvantage,
    advantageImprovesGWM: gwmAdvantage > normalAdvantage
  }
}