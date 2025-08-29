// SRD 5.1 Feats Data

import { Feat } from '../types'

export const srdFeats: Feat[] = [
  {
    id: 'grappler',
    name: 'Grappler',
    description: 'You\'ve developed the skills necessary to hold your own in close-quarters grappling.',
    prerequisite: 'Strength 13 or higher',
    grants: [{
      type: 'special_ability',
      value: 'grappler_advantage'
    }, {
      type: 'special_ability',
      value: 'grappler_pin'
    }]
  },
  {
    id: 'great_weapon_master',
    name: 'Great Weapon Master',
    description: 'You\'ve learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes.',
    grants: [{
      type: 'special_ability',
      value: 'great_weapon_master_bonus_attack'
    }, {
      type: 'special_ability',
      value: 'great_weapon_master_power_attack'
    }]
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'You have mastered ranged weapons and can make shots that others find impossible.',
    grants: [{
      type: 'special_ability',
      value: 'sharpshooter_long_range'
    }, {
      type: 'special_ability',
      value: 'sharpshooter_cover_ignore'
    }, {
      type: 'special_ability',
      value: 'sharpshooter_power_shot'
    }]
  },
  {
    id: 'crossbow_expert',
    name: 'Crossbow Expert',
    description: 'Thanks to extensive practice with the crossbow, you gain the following benefits.',
    grants: [{
      type: 'special_ability',
      value: 'crossbow_expert_loading_ignore'
    }, {
      type: 'special_ability',
      value: 'crossbow_expert_close_range'
    }, {
      type: 'special_ability',
      value: 'crossbow_expert_bonus_attack'
    }]
  },
  {
    id: 'polearm_master',
    name: 'Polearm Master',
    description: 'You can keep your enemies at bay with reach weapons.',
    grants: [{
      type: 'special_ability',
      value: 'polearm_master_bonus_attack'
    }, {
      type: 'special_ability',
      value: 'polearm_master_opportunity_attack'
    }]
  },
  {
    id: 'dual_wielder',
    name: 'Dual Wielder',
    description: 'You master fighting with two weapons, gaining the following benefits.',
    grants: [{
      type: 'ac_bonus',
      value: 1,
      condition: 'wielding_two_melee_weapons'
    }, {
      type: 'special_ability',
      value: 'dual_wielder_non_light'
    }, {
      type: 'special_ability',
      value: 'dual_wielder_draw'
    }]
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    description: 'You have mastered techniques to take advantage of every drop in any enemy\'s guard.',
    grants: [{
      type: 'special_ability',
      value: 'sentinel_opportunity_attack'
    }, {
      type: 'special_ability',
      value: 'sentinel_speed_reduction'
    }, {
      type: 'special_ability',
      value: 'sentinel_disengage_ignore'
    }]
  },
  {
    id: 'lucky',
    name: 'Lucky',
    description: 'You have inexplicable luck that seems to kick in at just the right moment.',
    grants: [{
      type: 'special_ability',
      value: 'lucky_points'
    }]
  },
  {
    id: 'mobile',
    name: 'Mobile',
    description: 'You are exceptionally speedy and agile.',
    grants: [{
      type: 'speed_bonus',
      value: 10
    }, {
      type: 'special_ability',
      value: 'mobile_difficult_terrain'
    }, {
      type: 'special_ability',
      value: 'mobile_opportunity_immunity'
    }]
  },
  {
    id: 'observant',
    name: 'Observant',
    description: 'Quick to notice details of your environment, you gain the following benefits.',
    abilityScoreIncrease: {
      options: ['INT', 'WIS'],
      count: 1
    },
    grants: [{
      type: 'special_ability',
      value: 'observant_passive_bonus'
    }, {
      type: 'special_ability',
      value: 'observant_lip_reading'
    }]
  },
  {
    id: 'resilient',
    name: 'Resilient',
    description: 'Choose one ability score. You gain proficiency in saving throws using the chosen ability.',
    abilityScoreIncrease: {
      options: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
      count: 1
    },
    choices: [{
      id: 'resilient_save_choice',
      name: 'Saving Throw Proficiency',
      description: 'Choose one ability score to gain saving throw proficiency.',
      options: [
        { id: 'str_save', name: 'Strength', description: 'Gain proficiency in Strength saving throws.' },
        { id: 'dex_save', name: 'Dexterity', description: 'Gain proficiency in Dexterity saving throws.' },
        { id: 'con_save', name: 'Constitution', description: 'Gain proficiency in Constitution saving throws.' },
        { id: 'int_save', name: 'Intelligence', description: 'Gain proficiency in Intelligence saving throws.' },
        { id: 'wis_save', name: 'Wisdom', description: 'Gain proficiency in Wisdom saving throws.' },
        { id: 'cha_save', name: 'Charisma', description: 'Gain proficiency in Charisma saving throws.' }
      ],
      count: 1
    }]
  },
  {
    id: 'skilled',
    name: 'Skilled',
    description: 'You gain proficiency in any combination of three skills or tools of your choice.',
    choices: [{
      id: 'skilled_choice',
      name: 'Skill or Tool Proficiencies',
      description: 'Choose three skills or tools.',
      options: [
        // This would be populated dynamically with all available skills and tools
        { id: 'acrobatics', name: 'Acrobatics', description: 'Gain proficiency in Acrobatics.' },
        { id: 'animal_handling', name: 'Animal Handling', description: 'Gain proficiency in Animal Handling.' },
        { id: 'athletics', name: 'Athletics', description: 'Gain proficiency in Athletics.' }
        // ... more options would be added
      ],
      count: 3
    }]
  },
  {
    id: 'tough',
    name: 'Tough',
    description: 'Your hit point maximum increases by an amount equal to twice your level when you gain this feat.',
    grants: [{
      type: 'hp_bonus',
      value: 2,
      scaling: {
        level: 1,
        increment: 2
      }
    }]
  },
  {
    id: 'war_caster',
    name: 'War Caster',
    description: 'You have practiced casting spells in the midst of combat, learning techniques that grant you the following benefits.',
    prerequisite: 'The ability to cast at least one spell',
    grants: [{
      type: 'advantage_on_saves',
      value: 'concentration',
      condition: 'maintaining_concentration_spells'
    }, {
      type: 'special_ability',
      value: 'war_caster_somatic'
    }, {
      type: 'special_ability',
      value: 'war_caster_opportunity_spell'
    }]
  },
  {
    id: 'weapon_master',
    name: 'Weapon Master',
    description: 'You have practiced extensively with a variety of weapons, gaining the following benefits.',
    abilityScoreIncrease: {
      options: ['STR', 'DEX'],
      count: 1
    },
    choices: [{
      id: 'weapon_master_choice',
      name: 'Weapon Proficiencies',
      description: 'Choose four weapons to gain proficiency.',
      options: [
        // This would be populated with all weapon options
        { id: 'longsword', name: 'Longsword', description: 'Gain proficiency with longswords.' },
        { id: 'longbow', name: 'Longbow', description: 'Gain proficiency with longbows.' }
        // ... more weapon options
      ],
      count: 4
    }]
  },
  // Half-feats (provide ability score increases)
  {
    id: 'actor',
    name: 'Actor',
    description: 'Skilled at mimicry and dramatics, you gain the following benefits.',
    abilityScoreIncrease: {
      options: ['CHA'],
      count: 1
    },
    grants: [{
      type: 'special_ability',
      value: 'actor_advantage'
    }, {
      type: 'special_ability',
      value: 'actor_mimicry'
    }]
  },
  {
    id: 'athlete',
    name: 'Athlete',
    description: 'You have undergone extensive physical training to gain the following benefits.',
    abilityScoreIncrease: {
      options: ['STR', 'DEX'],
      count: 1
    },
    grants: [{
      type: 'special_ability',
      value: 'athlete_climbing'
    }, {
      type: 'special_ability',
      value: 'athlete_running_jump'
    }]
  },
  {
    id: 'heavily_armored',
    name: 'Heavily Armored',
    description: 'You have trained to master the use of heavy armor, gaining the following benefits.',
    prerequisite: 'Proficiency with medium armor',
    abilityScoreIncrease: {
      options: ['STR'],
      count: 1
    },
    grants: [{
      type: 'armor_proficiency',
      value: 'heavy_armor'
    }]
  },
  {
    id: 'lightly_armored',
    name: 'Lightly Armored',
    description: 'You have trained to master the use of light armor, gaining the following benefits.',
    abilityScoreIncrease: {
      options: ['STR', 'DEX'],
      count: 1
    },
    grants: [{
      type: 'armor_proficiency',
      value: 'light_armor'
    }]
  },
  {
    id: 'moderately_armored',
    name: 'Moderately Armored',
    description: 'You have trained to master the use of medium armor and shields, gaining the following benefits.',
    prerequisite: 'Proficiency with light armor',
    abilityScoreIncrease: {
      options: ['STR', 'DEX'],
      count: 1
    },
    grants: [{
      type: 'armor_proficiency',
      value: 'medium_armor'
    }, {
      type: 'armor_proficiency',
      value: 'shields'
    }]
  }
]