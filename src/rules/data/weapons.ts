// SRD 5.1 Weapons Data

import { Weapon, WeaponProperty } from '../types'

export const weaponProperties: WeaponProperty[] = [
  {
    id: 'ammunition',
    name: 'Ammunition',
    description: 'You can use a weapon that has the ammunition property to make a ranged attack only if you have ammunition to fire from the weapon.'
  },
  {
    id: 'finesse',
    name: 'Finesse',
    description: 'When making an attack with a finesse weapon, you use your choice of your Strength or Dexterity modifier for the attack and damage rolls.'
  },
  {
    id: 'heavy',
    name: 'Heavy',
    description: 'Small creatures have disadvantage on attack rolls with heavy weapons.'
  },
  {
    id: 'light',
    name: 'Light',
    description: 'A light weapon is small and easy to handle, making it ideal for use when fighting with two weapons.'
  },
  {
    id: 'loading',
    name: 'Loading',
    description: 'Because of the time required to load this weapon, you can fire only one piece of ammunition from it when you use an action, bonus action, or reaction to fire it.'
  },
  {
    id: 'range',
    name: 'Range',
    description: 'A weapon that can be used to make a ranged attack has a range in parentheses after the ammunition or thrown property.'
  },
  {
    id: 'reach',
    name: 'Reach',
    description: 'This weapon adds 5 feet to your reach when you attack with it, as well as when determining your reach for opportunity attacks with it.'
  },
  {
    id: 'thrown',
    name: 'Thrown',
    description: 'If a weapon has the thrown property, you can throw the weapon to make a ranged attack.'
  },
  {
    id: 'two_handed',
    name: 'Two-Handed',
    description: 'This weapon requires two hands when you attack with it.'
  },
  {
    id: 'versatile',
    name: 'Versatile',
    description: 'This weapon can be used with one or two hands. A damage value in parentheses appears with the property—the damage when the weapon is used with two hands to make a melee attack.'
  }
]

// Simple Melee Weapons
export const simpleMeleeWeapons: Weapon[] = [
  {
    id: 'club',
    name: 'Club',
    category: 'simple_melee',
    damage: {
      dice: [{ count: 1, sides: 4 }],
      damageType: 'bludgeoning'
    },
    properties: ['light'],
    weight: 2,
    cost: { quantity: 1, unit: 'sp' }
  },
  {
    id: 'dagger',
    name: 'Dagger',
    category: 'simple_melee',
    damage: {
      dice: [{ count: 1, sides: 4 }],
      damageType: 'piercing'
    },
    properties: ['finesse', 'light', 'thrown'],
    weight: 1,
    cost: { quantity: 2, unit: 'gp' },
    range: { normal: 20, long: 60 }
  },
  {
    id: 'dart',
    name: 'Dart',
    category: 'simple_ranged',
    damage: {
      dice: [{ count: 1, sides: 4 }],
      damageType: 'piercing'
    },
    properties: ['finesse', 'thrown'],
    weight: 0.25,
    cost: { quantity: 5, unit: 'cp' },
    range: { normal: 20, long: 60 }
  },
  {
    id: 'javelin',
    name: 'Javelin',
    category: 'simple_melee',
    damage: {
      dice: [{ count: 1, sides: 6 }],
      damageType: 'piercing'
    },
    properties: ['thrown'],
    weight: 2,
    cost: { quantity: 5, unit: 'sp' },
    range: { normal: 30, long: 120 }
  },
  {
    id: 'light_hammer',
    name: 'Light Hammer',
    category: 'simple_melee',
    damage: {
      dice: [{ count: 1, sides: 4 }],
      damageType: 'bludgeoning'
    },
    properties: ['light', 'thrown'],
    weight: 2,
    cost: { quantity: 2, unit: 'gp' },
    range: { normal: 20, long: 60 }
  },
  {
    id: 'mace',
    name: 'Mace',
    category: 'simple_melee',
    damage: {
      dice: [{ count: 1, sides: 6 }],
      damageType: 'bludgeoning'
    },
    properties: [],
    weight: 4,
    cost: { quantity: 5, unit: 'gp' }
  },
  {
    id: 'quarterstaff',
    name: 'Quarterstaff',
    category: 'simple_melee',
    damage: {
      dice: [{ count: 1, sides: 6 }],
      damageType: 'bludgeoning'
    },
    properties: ['versatile'],
    weight: 4,
    cost: { quantity: 2, unit: 'sp' }
  },
  {
    id: 'sickle',
    name: 'Sickle',
    category: 'simple_melee',
    damage: {
      dice: [{ count: 1, sides: 4 }],
      damageType: 'slashing'
    },
    properties: ['light'],
    weight: 2,
    cost: { quantity: 1, unit: 'gp' }
  },
  {
    id: 'spear',
    name: 'Spear',
    category: 'simple_melee',
    damage: {
      dice: [{ count: 1, sides: 6 }],
      damageType: 'piercing'
    },
    properties: ['thrown', 'versatile'],
    weight: 3,
    cost: { quantity: 1, unit: 'gp' },
    range: { normal: 20, long: 60 }
  }
]

