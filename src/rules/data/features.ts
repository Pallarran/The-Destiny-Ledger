// SRD 5.1 Class Features Data

import { ClassFeature } from '../types'

// Fighter Features
export const fighterFeatures: ClassFeature[] = [
  {
    id: 'fighting_style_fighter_1',
    name: 'Fighting Style',
    description: 'You adopt a particular style of fighting as your specialty.',
    level: 1,
    class: 'fighter',
    choices: [{
      id: 'fighting_style_choice',
      name: 'Fighting Style Choice',
      description: 'Choose one fighting style.',
      options: [
        { id: 'archery', name: 'Archery', description: 'You gain a +2 bonus to attack rolls you make with ranged weapons.' },
        { id: 'defense', name: 'Defense', description: 'While you are wearing armor, you gain a +1 bonus to AC.' },
        { id: 'dueling', name: 'Dueling', description: 'When wielding a one-handed melee weapon with no other weapons, you gain +2 damage.' },
        { id: 'great_weapon_fighting', name: 'Great Weapon Fighting', description: 'Reroll 1s and 2s on damage dice for two-handed melee weapons.' },
        { id: 'protection', name: 'Protection', description: 'Use your reaction to impose disadvantage on attacks against nearby allies.' },
        { id: 'two_weapon_fighting', name: 'Two-Weapon Fighting', description: 'Add your ability modifier to off-hand weapon damage.' }
      ],
      count: 1
    }]
  },
  {
    id: 'second_wind',
    name: 'Second Wind',
    description: 'You have a limited well of stamina that you can draw on to protect yourself from harm.',
    level: 1,
    class: 'fighter',
    grants: [{
      type: 'special_ability',
      value: 'second_wind'
    }]
  },
  {
    id: 'action_surge',
    name: 'Action Surge',
    description: 'Starting at 2nd level, you can push yourself beyond your normal limits for a moment.',
    level: 2,
    class: 'fighter',
    grants: [{
      type: 'special_ability',
      value: 'action_surge'
    }]
  },
  {
    id: 'extra_attack_fighter',
    name: 'Extra Attack',
    description: 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
    level: 5,
    class: 'fighter',
    grants: [{
      type: 'special_ability',
      value: 'extra_attack'
    }]
  },
  {
    id: 'indomitable',
    name: 'Indomitable',
    description: 'Beginning at 9th level, you can reroll a saving throw that you fail.',
    level: 9,
    class: 'fighter',
    grants: [{
      type: 'special_ability',
      value: 'indomitable'
    }]
  }
]

