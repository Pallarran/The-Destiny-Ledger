// Main DPR calculation engine

import {
  BuildConfiguration,
  DPRCalculationInput,
  DPRResult,
  CompleteDPRResult,
  CurveData,
  AttackResult,
  RoundResult,
  AttackRoll,
  Attack
} from './types'
import {
  calculateAttackProbability,
  calculateAttackDamage,
  calculateSneakAttackProbability
} from './probability'
import {
  calculateCompleteDamage,
  calculateSneakAttackDamage
} from './damage'
import {
  generateGWMAnalysis,
  GWMSSParams
} from './optimization'

/**
 * Main DPR calculation function
 */
export function calculateDPR(input: DPRCalculationInput): DPRResult {
  const { build, targetAC, rounds, allowRound0Buffs } = input
  const roundResults: RoundResult[] = []
  
  let totalDPR = 0
  let breakdown = {
    baseAttacks: 0,
    extraAttacks: 0,
    actionSurgeAttacks: 0,
    sneakAttackDamage: 0,
    buffDamage: 0
  }
  
  // Process each round
  for (let roundNum = 1; roundNum <= rounds; roundNum++) {
    const roundResult = calculateRoundDPR(build, targetAC, roundNum, allowRound0Buffs)
    roundResults.push(roundResult)
    totalDPR += roundResult.totalDPR
    
    // Update breakdown
    roundResult.attacks.forEach(attackResult => {
      if (attackResult.attack === build.attackSequence.attacks[0]) {
        breakdown.baseAttacks += attackResult.dpr
      }
    })
    
    if (roundResult.actionSurgeUsed) {
      breakdown.actionSurgeAttacks += roundResult.attacks
        .slice(build.attackSequence.attacks.length)
        .reduce((sum, a) => sum + a.dpr, 0)
    }
  }
  
  return {
    input,
    rounds: roundResults,
    totalDPR,
    averageDPR: totalDPR / rounds,
    breakdown
  }
}

/**
 * Calculate DPR for a single round
 */
function calculateRoundDPR(
  build: BuildConfiguration,
  targetAC: number,
  roundNumber: number,
  allowRound0Buffs: boolean
): RoundResult {
  const attackResults: AttackResult[] = []
  let actionSurgeUsed = false
  
  // Determine active buffs for this round
  const activeBuffs = build.buffs.filter(buff => {
    if (roundNumber === 0) return allowRound0Buffs
    return true // All buffs active in combat rounds
  })
  
  // Base attacks
  const attacks = [...build.attackSequence.attacks]
  
  // Extra attacks from class features
  if (build.attackSequence.extraAttacks) {
    for (let i = 0; i < build.attackSequence.extraAttacks; i++) {
      attacks.push(build.attackSequence.attacks[0]) // Copy main attack
    }
  }
  
  // Action Surge attacks
  if (build.attackSequence.actionSurgeRound === roundNumber) {
    actionSurgeUsed = true
    // Add all attacks again for Action Surge
    attacks.push(...attacks.slice()) // Duplicate current attacks
  }
  
  // Calculate Sneak Attack eligibility
  const rogueLevel = getRogueLevel(build)
  const sneakAttackDamage = rogueLevel > 0 ? calculateSneakAttackDamage(rogueLevel) : 0
  let sneakAttackApplied = false
  
  // Process each attack
  attacks.forEach((attack, index) => {
    const modifiedAttack = applyBuffsToAttack(attack, activeBuffs, build.fightingStyles)
    const probability = calculateAttackProbability(modifiedAttack.attackRoll, targetAC)
    
    // Calculate damage
    let damage = calculateCompleteDamage({
      baseDamage: modifiedAttack.damage,
      critBonus: modifiedAttack.critDamage,
      fightingStyles: build.fightingStyles,
      weaponType: getWeaponType(modifiedAttack),
      buffs: activeBuffs.map(b => ({
        name: b.name,
        damage: b.extraDamage || { baseDice: '0', bonusDamage: b.damageBonus || 0, damageType: 'untyped' }
      }))
    })
    
    // Apply Sneak Attack to first qualifying hit
    if (rogueLevel > 0 && !sneakAttackApplied && canSneakAttack(modifiedAttack, build)) {
      const sneakProb = calculateSneakAttackProbability([modifiedAttack.attackRoll], targetAC)
      if (sneakProb > 0) {
        damage.normalDamage += sneakAttackDamage
        damage.critDamage += sneakAttackDamage * 2 // Sneak Attack dice double on crit
        sneakAttackApplied = true
      }
    }
    
    const dpr = calculateAttackDamage(damage.normalDamage, damage.critDamage, probability)
    
    attackResults.push({
      attack: modifiedAttack,
      probability,
      damage: {
        normalDamage: damage.normalDamage,
        critDamage: damage.critDamage,
        expectedDamage: dpr
      },
      dpr
    })
  })
  
  const totalDPR = attackResults.reduce((sum, result) => sum + result.dpr, 0)
  
  return {
    round: roundNumber,
    attacks: attackResults,
    totalDPR,
    actionSurgeUsed
  }
}

/**
 * Calculate DPR curves across AC range for normal/advantage/disadvantage
 */
