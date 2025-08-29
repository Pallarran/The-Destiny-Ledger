import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { Build } from './types'
import { DatabaseService } from '@/lib/database'

interface VaultState {
  builds: Build[]
  selectedBuilds: string[]
  searchTerm: string
  sortBy: 'name' | 'createdAt' | 'updatedAt' | 'level'
  sortOrder: 'asc' | 'desc'
  isLoading: boolean
  error: string | null

  // Actions
  loadBuilds: () => Promise<void>
  saveBuild: (build: Build) => Promise<void>
  deleteBuild: (buildId: string) => Promise<void>
  duplicateBuild: (buildId: string) => Promise<void>
  selectBuild: (buildId: string) => void
  deselectBuild: (buildId: string) => void
  selectAllBuilds: () => void
  clearSelection: () => void
  setSearchTerm: (term: string) => void
  setSorting: (sortBy: VaultState['sortBy'], sortOrder: VaultState['sortOrder']) => void
  getFilteredBuilds: () => Build[]
}

export const useVaultStore = create<VaultState>()(
  immer((set, get) => ({
    builds: [],
    selectedBuilds: [],
    searchTerm: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    isLoading: false,
    error: null,

    loadBuilds: async () => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const builds = await DatabaseService.getAllBuilds()
        
        set((state) => {
          state.builds = builds
          state.isLoading = false
        })
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to load builds'
          state.isLoading = false
        })
      }
    },

    saveBuild: async (build: Build) => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        await DatabaseService.saveProject(build)
        
        const existingIndex = get().builds.findIndex((b) => b.id === build.id)
        
        set((state) => {
          if (existingIndex >= 0) {
            state.builds[existingIndex] = { ...build, updatedAt: new Date() }
          } else {
            state.builds.push(build)
          }
          state.isLoading = false
        })
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to save build'
          state.isLoading = false
        })
      }
    },

    deleteBuild: async (buildId: string) => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        await DatabaseService.deleteBuild(buildId)
        
        set((state) => {
          state.builds = state.builds.filter((build) => build.id !== buildId)
          state.selectedBuilds = state.selectedBuilds.filter((id) => id !== buildId)
          state.isLoading = false
        })
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to delete build'
          state.isLoading = false
        })
      }
    },

    duplicateBuild: async (buildId: string) => {
      try {
        const { v4: uuidv4 } = await import('uuid')
        const newId = uuidv4()
        const originalBuild = get().builds.find((build) => build.id === buildId)
        if (!originalBuild) return

        const newName = `${originalBuild.name} (Copy)`
        const duplicatedBuild = await DatabaseService.duplicateBuild(buildId, newId, newName)
        
        if (duplicatedBuild) {
          set((state) => {
            state.builds.push(duplicatedBuild)
          })
        }
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to duplicate build'
        })
      }
    },

    selectBuild: (buildId: string) => {
      set((state) => {
        if (!state.selectedBuilds.includes(buildId)) {
          state.selectedBuilds.push(buildId)
        }
      })
    },

    deselectBuild: (buildId: string) => {
      set((state) => {
        state.selectedBuilds = state.selectedBuilds.filter((id) => id !== buildId)
      })
    },

    selectAllBuilds: () => {
      set((state) => {
        state.selectedBuilds = state.builds.map((build) => build.id)
      })
    },

    clearSelection: () => {
      set((state) => {
        state.selectedBuilds = []
      })
    },

    setSearchTerm: (term: string) => {
      set((state) => {
        state.searchTerm = term
      })
    },

    setSorting: (sortBy: VaultState['sortBy'], sortOrder: VaultState['sortOrder']) => {
      set((state) => {
        state.sortBy = sortBy
        state.sortOrder = sortOrder
      })
    },

    getFilteredBuilds: () => {
      const { builds, searchTerm, sortBy, sortOrder } = get()
      
      let filtered = [...builds]

      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(
          (build) =>
            build.name.toLowerCase().includes(term) ||
            build.notes.toLowerCase().includes(term)
        )
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let comparison = 0
        
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name)
            break
          case 'createdAt':
            comparison = a.createdAt.getTime() - b.createdAt.getTime()
            break
          case 'updatedAt':
            comparison = a.updatedAt.getTime() - b.updatedAt.getTime()
            break
          case 'level':
            comparison = a.levelTimeline.length - b.levelTimeline.length
            break
        }
        
        return sortOrder === 'asc' ? comparison : -comparison
      })

      return filtered
    },
  }))
)