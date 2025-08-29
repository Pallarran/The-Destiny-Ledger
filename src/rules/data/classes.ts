// SRD 5.1 Class Data - Fighter, Rogue, Ranger

import { CharacterClass, Subclass, ClassFeature, FightingStyle } from '../types'

// Fighter Class
export const fighterClass: CharacterClass = {
  id: 'fighter',
  name: 'Fighter',
  hitDie: 10,
  primaryAbility: ['STR', 'DEX'],
  savingThrowProficiencies: ['STR', 'CON'],
  skillChoices: {
    count: 2,
    options: ['acrobatics', 'animal_handling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival']
  },
  proficiencies: {
    armor: ['light_armor', 'medium_armor', 'heavy_armor', 'shields'],
    weapons: ['simple_weapons', 'martial_weapons'],
    tools: []
  },
  startingEquipment: {
    choices: [
      {
        count: 1,
        options: [
          { type: 'armor', id: 'chain_mail' },
          { type: 'armor', id: 'leather_armor', alternatives: [{ type: 'weapon', id: 'longbow' }] }
        ]
      },
      {
        count: 1,
        options: [
          { type: 'weapon', id: 'shield', alternatives: [{ type: 'weapon', id: 'martial_weapon' }] },
          { type: 'weapon', id: 'martial_weapon' }
        ]
      }
    ],
    granted: [
      { type: 'weapon', id: 'light_crossbow', count: 1 },
      { type: 'item', id: 'crossbow_bolts', count: 20 }
    ]
  },
  features: [
    'fighting_style_fighter_1',
    'second_wind',
    'action_surge',
    'extra_attack_fighter',
    'indomitable'
  ],
  subclasses: ['champion', 'battle_master', 'eldritch_knight']
}

// Rogue Class
export const rogueClass: CharacterClass = {
  id: 'rogue',
  name: 'Rogue',
  hitDie: 8,
  primaryAbility: ['DEX'],
  savingThrowProficiencies: ['DEX', 'INT'],
  skillChoices: {
    count: 4,
    options: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleight_of_hand', 'stealth']
  },
  proficiencies: {
    armor: ['light_armor'],
    weapons: ['simple_weapons', 'hand_crossbows', 'longswords', 'rapiers', 'shortswords'],
    tools: ['thieves_tools']
  },
  startingEquipment: {
    choices: [
      {
        count: 1,
        options: [
          { type: 'weapon', id: 'rapier' },
          { type: 'weapon', id: 'shortsword' }
        ]
      },
      {
        count: 1,
        options: [
          { type: 'weapon', id: 'shortbow', alternatives: [{ type: 'item', id: 'arrows', count: 20 }] },
          { type: 'weapon', id: 'shortsword' }
        ]
      }
    ],
    granted: [
      { type: 'item', id: 'thieves_tools', count: 1 },
      { type: 'armor', id: 'leather_armor', count: 1 },
      { type: 'weapon', id: 'dagger', count: 2 }
    ]
  },
  features: [
    'expertise_rogue_1',
    'sneak_attack',
    'thieves_cant',
    'cunning_action',
    'uncanny_dodge',
    'expertise_rogue_6',
    'evasion',
    'reliable_talent',
    'blindsense',
    'slippery_mind',
    'elusive',
    'stroke_of_luck'
  ],
  subclasses: ['thief', 'assassin', 'arcane_trickster']
}