export function calculateDPRCurves(
  build: BuildConfiguration,
  acRange: { min: number; max: number; step: number } = { min: 10, max: 30, step: 1 },
  rounds: number = 3
): CurveData {
  const acValues: number[] = []
  const normalCurve: number[] = []
  const advantageCurve: number[] = []
  const disadvantageCurve: number[] = []
  
  for (let ac = acRange.min; ac <= acRange.max; ac += acRange.step) {
    acValues.push(ac)
    
    // Normal
    const normalInput: DPRCalculationInput = {
      build,
      targetAC: ac,
      rounds,
      allowRound0Buffs: true
    }
    const normalResult = calculateDPR(normalInput)
    normalCurve.push(normalResult.totalDPR)
    
    // Create builds with advantage/disadvantage
    const advBuild = applyAdvantageToAllAttacks(build, 'advantage')
    const advInput: DPRCalculationInput = {
      build: advBuild,
      targetAC: ac,
      rounds,
      allowRound0Buffs: true
    }
    const advResult = calculateDPR(advInput)
    advantageCurve.push(advResult.totalDPR)
    
    const disBuild = applyAdvantageToAllAttacks(build, 'disadvantage')
    const disInput: DPRCalculationInput = {
      build: disBuild,
      targetAC: ac,
      rounds,
      allowRound0Buffs: true
    }
    const disResult = calculateDPR(disInput)
    disadvantageCurve.push(disResult.totalDPR)
  }
  
  return {
    ac: acValues,
    normal: normalCurve,
    advantage: advantageCurve,
    disadvantage: disadvantageCurve
  }
}

/**
 * Complete DPR analysis with curves and GWM thresholds
 */
export function calculateCompleteDPR(
  build: BuildConfiguration,
  acRange: { min: number; max: number; step: number } = { min: 10, max: 30, step: 1 },
  rounds: number = 3
): CompleteDPRResult {
  // Base DPR calculation at AC 15 (typical mid-game AC)
  const baseInput: DPRCalculationInput = {
    build,
    targetAC: 15,
    rounds,
    allowRound0Buffs: true
  }
  
  const baseDPR = calculateDPR(baseInput)
  
  // Calculate curves
  const curves = calculateDPRCurves(build, acRange, rounds)
  
  // Calculate GWM thresholds (if applicable)
  let gwmThresholds: any[] = []
  
  if (hasGWMOrSS(build)) {
    const mainAttack = build.attackSequence.attacks[0]
    const damage = calculateCompleteDamage({
      baseDamage: mainAttack.damage,
      critBonus: mainAttack.critDamage,
      fightingStyles: build.fightingStyles,
      weaponType: getWeaponType(mainAttack)
    })
    
    const gwmParams: GWMSSParams = {
      baseAttackBonus: mainAttack.attackRoll.attackBonus,
      baseDamage: damage.normalDamage,
      critDamage: damage.critDamage,
      advantageState: mainAttack.attackRoll.advantageState,
      critRange: mainAttack.attackRoll.critRange
    }
    
    gwmThresholds = generateGWMAnalysis(gwmParams, acRange)
  }
  
  return {
    ...baseDPR,
    curves,
    gwmThresholds
  }
}

// Helper functions

function getRogueLevel(build: BuildConfiguration): number {
  const sneakFeature = build.classFeatures.find(f => f.name === 'sneak_attack')
  return sneakFeature ? (typeof sneakFeature.value === 'number' ? sneakFeature.value : 0) : 0
}

function applyBuffsToAttack(
  attack: Attack,
  buffs: BuildConfiguration['buffs'],
  fightingStyles: BuildConfiguration['fightingStyles']
): Attack {
  let modifiedAttack = { ...attack }
  
  // Apply fighting style bonuses to attack rolls
  let attackBonus = attack.attackRoll.attackBonus
  for (const style of fightingStyles) {
    if (style.bonusToHit) {
      attackBonus += style.bonusToHit
    }
  }
  
  // Apply buff bonuses
  let advantageState = attack.attackRoll.advantageState
  for (const buff of buffs) {
    if (buff.attackBonus) {
      attackBonus += buff.attackBonus
    }
    if (buff.advantageOnAttacks && advantageState === 'normal') {
      advantageState = 'advantage'
    }
  }
  
  modifiedAttack.attackRoll = {
    ...attack.attackRoll,
    attackBonus,
    advantageState
  }
  
  return modifiedAttack
}

function getWeaponType(attack: Attack): 'one_handed' | 'two_handed' | 'ranged' {
  // This would be determined by weapon properties in a full implementation
  // For now, return a default
  return 'one_handed'
}

function canSneakAttack(attack: Attack, build: BuildConfiguration): boolean {
  // Simplified sneak attack conditions
  // In full implementation, would check for finesse weapons, ranged weapons, 
  // advantage, or allies within 5ft
  return attack.attackRoll.advantageState === 'advantage'
}

function hasGWMOrSS(build: BuildConfiguration): boolean {
  return build.classFeatures.some(f => 
    f.name === 'great_weapon_master' || f.name === 'sharpshooter'
  )
}

function applyAdvantageToAllAttacks(
  build: BuildConfiguration,
  advantageState: 'advantage' | 'disadvantage'
): BuildConfiguration {
  return {
    ...build,
    attackSequence: {
      ...build.attackSequence,
      attacks: build.attackSequence.attacks.map(attack => ({
        ...attack,
        attackRoll: {
          ...attack.attackRoll,
          advantageState
        }
      }))
    }
  }
}