// Rogue Features
export const rogueFeatures: ClassFeature[] = [
  {
    id: 'expertise_rogue_1',
    name: 'Expertise',
    description: 'At 1st level, choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.',
    level: 1,
    class: 'rogue',
    choices: [{
      id: 'expertise_1_choice',
      name: 'Expertise Skills',
      description: 'Choose two skill proficiencies to double your proficiency bonus.',
      options: [], // Would be populated based on character's skills
      count: 2
    }]
  },
  {
    id: 'sneak_attack',
    name: 'Sneak Attack',
    description: 'Beginning at 1st level, you know how to strike subtly and exploit a foe\'s distraction.',
    level: 1,
    class: 'rogue',
    grants: [{
      type: 'special_ability',
      value: 'sneak_attack',
      scaling: {
        level: 1,
        increment: 1
      }
    }]
  },
  {
    id: 'thieves_cant',
    name: 'Thieves\' Cant',
    description: 'During your rogue training you learned thieves\' cant, a secret mix of dialect, jargon, and code.',
    level: 1,
    class: 'rogue',
    grants: [{
      type: 'language',
      value: 'thieves_cant'
    }]
  },
  {
    id: 'cunning_action',
    name: 'Cunning Action',
    description: 'Starting at 2nd level, your quick thinking and agility allow you to move and act quickly.',
    level: 2,
    class: 'rogue',
    grants: [{
      type: 'special_ability',
      value: 'cunning_action'
    }]
  },
  {
    id: 'uncanny_dodge',
    name: 'Uncanny Dodge',
    description: 'Starting at 5th level, when an attacker that you can see hits you with an attack, you can use your reaction to halve the attack\'s damage against you.',
    level: 5,
    class: 'rogue',
    grants: [{
      type: 'special_ability',
      value: 'uncanny_dodge'
    }]
  },
  {
    id: 'expertise_rogue_6',
    name: 'Expertise',
    description: 'At 6th level, you can choose two more of your proficiencies to gain the benefit of Expertise.',
    level: 6,
    class: 'rogue',
    choices: [{
      id: 'expertise_6_choice',
      name: 'Additional Expertise Skills',
      description: 'Choose two more skill proficiencies to double your proficiency bonus.',
      options: [], // Would be populated based on character's skills
      count: 2
    }]
  },
  {
    id: 'evasion',
    name: 'Evasion',
    description: 'Beginning at 7th level, you can nimbly dodge out of the way of certain area effects.',
    level: 7,
    class: 'rogue',
    grants: [{
      type: 'special_ability',
      value: 'evasion'
    }]
  },
  {
    id: 'reliable_talent',
    name: 'Reliable Talent',
    description: 'By 11th level, you have refined your chosen skills until they approach perfection.',
    level: 11,
    class: 'rogue',
    grants: [{
      type: 'special_ability',
      value: 'reliable_talent'
    }]
  },
  {
    id: 'blindsense',
    name: 'Blindsense',
    description: 'Starting at 14th level, if you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.',
    level: 14,
    class: 'rogue',
    grants: [{
      type: 'special_ability',
      value: 'blindsense'
    }]
  },
  {
    id: 'slippery_mind',
    name: 'Slippery Mind',
    description: 'By 15th level, you have acquired greater mental strength.',
    level: 15,
    class: 'rogue',
    grants: [{
      type: 'saving_throw_proficiency',
      value: 'WIS'
    }]
  },
  {
    id: 'elusive',
    name: 'Elusive',
    description: 'Beginning at 18th level, you are so evasive that attackers rarely gain the upper hand against you.',
    level: 18,
    class: 'rogue',
    grants: [{
      type: 'special_ability',
      value: 'elusive'
    }]
  },
  {
    id: 'stroke_of_luck',
    name: 'Stroke of Luck',
    description: 'At 20th level, you have an uncanny knack for succeeding when you need to.',
    level: 20,
    class: 'rogue',
    grants: [{
      type: 'special_ability',
      value: 'stroke_of_luck'
    }]
  }
]

