// Core SRD type definitions for D&D 5e content

export interface Ability {
  id: string
  name: string
  shortName: 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'
}

export interface Skill {
  id: string
  name: string
  ability: string
  description: string
}

export interface DamageType {
  id: string
  name: string
  description: string
}

export interface Dice {
  count: number
  sides: number
  bonus?: number
}

export interface DamageRoll {
  dice: Dice[]
  damageType: string
  conditional?: string
}

export interface WeaponProperty {
  id: string
  name: string
  description: string
}

export interface Weapon {
  id: string
  name: string
  category: 'simple_melee' | 'martial_melee' | 'simple_ranged' | 'martial_ranged'
  damage: DamageRoll
  properties: string[]
  weight: number
  cost: {
    quantity: number
    unit: 'cp' | 'sp' | 'gp' | 'pp'
  }
  range?: {
    normal: number
    long?: number
  }
}

export interface Armor {
  id: string
  name: string
  category: 'light' | 'medium' | 'heavy' | 'shield'
  armorClass: {
    base: number
    dexBonus?: boolean
    maxBonus?: number
  }
  strength?: number
  stealth: boolean
  weight: number
  cost: {
    quantity: number
    unit: 'cp' | 'sp' | 'gp' | 'pp'
  }
}

export interface ClassFeature {
  id: string
  name: string
  description: string
  level: number
  class: string
  subclass?: string
  choices?: FeatureChoice[]
  grants?: FeatureGrant[]
}

export interface FeatureChoice {
  id: string
  name: string
  description: string
  options: FeatureOption[]
  count: number
}

export interface FeatureOption {
  id: string
  name: string
  description: string
  grants?: FeatureGrant[]
}

export interface FeatureGrant {
  type: 'skill_proficiency' | 'saving_throw_proficiency' | 'armor_proficiency' | 
        'weapon_proficiency' | 'tool_proficiency' | 'language' | 'spell' | 
        'attack_bonus' | 'damage_bonus' | 'ac_bonus' | 'hp_bonus' | 'speed_bonus' |
        'advantage_on_saves' | 'resistance' | 'immunity' | 'special_ability'
  value: string | number | string[]
  condition?: string
  scaling?: {
    level: number
    increment: number
  }
}

export interface Subclass {
  id: string
  name: string
  class: string
  description: string
  features: string[]  // References to ClassFeature IDs
  spellcasting?: {
    ability: string
    cantripsKnown: number[]
    spellsKnown?: number[]
    spellSlots: number[][]
    ritual: boolean
    preparation: 'known' | 'prepared' | 'warlock'
  }
}

export interface CharacterClass {
  id: string
  name: string
  hitDie: number
  primaryAbility: string[]
  savingThrowProficiencies: string[]
  skillChoices: {
    count: number
    options: string[]
  }
  proficiencies: {
    armor: string[]
    weapons: string[]
    tools: string[]
  }
  startingEquipment: StartingEquipment
  features: string[]  // References to ClassFeature IDs
  subclasses: string[]  // References to Subclass IDs
  spellcasting?: {
    ability: string
    cantripsKnown: number[]
    spellsKnown?: number[]
    spellSlots: number[][]
    ritual: boolean
    preparation: 'known' | 'prepared' | 'warlock'
  }
}

export interface StartingEquipment {
  choices: EquipmentChoice[]
  granted: EquipmentGrant[]
}

export interface EquipmentChoice {
  count: number
  options: EquipmentOption[]
}

export interface EquipmentOption {
  type: 'weapon' | 'armor' | 'item' | 'pack'
  id?: string
  count?: number
  alternatives?: EquipmentOption[]
}

export interface EquipmentGrant {
  type: 'weapon' | 'armor' | 'item'
  id: string
  count: number
}

export interface Feat {
  id: string
  name: string
  description: string
  prerequisite?: string
  abilityScoreIncrease?: {
    options: string[]
    count: number
  }
  grants?: FeatureGrant[]
  choices?: FeatureChoice[]
}

export interface FightingStyle {
  id: string
  name: string
  description: string
  class: string[]
  level: number
  grants?: FeatureGrant[]
}

export interface Spell {
  id: string
  name: string
  level: number
  school: string
  castingTime: string
  range: string
  components: string[]
  duration: string
  description: string
  classes: string[]
  damage?: DamageRoll[]
  scaling?: string
  attack?: boolean
  save?: string
}

// Race types (basic for SRD support)
export interface Race {
  id: string
  name: string
  size: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan'
  speed: number
  abilityScoreIncrease: AbilityScoreIncrease[]
  traits: RaceTrait[]
  languages: string[]
  proficiencies?: {
    skills?: string[]
    weapons?: string[]
    tools?: string[]
  }
  subraces?: string[]
}

export interface AbilityScoreIncrease {
  ability: string
  increase: number
}

export interface RaceTrait {
  id: string
  name: string
  description: string
  grants?: FeatureGrant[]
}

export interface Background {
  id: string
  name: string
  description: string
  skillProficiencies: string[]
  languages: number
  toolProficiencies: string[]
  equipment: EquipmentGrant[]
  feature: {
    name: string
    description: string
  }
  suggestedCharacteristics: string[]
}