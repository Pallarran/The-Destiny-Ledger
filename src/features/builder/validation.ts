import { z } from 'zod'

// Ability Scores validation
export const abilityScoresSchema = z.object({
  method: z.enum(['standard', 'pointbuy', 'manual']),
  scores: z.object({
    STR: z.number().min(3).max(20),
    DEX: z.number().min(3).max(20),
    CON: z.number().min(3).max(20),
    INT: z.number().min(3).max(20),
    WIS: z.number().min(3).max(20),
    CHA: z.number().min(3).max(20),
  }),
  pointBuyLimit: z.number().optional()
}).refine((data) => {
  if (data.method === 'pointbuy') {
    // Validate point buy constraints
    const costs = [0, 1, 2, 3, 4, 5, 7, 9]
    const totalCost = Object.values(data.scores).reduce((sum: number, score: number) => {
      if (score < 8 || score > 15) return Infinity
      return sum + costs[score - 8]
    }, 0)
    return totalCost <= (data.pointBuyLimit || 27)
  }
  return true
}, {
  message: "Point buy total exceeds limit or scores out of range (8-15)",
  path: ["scores"]
})

// Level Entry validation
export const levelEntrySchema = z.object({
  level: z.number().min(1).max(20),
  classId: z.string().min(1),
  subclassId: z.string().optional(),
  features: z.array(z.string()),
  asiOrFeat: z.enum(['asi', 'feat']).optional(),
  abilityIncreases: z.object({
    STR: z.number().optional(),
    DEX: z.number().optional(),
    CON: z.number().optional(),
    INT: z.number().optional(),
    WIS: z.number().optional(),
    CHA: z.number().optional(),
  }).optional(),
  featId: z.string().optional(),
  notes: z.string().optional()
})

// BuildFeat validation
export const buildFeatSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  options: z.record(z.string(), z.any()).optional(),
  halfFeat: z.object({
    abilityChoices: z.array(z.enum(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'])),
    selectedAbility: z.enum(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']).optional()
  }).optional()
})

// Weapon validation
export const weaponSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  weaponType: z.string().min(1),
  damage: z.string().min(1),
  damageType: z.string().min(1),
  properties: z.array(z.string()),
  range: z.number().optional(),
  enchantment: z.number().min(0).max(3).optional()
})

// Armor validation
export const armorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  armorType: z.string().min(1),
  baseAC: z.number().min(10).max(20),
  maxDex: z.number().optional(),
  enchantment: z.number().min(0).max(3).optional()
})

// Item validation
export const itemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  enchantment: z.number().min(0).max(3).optional()
})

// Item Bonus validation
export const itemBonusSchema = z.object({
  type: z.enum(['attack', 'damage', 'ac', 'save', 'skill']),
  value: z.number(),
  condition: z.string().optional()
})

// Rider validation
export const riderSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  dice: z.string().min(1),
  condition: z.string().optional(),
  damageType: z.string().optional()
})

// Gear validation
export const gearSchema = z.object({
  mainHand: weaponSchema.optional(),
  offHand: weaponSchema.optional(),
  ranged: weaponSchema.optional(),
  ammo: itemSchema.optional(),
  armor: armorSchema.optional(),
  itemBonuses: z.array(itemBonusSchema),
  riders: z.array(riderSchema)
})

// Build Buff validation
export const buildBuffSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['concentration', 'nonconcentration']),
  deterministic: z.boolean(),
  grants: z.object({
    advAttack: z.boolean().optional(),
    dmgBonus: z.number().optional(),
    attackBonus: z.number().optional(),
    acBonus: z.number().optional()
  }),
  actionCost: z.enum(['action', 'bonus', 'free', 'reaction']),
  allowedRound0: z.boolean(),
  active: z.boolean()
})

// Sim Config validation
export const simConfigSchema = z.object({
  acMin: z.number().min(1).max(30),
  acMax: z.number().min(1).max(30),
  acStep: z.number().min(1).max(5),
  round0BuffIds: z.array(z.string()),
  greedyHeuristics: z.boolean(),
  advantageState: z.enum(['normal', 'advantage', 'disadvantage'])
}).refine((data) => data.acMin <= data.acMax, {
  message: "AC minimum must be less than or equal to AC maximum",
  path: ["acMin"]
})

// Full Build validation
export const buildSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  notes: z.string(),
  version: z.string().min(1),
  abilityScores: abilityScoresSchema,
  levelTimeline: z.array(levelEntrySchema),
  feats: z.array(buildFeatSchema),
  gear: gearSchema,
  buffs: z.array(buildBuffSchema),
  simConfig: simConfigSchema
}).refine((data) => {
  // Validate level timeline is sequential
  const levels = data.levelTimeline.map((entry: any) => entry.level).sort((a: number, b: number) => a - b)
  for (let i = 0; i < levels.length; i++) {
    if (levels[i] !== i + 1) return false
  }
  return true
}, {
  message: "Level timeline must be sequential starting from 1",
  path: ["levelTimeline"]
}).refine((data) => {
  // Validate feat consistency
  const featIds = new Set(data.feats.map((f: any) => f.id))
  const timelineFeatIds = data.levelTimeline
    .filter((entry: any) => entry.featId)
    .map((entry: any) => entry.featId!)
  
  return timelineFeatIds.every((id: string) => featIds.has(id))
}, {
  message: "All feats in level timeline must exist in feats array",
  path: ["feats"]
})

// Validation utilities
export function validateBuild(build: unknown) {
  return buildSchema.safeParse(build)
}

export function validateAbilityScores(scores: unknown) {
  return abilityScoresSchema.safeParse(scores)
}

export function validateLevelTimeline(timeline: unknown) {
  return z.array(levelEntrySchema).safeParse(timeline)
}

export function validateGear(gear: unknown) {
  return gearSchema.safeParse(gear)
}

// Character validation rules
export const characterValidationRules = {
  maxLevel: 20,
  maxFeats: 10, // Conservative estimate
  maxAbilityScore: 20,
  minAbilityScore: 3,
  pointBuyLimit: 27,
  pointBuyMin: 8,
  pointBuyMax: 15
} as const

export type ValidationError = {
  path: string[]
  message: string
  code: string
}

export function getValidationErrors(result: { success: false; error: z.ZodError<any> }): ValidationError[] {
  return result.error.issues.map((err: any) => ({
    path: err.path.map(String),
    message: err.message,
    code: err.code
  }))
}