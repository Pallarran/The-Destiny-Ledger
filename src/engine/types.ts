// Core engine types for DPR calculations

export interface AttackRoll {
  attackBonus: number
  critRange: number // 20 for normal, 19-20 for improved crit, etc.
  advantageState: 'normal' | 'advantage' | 'disadvantage'
}

export interface DamageRoll {
  baseDice: string // e.g., "1d8", "2d6"
  bonusDamage: number
  damageType: string
  versatileDice?: string // e.g., "1d10" for versatile weapons when two-handed
}

export interface Attack {
  attackRoll: AttackRoll
  damage: DamageRoll
  critDamage?: DamageRoll // Additional damage on crit
  onHitEffects?: OnHitEffect[]
}

export interface OnHitEffect {
  id: string
  name: string
  damage?: DamageRoll
  condition?: string
}

export interface AttackSequence {
  attacks: Attack[]
  extraAttacks?: number // From Extra Attack feature
  actionSurgeRound?: number // Which round to use Action Surge (1-3)
}

export interface FightingStyle {
  id: string
  name: string
  type?: 'archery' | 'dueling' | 'great_weapon_fighting' | 'defense' | 'protection'
  bonusToHit?: number
  bonusDamage?: number
  rerollDice?: boolean // For GWF
  rerollLowDamage?: boolean // Alternative name for GWF
  condition?: string // Conditions like 'one_handed_weapon', 'ranged_weapon'
}

// Input interface for damage calculations
export interface DamageInput {
  baseDamage: DamageRoll
  critBonus?: DamageRoll
  fightingStyles?: FightingStyle[]
  weaponType?: 'one_handed' | 'two_handed' | 'ranged' | 'versatile_two_handed'
  sneakAttackLevel?: number
  buffs?: Array<{ name: string; damage: DamageRoll }>
}

export interface ClassFeature {
  name: string
  type: 'sneak_attack' | 'divine_smite' | 'rage' | 'spell_buff'
  value: number | string
  condition?: string
}

export interface BuildConfiguration {
  level: number
  attackSequence: AttackSequence
  fightingStyles: FightingStyle[]
  classFeatures: ClassFeature[]
  buffs: ActiveBuff[]
}

export interface ActiveBuff {
  id: string
  name: string
  attackBonus?: number
  damageBonus?: number
  advantageOnAttacks?: boolean
  extraDamage?: DamageRoll
  concentration: boolean
}

export interface DPRCalculationInput {
  build: BuildConfiguration
  targetAC: number
  rounds: number // Default 3
  allowRound0Buffs: boolean
}

export interface ProbabilityOutcome {
  pHit: number
  pCrit: number
  pMiss: number
}

export interface DamageExpectation {
  normalDamage: number
  critDamage: number
  expectedDamage: number
}

export interface AttackResult {
  attack: Attack
  probability: ProbabilityOutcome
  damage: DamageExpectation
  dpr: number
}

export interface RoundResult {
  round: number
  attacks: AttackResult[]
  totalDPR: number
  actionSurgeUsed: boolean
}

export interface DPRResult {
  input: DPRCalculationInput
  rounds: RoundResult[]
  totalDPR: number
  averageDPR: number
  breakdown: {
    baseAttacks: number
    extraAttacks: number
    actionSurgeAttacks: number
    sneakAttackDamage: number
    buffDamage: number
  }
}

export interface GWMThresholdResult {
  ac: number
  withGWM: {
    dpr: number
    hitChance: number
  }
  withoutGWM: {
    dpr: number
    hitChance: number
  }
  useGWM: boolean
  advantage: number // DPR advantage when using GWM
}

export interface CurveData {
  ac: number[]
  normal: number[]
  advantage: number[]
  disadvantage: number[]
}

export interface CompleteDPRResult extends DPRResult {
  curves: CurveData
  gwmThresholds: GWMThresholdResult[]
}