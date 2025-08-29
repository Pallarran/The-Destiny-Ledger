// SRD Data Loader - Main interface for accessing game rules data

import { 
  CharacterClass, 
  Subclass, 
  ClassFeature, 
  FightingStyle,
  Weapon,
  WeaponProperty,
  Feat,
  Skill,
  DamageType,
  Ability
} from './types'

import { classes, subclasses, fightingStyles } from './data/classes'
import { allFeatures } from './data/features' 
import { allWeapons, weaponProperties } from './data/weapons'
import { srdFeats } from './data/feats'

// Core game data
export const abilities: Ability[] = [
  { id: 'strength', name: 'Strength', shortName: 'STR' },
  { id: 'dexterity', name: 'Dexterity', shortName: 'DEX' },
  { id: 'constitution', name: 'Constitution', shortName: 'CON' },
  { id: 'intelligence', name: 'Intelligence', shortName: 'INT' },
  { id: 'wisdom', name: 'Wisdom', shortName: 'WIS' },
  { id: 'charisma', name: 'Charisma', shortName: 'CHA' }
]

export const skills: Skill[] = [
  { id: 'acrobatics', name: 'Acrobatics', ability: 'dexterity', description: 'Your Dexterity (Acrobatics) check covers your attempt to stay on your feet in a tricky situation.' },
  { id: 'animal_handling', name: 'Animal Handling', ability: 'wisdom', description: 'When there is any question whether you can calm down a domesticated animal, keep a mount from getting spooked, or intuit an animal\'s intentions, the GM might call for a Wisdom (Animal Handling) check.' },
  { id: 'arcana', name: 'Arcana', ability: 'intelligence', description: 'Your Intelligence (Arcana) check measures your ability to recall lore about spells, magic items, eldritch symbols, magical traditions, the planes of existence, and the inhabitants of those planes.' },
  { id: 'athletics', name: 'Athletics', ability: 'strength', description: 'Your Strength (Athletics) check covers difficult situations you encounter while climbing, jumping, or swimming.' },
  { id: 'deception', name: 'Deception', ability: 'charisma', description: 'Your Charisma (Deception) check determines whether you can convincingly hide the truth, either verbally or through your actions.' },
  { id: 'history', name: 'History', ability: 'intelligence', description: 'Your Intelligence (History) check measures your ability to recall lore about historical events, legendary people, ancient kingdoms, past disputes, recent wars, and lost civilizations.' },
  { id: 'insight', name: 'Insight', ability: 'wisdom', description: 'Your Wisdom (Insight) check decides whether you can determine the true intentions of a creature, such as when searching out a lie or predicting someone\'s next move.' },
  { id: 'intimidation', name: 'Intimidation', ability: 'charisma', description: 'When you attempt to influence someone through overt threats, hostile actions, and physical violence, the GM might ask you to make a Charisma (Intimidation) check.' },
  { id: 'investigation', name: 'Investigation', ability: 'intelligence', description: 'When you look around for clues and make deductions based on those clues, you make an Intelligence (Investigation) check.' },
  { id: 'medicine', name: 'Medicine', ability: 'wisdom', description: 'A Wisdom (Medicine) check lets you try to stabilize a dying companion or diagnose an illness.' },
  { id: 'nature', name: 'Nature', ability: 'intelligence', description: 'Your Intelligence (Nature) check measures your ability to recall lore about terrain, plants and animals, the weather, and natural cycles.' },
  { id: 'perception', name: 'Perception', ability: 'wisdom', description: 'Your Wisdom (Perception) check lets you spot, hear, or otherwise detect the presence of something.' },
  { id: 'performance', name: 'Performance', ability: 'charisma', description: 'Your Charisma (Performance) check determines how well you can delight an audience with music, dance, acting, storytelling, or some other form of entertainment.' },
  { id: 'persuasion', name: 'Persuasion', ability: 'charisma', description: 'When you attempt to influence someone or a group of people with tact, social graces, or good nature, the GM might ask you to make a Charisma (Persuasion) check.' },
  { id: 'religion', name: 'Religion', ability: 'intelligence', description: 'Your Intelligence (Religion) check measures your ability to recall lore about deities, rites and prayers, religious hierarchies, holy symbols, and the practices of secret cults.' },
  { id: 'sleight_of_hand', name: 'Sleight of Hand', ability: 'dexterity', description: 'Whenever you attempt an act of legerdemain or manual trickery, such as planting something on someone else or concealing an object on your person, make a Dexterity (Sleight of Hand) check.' },
  { id: 'stealth', name: 'Stealth', ability: 'dexterity', description: 'Make a Dexterity (Stealth) check when you attempt to conceal yourself from enemies, slink past guards, slip away without being noticed, or sneak up on someone without being seen or heard.' },
  { id: 'survival', name: 'Survival', ability: 'wisdom', description: 'The GM might ask you to make a Wisdom (Survival) check to follow tracks, hunt wild game, guide your group through frozen wastelands, identify signs that owlbears live nearby, predict the weather, or avoid quicksand and other natural hazards.' }
]