// Ranger Features
export const rangerFeatures: ClassFeature[] = [
  {
    id: 'favored_enemy',
    name: 'Favored Enemy',
    description: 'Beginning at 1st level, you have significant experience studying, tracking, hunting, and even talking to a certain type of creature.',
    level: 1,
    class: 'ranger',
    choices: [{
      id: 'favored_enemy_choice',
      name: 'Favored Enemy Type',
      description: 'Choose a type of favored enemy.',
      options: [
        { id: 'beasts', name: 'Beasts', description: 'Beasts' },
        { id: 'fey', name: 'Fey', description: 'Fey' },
        { id: 'humanoids', name: 'Humanoids', description: 'Humanoids (choose two races)' },
        { id: 'monstrosities', name: 'Monstrosities', description: 'Monstrosities' },
        { id: 'undead', name: 'Undead', description: 'Undead' }
      ],
      count: 1
    }]
  },
  {
    id: 'natural_explorer',
    name: 'Natural Explorer',
    description: 'You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions.',
    level: 1,
    class: 'ranger',
    choices: [{
      id: 'natural_explorer_choice',
      name: 'Favored Terrain',
      description: 'Choose a favored terrain.',
      options: [
        { id: 'arctic', name: 'Arctic', description: 'Arctic' },
        { id: 'coast', name: 'Coast', description: 'Coast' },
        { id: 'desert', name: 'Desert', description: 'Desert' },
        { id: 'forest', name: 'Forest', description: 'Forest' },
        { id: 'grassland', name: 'Grassland', description: 'Grassland' },
        { id: 'mountain', name: 'Mountain', description: 'Mountain' },
        { id: 'swamp', name: 'Swamp', description: 'Swamp' }
      ],
      count: 1
    }]
  },
  {
    id: 'fighting_style_ranger_2',
    name: 'Fighting Style',
    description: 'At 2nd level, you adopt a particular style of fighting as your specialty.',
    level: 2,
    class: 'ranger',
    choices: [{
      id: 'fighting_style_ranger_choice',
      name: 'Fighting Style Choice',
      description: 'Choose one fighting style.',
      options: [
        { id: 'archery', name: 'Archery', description: 'You gain a +2 bonus to attack rolls you make with ranged weapons.' },
        { id: 'defense', name: 'Defense', description: 'While you are wearing armor, you gain a +1 bonus to AC.' },
        { id: 'dueling', name: 'Dueling', description: 'When wielding a one-handed melee weapon with no other weapons, you gain +2 damage.' },
        { id: 'two_weapon_fighting', name: 'Two-Weapon Fighting', description: 'Add your ability modifier to off-hand weapon damage.' }
      ],
      count: 1
    }]
  },
  {
    id: 'spellcasting_ranger',
    name: 'Spellcasting',
    description: 'By the time you reach 2nd level, you have learned to use the magical essence of nature to cast spells.',
    level: 2,
    class: 'ranger',
    grants: [{
      type: 'special_ability',
      value: 'spellcasting_ranger'
    }]
  },
  {
    id: 'ranger_archetype',
    name: 'Ranger Archetype',
    description: 'At 3rd level, you choose an archetype that you strive to emulate.',
    level: 3,
    class: 'ranger',
    choices: [{
      id: 'ranger_archetype_choice',
      name: 'Ranger Archetype',
      description: 'Choose your ranger archetype.',
      options: [
        { id: 'hunter', name: 'Hunter', description: 'Hunter' },
        { id: 'beast_master', name: 'Beast Master', description: 'Beast Master' }
      ],
      count: 1
    }]
  },
  {
    id: 'primeval_awareness',
    name: 'Primeval Awareness',
    description: 'Beginning at 3rd level, you can use your action and expend one ranger spell slot to focus your awareness on the region around you.',
    level: 3,
    class: 'ranger',
    grants: [{
      type: 'special_ability',
      value: 'primeval_awareness'
    }]
  },
  {
    id: 'extra_attack_ranger',
    name: 'Extra Attack',
    description: 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
    level: 5,
    class: 'ranger',
    grants: [{
      type: 'special_ability',
      value: 'extra_attack'
    }]
  },
  {
    id: 'lands_stride',
    name: 'Land\'s Stride',
    description: 'Starting at 8th level, moving through nonmagical difficult terrain costs you no extra movement.',
    level: 8,
    class: 'ranger',
    grants: [{
      type: 'special_ability',
      value: 'lands_stride'
    }]
  },
  {
    id: 'hide_in_plain_sight',
    name: 'Hide in Plain Sight',
    description: 'Starting at 10th level, you can spend 1 minute creating camouflage for yourself.',
    level: 10,
    class: 'ranger',
    grants: [{
      type: 'special_ability',
      value: 'hide_in_plain_sight'
    }]
  },
  {
    id: 'vanish',
    name: 'Vanish',
    description: 'Starting at 14th level, you can use the Hide action as a bonus action on your turn.',
    level: 14,
    class: 'ranger',
    grants: [{
      type: 'special_ability',
      value: 'vanish'
    }]
  },
  {
    id: 'feral_senses',
    name: 'Feral Senses',
    description: 'At 18th level, you gain preternatural senses that help you fight creatures you can\'t see.',
    level: 18,
    class: 'ranger',
    grants: [{
      type: 'special_ability',
      value: 'feral_senses'
    }]
  },
  {
    id: 'foe_slayer',
    name: 'Foe Slayer',
    description: 'At 20th level, you become an unparalleled hunter of your enemies.',
    level: 20,
    class: 'ranger',
    grants: [{
      type: 'special_ability',
      value: 'foe_slayer'
    }]
  }
]

