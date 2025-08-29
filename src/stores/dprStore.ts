import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { Build, DPRResult, SimConfig } from './types'

interface DPRState {
  results: DPRResult | null
  isCalculating: boolean
  error: string | null
  lastCalculatedBuild: Build | null
  
  // Actions
  calculateDPR: (build: Build, config?: Partial<SimConfig>) => Promise<void>
  clearResults: () => void
  setError: (error: string | null) => void
}

export const useDPRStore = create<DPRState>()(
  immer((set) => ({
    results: null,
    isCalculating: false,
    error: null,
    lastCalculatedBuild: null,

    calculateDPR: async (build: Build, _configOverrides?: Partial<SimConfig>) => {
      set((state) => {
        state.isCalculating = true
        state.error = null
      })

      try {
        // This is a placeholder for the actual DPR calculation
        // In Phase 2, this will call the worker with the math engine
        // _configOverrides will be used when implementing the real calculation
        await new Promise((resolve) => setTimeout(resolve, 100))
        
        const mockResult: DPRResult = {
          totalDPR: 45.6,
          perRoundDPR: [15.2, 15.2, 15.2],
          curves: {
            normal: Array.from({ length: 21 }, (_, i) => Math.max(0, 50 - i * 2)),
            advantage: Array.from({ length: 21 }, (_, i) => Math.max(0, 55 - i * 2)),
            disadvantage: Array.from({ length: 21 }, (_, i) => Math.max(0, 40 - i * 2)),
          },
          breakpoints: [
            { ac: 16, withGWM: 42.3, withoutGWM: 38.1, useGWM: true },
            { ac: 18, withGWM: 38.1, withoutGWM: 35.2, useGWM: true },
            { ac: 20, withGWM: 33.9, withoutGWM: 32.3, useGWM: true },
            { ac: 22, withGWM: 29.7, withoutGWM: 29.4, useGWM: false },
          ],
        }

        set((state) => {
          state.results = mockResult
          state.lastCalculatedBuild = build
          state.isCalculating = false
        })
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Unknown error'
          state.isCalculating = false
        })
      }
    },

    clearResults: () => {
      set((state) => {
        state.results = null
        state.lastCalculatedBuild = null
        state.error = null
      })
    },

    setError: (error: string | null) => {
      set((state) => {
        state.error = error
      })
    },
  }))
)