export const damageTypes: DamageType[] = [
  { id: 'acid', name: 'Acid', description: 'Corrosive damage that eats through materials and flesh.' },
  { id: 'bludgeoning', name: 'Bludgeoning', description: 'Blunt force trauma from hammers, falling, constriction, and the like.' },
  { id: 'cold', name: 'Cold', description: 'Freezing damage from frigid environments or magical effects.' },
  { id: 'fire', name: 'Fire', description: 'Burning damage from flames, heat, or magical fire effects.' },
  { id: 'force', name: 'Force', description: 'Pure magical energy focused into a damaging form.' },
  { id: 'lightning', name: 'Lightning', description: 'Electrical damage from natural or magical sources.' },
  { id: 'necrotic', name: 'Necrotic', description: 'Negative energy that withers matter and the soul.' },
  { id: 'piercing', name: 'Piercing', description: 'Puncturing and impaling attacks, such as spears and arrows.' },
  { id: 'poison', name: 'Poison', description: 'Venomous or toxic substances that harm through biological processes.' },
  { id: 'psychic', name: 'Psychic', description: 'Mental attacks that assault the mind directly.' },
  { id: 'radiant', name: 'Radiant', description: 'Positive energy that burns like the light of the sun.' },
  { id: 'slashing', name: 'Slashing', description: 'Cutting damage from swords, axes, and claws.' },
  { id: 'thunder', name: 'Thunder', description: 'Concussive damage from loud sounds and shock waves.' }
]

/**
 * Rules Data Loader - Main interface for accessing all game content
 */
export class RulesLoader {
  private static instance: RulesLoader
  
  private constructor() {}
  
  static getInstance(): RulesLoader {
    if (!RulesLoader.instance) {
      RulesLoader.instance = new RulesLoader()
    }
    return RulesLoader.instance
  }

  // Classes
  getClasses(): CharacterClass[] {
    return [...classes]
  }

  getClass(id: string): CharacterClass | undefined {
    return classes.find(cls => cls.id === id)
  }

  getSubclasses(classId?: string): Subclass[] {
    if (classId) {
      return subclasses.filter(sub => sub.class === classId)
    }
    return [...subclasses]
  }

  getSubclass(id: string): Subclass | undefined {
    return subclasses.find(sub => sub.id === id)
  }

  // Features
  getFeatures(): ClassFeature[] {
    return [...allFeatures]
  }

  getFeature(id: string): ClassFeature | undefined {
    return allFeatures.find(feature => feature.id === id)
  }

  getClassFeatures(classId: string, level?: number): ClassFeature[] {
    let features = allFeatures.filter(feature => feature.class === classId && !feature.subclass)
    if (level !== undefined) {
      features = features.filter(feature => feature.level <= level)
    }
    return features
  }

