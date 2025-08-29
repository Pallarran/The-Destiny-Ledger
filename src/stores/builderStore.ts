import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { Build, AbilityScores, LevelEntry, BuildFeat, Gear } from './types'
import { v4 as uuidv4 } from 'uuid'

interface BuilderState {
  currentBuild: Build | null
  isLoading: boolean
  error: string | null
  
  // Actions
  createNewBuild: (name: string) => void
  loadBuild: (build: Build) => void
  updateBuildName: (name: string) => void
  updateAbilityScores: (scores: AbilityScores) => void
  addLevelEntry: (entry: Omit<LevelEntry, 'level'>) => void
  updateLevelEntry: (level: number, updates: Partial<LevelEntry>) => void
  removeLevelEntry: (level: number) => void
  addFeat: (feat: BuildFeat) => void
  removeFeat: (featId: string) => void
  updateGear: (gear: Partial<Gear>) => void
  toggleBuff: (buffId: string) => void
  updateNotes: (notes: string) => void
  clearCurrentBuild: () => void
}

const createDefaultBuild = (name: string): Build => ({
  id: uuidv4(),
  name,
  createdAt: new Date(),
  updatedAt: new Date(),
  notes: '',
  version: '1.0.0',
  abilityScores: {
    method: 'standard',
    scores: {
      STR: 15,
      DEX: 14,
      CON: 13,
      INT: 12,
      WIS: 10,
      CHA: 8,
    },
  },
  levelTimeline: [],
  feats: [],
  gear: {
    itemBonuses: [],
    riders: [],
  },
  buffs: [],
  simConfig: {
    acMin: 10,
    acMax: 30,
    acStep: 1,
    round0BuffIds: [],
    greedyHeuristics: true,
    advantageState: 'normal',
  },
})

export const useBuilderStore = create<BuilderState>()(
  immer((set) => ({
    currentBuild: null,
    isLoading: false,
    error: null,

    createNewBuild: (name: string) => {
      set((state) => {
        state.currentBuild = createDefaultBuild(name)
        state.error = null
      })
    },

    loadBuild: (build: Build) => {
      set((state) => {
        state.currentBuild = build
        state.error = null
      })
    },

    updateBuildName: (name: string) => {
      set((state) => {
        if (state.currentBuild) {
          state.currentBuild.name = name
          state.currentBuild.updatedAt = new Date()
        }
      })
    },

    updateAbilityScores: (scores: AbilityScores) => {
      set((state) => {
        if (state.currentBuild) {
          state.currentBuild.abilityScores = scores
          state.currentBuild.updatedAt = new Date()
        }
      })
    },

    addLevelEntry: (entry: Omit<LevelEntry, 'level'>) => {
      set((state) => {
        if (state.currentBuild) {
          const level = state.currentBuild.levelTimeline.length + 1
          const newEntry: LevelEntry = { ...entry, level }
          state.currentBuild.levelTimeline.push(newEntry)
          state.currentBuild.updatedAt = new Date()
        }
      })
    },

    updateLevelEntry: (level: number, updates: Partial<LevelEntry>) => {
      set((state) => {
        if (state.currentBuild) {
          const index = state.currentBuild.levelTimeline.findIndex(
            (entry) => entry.level === level
          )
          if (index !== -1) {
            state.currentBuild.levelTimeline[index] = {
              ...state.currentBuild.levelTimeline[index],
              ...updates,
            }
            state.currentBuild.updatedAt = new Date()
          }
        }
      })
    },

    removeLevelEntry: (level: number) => {
      set((state) => {
        if (state.currentBuild) {
          state.currentBuild.levelTimeline = state.currentBuild.levelTimeline
            .filter((entry) => entry.level !== level)
            .map((entry, index) => ({ ...entry, level: index + 1 }))
          state.currentBuild.updatedAt = new Date()
        }
      })
    },

    addFeat: (feat: BuildFeat) => {
      set((state) => {
        if (state.currentBuild) {
          state.currentBuild.feats.push(feat)
          state.currentBuild.updatedAt = new Date()
        }
      })
    },

    removeFeat: (featId: string) => {
      set((state) => {
        if (state.currentBuild) {
          state.currentBuild.feats = state.currentBuild.feats.filter(
            (feat) => feat.id !== featId
          )
          state.currentBuild.updatedAt = new Date()
        }
      })
    },

    updateGear: (gear: Partial<Gear>) => {
      set((state) => {
        if (state.currentBuild) {
          state.currentBuild.gear = { ...state.currentBuild.gear, ...gear }
          state.currentBuild.updatedAt = new Date()
        }
      })
    },

    toggleBuff: (buffId: string) => {
      set((state) => {
        if (state.currentBuild) {
          const buff = state.currentBuild.buffs.find((b) => b.id === buffId)
          if (buff) {
            buff.active = !buff.active
            state.currentBuild.updatedAt = new Date()
          }
        }
      })
    },

    updateNotes: (notes: string) => {
      set((state) => {
        if (state.currentBuild) {
          state.currentBuild.notes = notes
          state.currentBuild.updatedAt = new Date()
        }
      })
    },

    clearCurrentBuild: () => {
      set((state) => {
        state.currentBuild = null
        state.error = null
      })
    },
  }))
)