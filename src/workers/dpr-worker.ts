// DPR calculation Web Worker
// This runs in a separate thread to avoid blocking the main UI

import { expose } from 'comlink'
import {
  calculateDPR,
  calculateDPRCurves,
  calculateCompleteDPR
} from '../engine/dpr-engine'
import {
  calculateGWMThreshold,
  generateGWMAnalysis,
  findGWMBreakpoint
} from '../engine/optimization'
import {
  calculateHitProbability,
  applyAdvantageDisadvantage,
  simulateAdvantageRoll
} from '../engine/probability'
import {
  parseDiceNotation,
  calculateDamageExpectation,
  applyGreatWeaponFighting,
  calculateCriticalDamage
} from '../engine/damage'
import type {
  DPRCalculationInput,
  DPRResult,
  CompleteDPRResult,
  BuildConfiguration,
  CurveData,
  GWMThresholdResult
} from '../engine/types'

/**
 * DPR Worker API - exposed functions that can be called from the main thread
 */
export interface DPRWorkerAPI {
  // Main DPR calculations
  calculateDPR(input: DPRCalculationInput): Promise<DPRResult>
  calculateDPRCurves(
    build: BuildConfiguration,
    acRange?: { min: number; max: number; step: number },
    rounds?: number
  ): Promise<CurveData>
  calculateCompleteDPR(
    build: BuildConfiguration,
    acRange?: { min: number; max: number; step: number },
    rounds?: number
  ): Promise<CompleteDPRResult>
  
  // GWM/SS optimization
  calculateGWMThreshold(params: {
    baseAttackBonus: number
    baseDamage: number
    critDamage: number
    advantageState: 'normal' | 'advantage' | 'disadvantage'
    critRange?: number
  }, targetAC: number): Promise<GWMThresholdResult>
  
  generateGWMAnalysis(params: {
    baseAttackBonus: number
    baseDamage: number
    critDamage: number
    advantageState: 'normal' | 'advantage' | 'disadvantage'
    critRange?: number
  }, acRange?: { min: number; max: number; step: number }): Promise<GWMThresholdResult[]>
  
  findGWMBreakpoint(params: {
    baseAttackBonus: number
    baseDamage: number
    critDamage: number
    advantageState: 'normal' | 'advantage' | 'disadvantage'
    critRange?: number
  }, acRange?: { min: number; max: number }): Promise<number>
  
  // Utility calculations
  calculateHitProbability(attackBonus: number, targetAC: number, critRange?: number): Promise<{
    pHit: number
    pCrit: number
    pMiss: number
  }>
  
  parseDiceNotation(dice: string): Promise<{ count: number; sides: number; average: number }>
  
  // Validation functions (used in tests)
  simulateAdvantageRoll(
    attackBonus: number,
    targetAC: number,
    advantageState: 'normal' | 'advantage' | 'disadvantage',
    iterations?: number
  ): Promise<{ hitRate: number; critRate: number }>
  
  // Health check
  ping(): Promise<'pong'>
}

/**
 * Worker implementation
 */
const workerAPI: DPRWorkerAPI = {
  async calculateDPR(input: DPRCalculationInput): Promise<DPRResult> {
    const startTime = performance.now()
    const result = calculateDPR(input)
    const endTime = performance.now()
    
    // Log performance for monitoring
    if (endTime - startTime > 50) { // Log if it takes more than 50ms
      console.warn(`DPR calculation took ${endTime - startTime}ms - consider optimization`)
    }
    
    return result
  },

  async calculateDPRCurves(
    build: BuildConfiguration,
    acRange = { min: 10, max: 30, step: 1 },
    rounds = 3
  ): Promise<CurveData> {
    const startTime = performance.now()
    const result = calculateDPRCurves(build, acRange, rounds)
    const endTime = performance.now()
    
    // This should be fast even for full curves
    if (endTime - startTime > 100) {
      console.warn(`DPR curves calculation took ${endTime - startTime}ms`)
    }
    
    return result
  },

  async calculateCompleteDPR(
    build: BuildConfiguration,
    acRange = { min: 10, max: 30, step: 1 },
    rounds = 3
  ): Promise<CompleteDPRResult> {
    const startTime = performance.now()
    const result = calculateCompleteDPR(build, acRange, rounds)
    const endTime = performance.now()
    
    if (endTime - startTime > 25) { // Target: ≤25ms per spec
      console.warn(`Complete DPR analysis took ${endTime - startTime}ms (target: ≤25ms)`)
    }
    
    return result
  },

  async calculateGWMThreshold(params, targetAC): Promise<GWMThresholdResult> {
    return calculateGWMThreshold(params, targetAC)
  },

  async generateGWMAnalysis(params, acRange = { min: 10, max: 30, step: 1 }): Promise<GWMThresholdResult[]> {
    return generateGWMAnalysis(params, acRange)
  },

  async findGWMBreakpoint(params, acRange = { min: 10, max: 30 }): Promise<number> {
    return findGWMBreakpoint(params, acRange)
  },

  async calculateHitProbability(attackBonus, targetAC, critRange = 20) {
    return calculateHitProbability(attackBonus, targetAC, critRange)
  },

  async parseDiceNotation(dice) {
    return parseDiceNotation(dice)
  },

  async simulateAdvantageRoll(attackBonus, targetAC, advantageState, iterations = 10000) {
    return simulateAdvantageRoll(attackBonus, targetAC, advantageState, iterations)
  },

  async ping() {
    return 'pong' as const
  }
}

// Expose the API to the main thread
expose(workerAPI)