// Simple Ranged Weapons
export const simpleRangedWeapons: Weapon[] = [
  {
    id: 'light_crossbow',
    name: 'Light Crossbow',
    category: 'simple_ranged',
    damage: {
      dice: [{ count: 1, sides: 8 }],
      damageType: 'piercing'
    },
    properties: ['ammunition', 'loading', 'two_handed'],
    weight: 5,
    cost: { quantity: 25, unit: 'gp' },
    range: { normal: 80, long: 320 }
  },
  {
    id: 'shortbow',
    name: 'Shortbow',
    category: 'simple_ranged',
    damage: {
      dice: [{ count: 1, sides: 6 }],
      damageType: 'piercing'
    },
    properties: ['ammunition', 'two_handed'],
    weight: 2,
    cost: { quantity: 25, unit: 'gp' },
    range: { normal: 80, long: 320 }
  },
  {
    id: 'sling',
    name: 'Sling',
    category: 'simple_ranged',
    damage: {
      dice: [{ count: 1, sides: 4 }],
      damageType: 'bludgeoning'
    },
    properties: ['ammunition'],
    weight: 0,
    cost: { quantity: 1, unit: 'sp' },
    range: { normal: 30, long: 120 }
  }
]

// Martial Melee Weapons
export const martialMeleeWeapons: Weapon[] = [
  {
    id: 'battleaxe',
    name: 'Battleaxe',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 8 }],
      damageType: 'slashing'
    },
    properties: ['versatile'],
    weight: 4,
    cost: { quantity: 10, unit: 'gp' }
  },
  {
    id: 'flail',
    name: 'Flail',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 8 }],
      damageType: 'bludgeoning'
    },
    properties: [],
    weight: 2,
    cost: { quantity: 10, unit: 'gp' }
  },
  {
    id: 'glaive',
    name: 'Glaive',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 10 }],
      damageType: 'slashing'
    },
    properties: ['heavy', 'reach', 'two_handed'],
    weight: 6,
    cost: { quantity: 20, unit: 'gp' }
  },
  {
    id: 'greataxe',
    name: 'Greataxe',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 12 }],
      damageType: 'slashing'
    },
    properties: ['heavy', 'two_handed'],
    weight: 7,
    cost: { quantity: 30, unit: 'gp' }
  },
  {
    id: 'greatsword',
    name: 'Greatsword',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 2, sides: 6 }],
      damageType: 'slashing'
    },
    properties: ['heavy', 'two_handed'],
    weight: 6,
    cost: { quantity: 50, unit: 'gp' }
  },
  {
    id: 'halberd',
    name: 'Halberd',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 10 }],
      damageType: 'slashing'
    },
    properties: ['heavy', 'reach', 'two_handed'],
    weight: 6,
    cost: { quantity: 20, unit: 'gp' }
  },
  {
    id: 'lance',
    name: 'Lance',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 12 }],
      damageType: 'piercing'
    },
    properties: ['reach'],
    weight: 6,
    cost: { quantity: 10, unit: 'gp' }
  },
  {
    id: 'longsword',
    name: 'Longsword',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 8 }],
      damageType: 'slashing'
    },
    properties: ['versatile'],
    weight: 3,
    cost: { quantity: 15, unit: 'gp' }
  },
  {
    id: 'maul',
    name: 'Maul',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 2, sides: 6 }],
      damageType: 'bludgeoning'
    },
    properties: ['heavy', 'two_handed'],
    weight: 10,
    cost: { quantity: 10, unit: 'gp' }
  },
  {
    id: 'morningstar',
    name: 'Morningstar',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 8 }],
      damageType: 'piercing'
    },
    properties: [],
    weight: 4,
    cost: { quantity: 15, unit: 'gp' }
  },
  {
    id: 'pike',
    name: 'Pike',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 10 }],
      damageType: 'piercing'
    },
    properties: ['heavy', 'reach', 'two_handed'],
    weight: 18,
    cost: { quantity: 5, unit: 'gp' }
  },
  {
    id: 'rapier',
    name: 'Rapier',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 8 }],
      damageType: 'piercing'
    },
    properties: ['finesse'],
    weight: 2,
    cost: { quantity: 25, unit: 'gp' }
  },
  {
    id: 'scimitar',
    name: 'Scimitar',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 6 }],
      damageType: 'slashing'
    },
    properties: ['finesse', 'light'],
    weight: 3,
    cost: { quantity: 25, unit: 'gp' }
  },
  {
    id: 'shortsword',
    name: 'Shortsword',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 6 }],
      damageType: 'piercing'
    },
    properties: ['finesse', 'light'],
    weight: 2,
    cost: { quantity: 10, unit: 'gp' }
  },
  {
    id: 'trident',
    name: 'Trident',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 6 }],
      damageType: 'piercing'
    },
    properties: ['thrown', 'versatile'],
    weight: 4,
    cost: { quantity: 5, unit: 'gp' },
    range: { normal: 20, long: 60 }
  },
  {
    id: 'war_pick',
    name: 'War Pick',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 8 }],
      damageType: 'piercing'
    },
    properties: [],
    weight: 2,
    cost: { quantity: 5, unit: 'gp' }
  },
  {
    id: 'warhammer',
    name: 'Warhammer',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 8 }],
      damageType: 'bludgeoning'
    },
    properties: ['versatile'],
    weight: 2,
    cost: { quantity: 15, unit: 'gp' }
  },
  {
    id: 'whip',
    name: 'Whip',
    category: 'martial_melee',
    damage: {
      dice: [{ count: 1, sides: 4 }],
      damageType: 'slashing'
    },
    properties: ['finesse', 'reach'],
    weight: 3,
    cost: { quantity: 2, unit: 'gp' }
  }
]

