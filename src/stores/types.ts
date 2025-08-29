// Core data types for The Destiny Ledger

export interface Build {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  notes: string
  version: string
  abilityScores: AbilityScores
  levelTimeline: LevelTimeline
  feats: BuildFeat[]
  gear: Gear
  buffs: BuildBuff[]
  simConfig: SimConfig
}

export interface AbilityScores {
  method: 'standard' | 'pointbuy' | 'manual'
  scores: {
    STR: number
    DEX: number
    CON: number
    INT: number
    WIS: number
    CHA: number
  }
  pointBuyLimit?: number
}

export interface LevelEntry {
  level: number
  classId: string
  subclassId?: string
  features: string[]
  asiOrFeat?: 'asi' | 'feat'
  abilityIncreases?: Partial<AbilityScores['scores']>
  featId?: string
  notes?: string
}

export type LevelTimeline = LevelEntry[]

export interface BuildFeat {
  id: string
  name: string
  options?: Record<string, any>
  halfFeat?: {
    abilityChoices: (keyof AbilityScores['scores'])[]
    selectedAbility?: keyof AbilityScores['scores']
  }
}

export interface Gear {
  mainHand?: Weapon
  offHand?: Weapon
  ranged?: Weapon
  ammo?: Item
  armor?: Armor
  itemBonuses: ItemBonus[]
  riders: Rider[]
}

export interface Weapon {
  id: string
  name: string
  weaponType: string
  damage: string
  damageType: string
  properties: string[]
  range?: number
  enchantment?: number
}

export interface Armor {
  id: string
  name: string
  armorType: string
  baseAC: number
  maxDex?: number
  enchantment?: number
}

export interface Item {
  id: string
  name: string
  type: string
  enchantment?: number
}

export interface ItemBonus {
  type: 'attack' | 'damage' | 'ac' | 'save' | 'skill'
  value: number
  condition?: string
}

export interface Rider {
  id: string
  name: string
  dice: string
  condition?: string
  damageType?: string
}

export interface BuildBuff {
  id: string
  name: string
  type: 'concentration' | 'nonconcentration'
  deterministic: boolean
  grants: {
    advAttack?: boolean
    dmgBonus?: number
    attackBonus?: number
    acBonus?: number
  }
  actionCost: 'action' | 'bonus' | 'free' | 'reaction'
  allowedRound0: boolean
  active: boolean
}

export interface SimConfig {
  acMin: number
  acMax: number
  acStep: number
  round0BuffIds: string[]
  greedyHeuristics: boolean
  advantageState: 'normal' | 'advantage' | 'disadvantage'
}

export interface NonDPRSignals {
  skills: Record<string, number>
  expertise: string[]
  senses: string[]
  movement: Record<string, number>
  toolkits: string[]
  defensiveFeatures: string[]
  supportAuras: string[]
}

export interface DPRResult {
  totalDPR: number
  perRoundDPR: number[]
  curves: {
    normal: number[]
    advantage: number[]
    disadvantage: number[]
  }
  breakpoints: {
    ac: number
    withGWM: number
    withoutGWM: number
    useGWM: boolean
  }[]
}

export interface RadarScores {
  social: number
  control: number
  exploration: number
  defense: number
  support: number
  mobility: number
}