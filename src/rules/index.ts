// Rules module exports

// Types
export * from './types'

// Data loader
export { 
  rulesLoader,
  getClass,
  getSubclass, 
  getFeature,
  getFightingStyle,
  getWeapon,
  getFeat,
  getSkill
} from './loader'

// Direct data access (for advanced use cases)
export { classes, subclasses, fightingStyles } from './data/classes'
export { allFeatures } from './data/features'
export { allWeapons, weaponProperties } from './data/weapons'
export { srdFeats } from './data/feats'

// Core game data
export { abilities, skills, damageTypes } from './loader'