  getSubclassFeatures(subclassId: string, level?: number): ClassFeature[] {
    const subclass = this.getSubclass(subclassId)
    if (!subclass) return []
    
    let features = allFeatures.filter(feature => 
      feature.class === subclass.class && feature.subclass === subclassId
    )
    if (level !== undefined) {
      features = features.filter(feature => feature.level <= level)
    }
    return features
  }

  // Fighting Styles
  getFightingStyles(classId?: string): FightingStyle[] {
    if (classId) {
      return fightingStyles.filter(style => style.class.includes(classId))
    }
    return [...fightingStyles]
  }

  getFightingStyle(id: string): FightingStyle | undefined {
    return fightingStyles.find(style => style.id === id)
  }

  // Weapons
  getWeapons(): Weapon[] {
    return [...allWeapons]
  }

  getWeapon(id: string): Weapon | undefined {
    return allWeapons.find(weapon => weapon.id === id)
  }

  getWeaponsByCategory(category: Weapon['category']): Weapon[] {
    return allWeapons.filter(weapon => weapon.category === category)
  }

  getWeaponProperties(): WeaponProperty[] {
    return [...weaponProperties]
  }

  getWeaponProperty(id: string): WeaponProperty | undefined {
    return weaponProperties.find(prop => prop.id === id)
  }

  // Feats
  getFeats(): Feat[] {
    return [...srdFeats]
  }

  getFeat(id: string): Feat | undefined {
    return srdFeats.find(feat => feat.id === id)
  }

  // Core Game Data
  getAbilities(): Ability[] {
    return [...abilities]
  }

  getAbility(id: string): Ability | undefined {
    return abilities.find(ability => ability.id === id)
  }

  getSkills(): Skill[] {
    return [...skills]
  }

  getSkill(id: string): Skill | undefined {
    return skills.find(skill => skill.id === id)
  }

  getSkillsByAbility(abilityId: string): Skill[] {
    return skills.filter(skill => skill.ability === abilityId)
  }

  getDamageTypes(): DamageType[] {
    return [...damageTypes]
  }

  getDamageType(id: string): DamageType | undefined {
    return damageTypes.find(type => type.id === id)
  }

  // Utility methods
  isValidClassLevel(classId: string, level: number): boolean {
    const characterClass = this.getClass(classId)
    return characterClass !== undefined && level >= 1 && level <= 20
  }

  getAvailableSubclasses(classId: string): Subclass[] {
    return this.getSubclasses(classId)
  }

  getClassSpellcasting(classId: string): CharacterClass['spellcasting'] | undefined {
    const characterClass = this.getClass(classId)
    return characterClass?.spellcasting
  }

  // Validation helpers
  validateClassProgression(levels: Array<{ classId: string; level: number }>): boolean {
    const classCounts = new Map<string, number>()
    
    for (const levelEntry of levels) {
      if (!this.isValidClassLevel(levelEntry.classId, levelEntry.level)) {
        return false
      }
      classCounts.set(levelEntry.classId, (classCounts.get(levelEntry.classId) || 0) + 1)
    }
    
    // Check multiclass limits (max 3 classes as per spec)
    if (classCounts.size > 3) {
      return false
    }
    
    return true
  }
}

// Export singleton instance
export const rulesLoader = RulesLoader.getInstance()

// Export convenience functions
export const getClass = (id: string) => rulesLoader.getClass(id)
export const getSubclass = (id: string) => rulesLoader.getSubclass(id)
export const getFeature = (id: string) => rulesLoader.getFeature(id)
export const getFightingStyle = (id: string) => rulesLoader.getFightingStyle(id)
export const getWeapon = (id: string) => rulesLoader.getWeapon(id)
export const getFeat = (id: string) => rulesLoader.getFeat(id)
export const getSkill = (id: string) => rulesLoader.getSkill(id)