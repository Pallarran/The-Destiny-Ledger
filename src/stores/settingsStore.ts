import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

interface SettingsState {
  theme: 'light' | 'dark' | 'auto'
  defaultAbilityMethod: 'standard' | 'pointbuy' | 'manual'
  nonDPRWeights: {
    social: number
    control: number
    exploration: number
    defense: number
    support: number
    mobility: number
  }
  showAdvancedOptions: boolean
  autoSave: boolean
  autoSaveInterval: number // in seconds

  // Actions
  setTheme: (theme: SettingsState['theme']) => void
  setDefaultAbilityMethod: (method: SettingsState['defaultAbilityMethod']) => void
  updateNonDPRWeights: (weights: Partial<SettingsState['nonDPRWeights']>) => void
  setShowAdvancedOptions: (show: boolean) => void
  setAutoSave: (enabled: boolean) => void
  setAutoSaveInterval: (interval: number) => void
  resetToDefaults: () => void
  exportSettings: () => string
  importSettings: (settingsJson: string) => boolean
}

const defaultSettings = {
  theme: 'light' as const,
  defaultAbilityMethod: 'standard' as const,
  nonDPRWeights: {
    social: 1,
    control: 1,
    exploration: 1,
    defense: 1,
    support: 1,
    mobility: 1,
  },
  showAdvancedOptions: false,
  autoSave: true,
  autoSaveInterval: 30,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    immer((set, get) => ({
      ...defaultSettings,

      setTheme: (theme: SettingsState['theme']) => {
        set((state) => {
          state.theme = theme
        })
        
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark')
        } else {
          // Auto theme - use system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          document.documentElement.classList.toggle('dark', prefersDark)
        }
      },

      setDefaultAbilityMethod: (method: SettingsState['defaultAbilityMethod']) => {
        set((state) => {
          state.defaultAbilityMethod = method
        })
      },

      updateNonDPRWeights: (weights: Partial<SettingsState['nonDPRWeights']>) => {
        set((state) => {
          state.nonDPRWeights = { ...state.nonDPRWeights, ...weights }
        })
      },

      setShowAdvancedOptions: (show: boolean) => {
        set((state) => {
          state.showAdvancedOptions = show
        })
      },

      setAutoSave: (enabled: boolean) => {
        set((state) => {
          state.autoSave = enabled
        })
      },

      setAutoSaveInterval: (interval: number) => {
        set((state) => {
          state.autoSaveInterval = Math.max(5, interval) // Minimum 5 seconds
        })
      },

      resetToDefaults: () => {
        set((state) => {
          Object.assign(state, defaultSettings)
        })
      },

      exportSettings: () => {
        const settings = get()
        return JSON.stringify({
          theme: settings.theme,
          defaultAbilityMethod: settings.defaultAbilityMethod,
          nonDPRWeights: settings.nonDPRWeights,
          showAdvancedOptions: settings.showAdvancedOptions,
          autoSave: settings.autoSave,
          autoSaveInterval: settings.autoSaveInterval,
        }, null, 2)
      },

      importSettings: (settingsJson: string) => {
        try {
          const importedSettings = JSON.parse(settingsJson)
          
          set((state) => {
            if (importedSettings.theme) state.theme = importedSettings.theme
            if (importedSettings.defaultAbilityMethod) {
              state.defaultAbilityMethod = importedSettings.defaultAbilityMethod
            }
            if (importedSettings.nonDPRWeights) {
              state.nonDPRWeights = { ...state.nonDPRWeights, ...importedSettings.nonDPRWeights }
            }
            if (typeof importedSettings.showAdvancedOptions === 'boolean') {
              state.showAdvancedOptions = importedSettings.showAdvancedOptions
            }
            if (typeof importedSettings.autoSave === 'boolean') {
              state.autoSave = importedSettings.autoSave
            }
            if (typeof importedSettings.autoSaveInterval === 'number') {
              state.autoSaveInterval = importedSettings.autoSaveInterval
            }
          })
          
          return true
        } catch (error) {
          console.error('Failed to import settings:', error)
          return false
        }
      },
    })),
    {
      name: 'destiny-ledger-settings',
      partialize: (state) => ({
        theme: state.theme,
        defaultAbilityMethod: state.defaultAbilityMethod,
        nonDPRWeights: state.nonDPRWeights,
        showAdvancedOptions: state.showAdvancedOptions,
        autoSave: state.autoSave,
        autoSaveInterval: state.autoSaveInterval,
      }),
    }
  )
)