// Ranger Class
export const rangerClass: CharacterClass = {
  id: 'ranger',
  name: 'Ranger',
  hitDie: 10,
  primaryAbility: ['DEX', 'WIS'],
  savingThrowProficiencies: ['STR', 'DEX'],
  skillChoices: {
    count: 3,
    options: ['animal_handling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival']
  },
  proficiencies: {
    armor: ['light_armor', 'medium_armor', 'shields'],
    weapons: ['simple_weapons', 'martial_weapons'],
    tools: []
  },
  startingEquipment: {
    choices: [
      {
        count: 1,
        options: [
          { type: 'armor', id: 'scale_mail' },
          { type: 'armor', id: 'leather_armor' }
        ]
      },
      {
        count: 1,
        options: [
          { type: 'weapon', id: 'shortsword', count: 2 },
          { type: 'weapon', id: 'simple_melee_weapon', count: 2 }
        ]
      }
    ],
    granted: [
      { type: 'item', id: 'dungeoneers_pack', count: 1 }
    ]
  },
  features: [
    'favored_enemy',
    'natural_explorer',
    'fighting_style_ranger_2',
    'spellcasting_ranger',
    'ranger_archetype',
    'primeval_awareness',
    'extra_attack_ranger',
    'lands_stride',
    'hide_in_plain_sight',
    'vanish',
    'feral_senses',
    'foe_slayer'
  ],
  subclasses: ['hunter', 'beast_master'],
  spellcasting: {
    ability: 'WIS',
    cantripsKnown: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    spellsKnown: [0, 0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11],
    spellSlots: [
      [0, 0, 0, 0, 0], // Level 1
      [0, 2, 0, 0, 0], // Level 2
      [0, 3, 0, 0, 0], // Level 3
      [0, 3, 0, 0, 0], // Level 4
      [0, 4, 2, 0, 0], // Level 5
      [0, 4, 2, 0, 0], // Level 6
      [0, 4, 3, 0, 0], // Level 7
      [0, 4, 3, 0, 0], // Level 8
      [0, 4, 3, 2, 0], // Level 9
      [0, 4, 3, 2, 0], // Level 10
      [0, 4, 3, 3, 0], // Level 11
      [0, 4, 3, 3, 0], // Level 12
      [0, 4, 3, 3, 1], // Level 13
      [0, 4, 3, 3, 1], // Level 14
      [0, 4, 3, 3, 2], // Level 15
      [0, 4, 3, 3, 2], // Level 16
      [0, 4, 3, 3, 3], // Level 17
      [0, 4, 3, 3, 3], // Level 18
      [0, 4, 3, 3, 3], // Level 19
      [0, 4, 3, 3, 3]  // Level 20
    ],
    ritual: false,
    preparation: 'known'
  }
}

// Subclasses
export const championSubclass: Subclass = {
  id: 'champion',
  name: 'Champion',
  class: 'fighter',
  description: 'The archetypal Champion focuses on the development of raw physical power honed to deadly perfection.',
  features: ['improved_critical', 'remarkable_athlete', 'additional_fighting_style', 'superior_critical', 'survivor']
}

export const thiefSubclass: Subclass = {
  id: 'thief',
  name: 'Thief',
  class: 'rogue',
  description: 'You hone your skills in the larcenous arts. Burglars, bandits, cutpurses, and other criminals typically follow this archetype.',
  features: ['fast_hands', 'second_story_work', 'supreme_sneak', 'use_magic_device', 'thiefs_reflexes']
}

export const hunterSubclass: Subclass = {
  id: 'hunter',
  name: 'Hunter',
  class: 'ranger',
  description: 'Emulating the Hunter archetype means accepting your place as a bulwark between civilization and the terrors of the wilderness.',
  features: ['hunters_prey', 'defensive_tactics', 'multiattack', 'superior_hunters_defense']
}

// Fighting Styles
export const fightingStyles: FightingStyle[] = [
  {
    id: 'archery',
    name: 'Archery',
    description: 'You gain a +2 bonus to attack rolls you make with ranged weapons.',
    class: ['fighter', 'ranger'],
    level: 1,
    grants: [{
      type: 'attack_bonus',
      value: 2,
      condition: 'ranged_weapon_attack'
    }]
  },
  {
    id: 'defense',
    name: 'Defense',
    description: 'While you are wearing armor, you gain a +1 bonus to AC.',
    class: ['fighter', 'ranger'],
    level: 1,
    grants: [{
      type: 'ac_bonus',
      value: 1,
      condition: 'wearing_armor'
    }]
  },
  {
    id: 'dueling',
    name: 'Dueling',
    description: 'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.',
    class: ['fighter', 'ranger'],
    level: 1,
    grants: [{
      type: 'damage_bonus',
      value: 2,
      condition: 'one_handed_melee_weapon'
    }]
  },
  {
    id: 'great_weapon_fighting',
    name: 'Great Weapon Fighting',
    description: 'When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll.',
    class: ['fighter', 'ranger'],
    level: 1,
    grants: [{
      type: 'special_ability',
      value: 'great_weapon_fighting_reroll'
    }]
  },
  {
    id: 'protection',
    name: 'Protection',
    description: 'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll.',
    class: ['fighter'],
    level: 1,
    grants: [{
      type: 'special_ability',
      value: 'protection_reaction'
    }]
  },
  {
    id: 'two_weapon_fighting',
    name: 'Two-Weapon Fighting',
    description: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.',
    class: ['fighter', 'ranger'],
    level: 1,
    grants: [{
      type: 'special_ability',
      value: 'two_weapon_fighting_bonus'
    }]
  }
]

export const classes = [fighterClass, rogueClass, rangerClass]
export const subclasses = [championSubclass, thiefSubclass, hunterSubclass]