// Champion Features
export const championFeatures: ClassFeature[] = [
  {
    id: 'improved_critical',
    name: 'Improved Critical',
    description: 'Beginning when you choose this archetype at 3rd level, your weapon attacks score a critical hit on a roll of 19 or 20.',
    level: 3,
    class: 'fighter',
    subclass: 'champion',
    grants: [{
      type: 'special_ability',
      value: 'improved_critical'
    }]
  },
  {
    id: 'remarkable_athlete',
    name: 'Remarkable Athlete',
    description: 'Starting at 7th level, you can add half your proficiency bonus (round up) to any Strength, Dexterity, or Constitution check you make that doesn\'t already use your proficiency bonus.',
    level: 7,
    class: 'fighter',
    subclass: 'champion',
    grants: [{
      type: 'special_ability',
      value: 'remarkable_athlete'
    }]
  },
  {
    id: 'additional_fighting_style',
    name: 'Additional Fighting Style',
    description: 'At 10th level, you can choose a second option from the Fighting Style class feature.',
    level: 10,
    class: 'fighter',
    subclass: 'champion',
    choices: [{
      id: 'additional_fighting_style_choice',
      name: 'Additional Fighting Style',
      description: 'Choose a second fighting style.',
      options: [
        { id: 'archery', name: 'Archery', description: 'You gain a +2 bonus to attack rolls you make with ranged weapons.' },
        { id: 'defense', name: 'Defense', description: 'While you are wearing armor, you gain a +1 bonus to AC.' },
        { id: 'dueling', name: 'Dueling', description: 'When wielding a one-handed melee weapon with no other weapons, you gain +2 damage.' },
        { id: 'great_weapon_fighting', name: 'Great Weapon Fighting', description: 'Reroll 1s and 2s on damage dice for two-handed melee weapons.' },
        { id: 'protection', name: 'Protection', description: 'Use your reaction to impose disadvantage on attacks against nearby allies.' },
        { id: 'two_weapon_fighting', name: 'Two-Weapon Fighting', description: 'Add your ability modifier to off-hand weapon damage.' }
      ],
      count: 1
    }]
  },
  {
    id: 'superior_critical',
    name: 'Superior Critical',
    description: 'Starting at 15th level, your weapon attacks score a critical hit on a roll of 18-20.',
    level: 15,
    class: 'fighter',
    subclass: 'champion',
    grants: [{
      type: 'special_ability',
      value: 'superior_critical'
    }]
  },
  {
    id: 'survivor',
    name: 'Survivor',
    description: 'At 18th level, you attain the pinnacle of resilience in battle.',
    level: 18,
    class: 'fighter',
    subclass: 'champion',
    grants: [{
      type: 'special_ability',
      value: 'survivor'
    }]
  }
]

// Thief Features
export const thiefFeatures: ClassFeature[] = [
  {
    id: 'fast_hands',
    name: 'Fast Hands',
    description: 'Starting at 3rd level, you can use the bonus action granted by your Cunning Action to make a Dexterity (Sleight of Hand) check, use your thieves\' tools to disarm a trap or open a lock, or take the Use an Object action.',
    level: 3,
    class: 'rogue',
    subclass: 'thief',
    grants: [{
      type: 'special_ability',
      value: 'fast_hands'
    }]
  },
  {
    id: 'second_story_work',
    name: 'Second-Story Work',
    description: 'When you choose this archetype at 3rd level, you gain the ability to climb faster than normal.',
    level: 3,
    class: 'rogue',
    subclass: 'thief',
    grants: [{
      type: 'special_ability',
      value: 'second_story_work'
    }]
  },
  {
    id: 'supreme_sneak',
    name: 'Supreme Sneak',
    description: 'Starting at 9th level, you have advantage on a Dexterity (Stealth) check if you move no more than half your speed on the same turn.',
    level: 9,
    class: 'rogue',
    subclass: 'thief',
    grants: [{
      type: 'special_ability',
      value: 'supreme_sneak'
    }]
  },
  {
    id: 'use_magic_device',
    name: 'Use Magic Device',
    description: 'By 13th level, you have learned enough about the workings of magic that you can improvise the use of items even when they are not intended for you.',
    level: 13,
    class: 'rogue',
    subclass: 'thief',
    grants: [{
      type: 'special_ability',
      value: 'use_magic_device'
    }]
  },
  {
    id: 'thiefs_reflexes',
    name: 'Thief\'s Reflexes',
    description: 'When you reach 17th level, you have become adept at laying ambushes and quickly escaping danger.',
    level: 17,
    class: 'rogue',
    subclass: 'thief',
    grants: [{
      type: 'special_ability',
      value: 'thiefs_reflexes'
    }]
  }
]