// Martial Ranged Weapons
export const martialRangedWeapons: Weapon[] = [
  {
    id: 'blowgun',
    name: 'Blowgun',
    category: 'martial_ranged',
    damage: {
      dice: [{ count: 1, sides: 1 }],
      damageType: 'piercing'
    },
    properties: ['ammunition', 'loading'],
    weight: 1,
    cost: { quantity: 10, unit: 'gp' },
    range: { normal: 25, long: 100 }
  },
  {
    id: 'hand_crossbow',
    name: 'Hand Crossbow',
    category: 'martial_ranged',
    damage: {
      dice: [{ count: 1, sides: 6 }],
      damageType: 'piercing'
    },
    properties: ['ammunition', 'light', 'loading'],
    weight: 3,
    cost: { quantity: 75, unit: 'gp' },
    range: { normal: 30, long: 120 }
  },
  {
    id: 'heavy_crossbow',
    name: 'Heavy Crossbow',
    category: 'martial_ranged',
    damage: {
      dice: [{ count: 1, sides: 10 }],
      damageType: 'piercing'
    },
    properties: ['ammunition', 'heavy', 'loading', 'two_handed'],
    weight: 18,
    cost: { quantity: 50, unit: 'gp' },
    range: { normal: 100, long: 400 }
  },
  {
    id: 'longbow',
    name: 'Longbow',
    category: 'martial_ranged',
    damage: {
      dice: [{ count: 1, sides: 8 }],
      damageType: 'piercing'
    },
    properties: ['ammunition', 'heavy', 'two_handed'],
    weight: 2,
    cost: { quantity: 50, unit: 'gp' },
    range: { normal: 150, long: 600 }
  },
  {
    id: 'net',
    name: 'Net',
    category: 'martial_ranged',
    damage: {
      dice: [],
      damageType: 'none'
    },
    properties: ['thrown'],
    weight: 3,
    cost: { quantity: 1, unit: 'gp' },
    range: { normal: 5, long: 15 }
  }
]

export const allWeapons = [
  ...simpleMeleeWeapons,
  ...simpleRangedWeapons,
  ...martialMeleeWeapons,
  ...martialRangedWeapons
]