// Hunter Features
export const hunterFeatures: ClassFeature[] = [
  {
    id: 'hunters_prey',
    name: 'Hunter\'s Prey',
    description: 'At 3rd level, you gain one of the following features of your choice.',
    level: 3,
    class: 'ranger',
    subclass: 'hunter',
    choices: [{
      id: 'hunters_prey_choice',
      name: 'Hunter\'s Prey Option',
      description: 'Choose one Hunter\'s Prey feature.',
      options: [
        { id: 'colossus_slayer', name: 'Colossus Slayer', description: 'Your tenacity can wear down the most potent foes.' },
        { id: 'giant_killer', name: 'Giant Killer', description: 'When a Large or larger creature within 5 feet of you hits or misses you with an attack, you can use your reaction to attack that creature.' },
        { id: 'horde_breaker', name: 'Horde Breaker', description: 'Once on each of your turns when you make a weapon attack, you can make another attack with the same weapon against a different creature.' }
      ],
      count: 1
    }]
  },
  {
    id: 'defensive_tactics',
    name: 'Defensive Tactics',
    description: 'At 7th level, you gain one of the following features of your choice.',
    level: 7,
    class: 'ranger',
    subclass: 'hunter',
    choices: [{
      id: 'defensive_tactics_choice',
      name: 'Defensive Tactics Option',
      description: 'Choose one Defensive Tactics feature.',
      options: [
        { id: 'escape_the_horde', name: 'Escape the Horde', description: 'Opportunity attacks against you are made with disadvantage.' },
        { id: 'multiattack_defense', name: 'Multiattack Defense', description: 'When a creature hits you with an attack, you gain a +4 bonus to AC against all subsequent attacks made by that creature for the rest of the turn.' },
        { id: 'steel_will', name: 'Steel Will', description: 'You have advantage on saving throws against being frightened.' }
      ],
      count: 1
    }]
  },
  {
    id: 'multiattack',
    name: 'Multiattack',
    description: 'At 11th level, you gain one of the following features of your choice.',
    level: 11,
    class: 'ranger',
    subclass: 'hunter',
    choices: [{
      id: 'multiattack_choice',
      name: 'Multiattack Option',
      description: 'Choose one Multiattack feature.',
      options: [
        { id: 'volley', name: 'Volley', description: 'You can use your action to make a ranged attack against any number of creatures within 10 feet of a point you can see within your weapon\'s range.' },
        { id: 'whirlwind_attack', name: 'Whirlwind Attack', description: 'You can use your action to make a melee attack against any number of creatures within 5 feet of you.' }
      ],
      count: 1
    }]
  },
  {
    id: 'superior_hunters_defense',
    name: 'Superior Hunter\'s Defense',
    description: 'At 15th level, you gain one of the following features of your choice.',
    level: 15,
    class: 'ranger',
    subclass: 'hunter',
    choices: [{
      id: 'superior_hunters_defense_choice',
      name: 'Superior Hunter\'s Defense Option',
      description: 'Choose one Superior Hunter\'s Defense feature.',
      options: [
        { id: 'evasion', name: 'Evasion', description: 'You can nimbly dodge out of the way of certain area effects.' },
        { id: 'stand_against_the_tide', name: 'Stand Against the Tide', description: 'When a hostile creature misses you with a melee attack, you can use your reaction to force that creature to repeat the same attack against another creature.' },
        { id: 'uncanny_dodge', name: 'Uncanny Dodge', description: 'When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack\'s damage against you.' }
      ],
      count: 1
    }]
  }
]

export const allFeatures = [
  ...fighterFeatures,
  ...rogueFeatures,
  ...rangerFeatures,
  ...championFeatures,
  ...thiefFeatures,
  ...hunterFeatures
]