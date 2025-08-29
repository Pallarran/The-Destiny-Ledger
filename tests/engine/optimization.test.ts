// Tests for GWM/SS optimization calculations

import { describe, it, expect } from 'vitest'
import {
  generateGWMAnalysis,
  findGWMBreakpoints,
  calculateOptimalChoice,
  GWMSSParams
} from '../../src/engine/optimization'

describe('Optimization Calculations', () => {
  describe('generateGWMAnalysis', () => {
    it('generates analysis for typical GWM scenario', () => {
      const params: GWMSSParams = {
        baseAttackBonus: 7, // +4 STR + 3 prof
        baseDamage: 11, // 2d6+4 greatsword
        critDamage: 18, // 4d6+4 on crit
        advantageState: 'normal',
        critRange: 20
      }

      const acRange = { min: 10, max: 20, step: 1 }
      const analysis = generateGWMAnalysis(params, acRange)

      expect(analysis).toHaveLength(11) // AC 10-20
      
      // Each entry should have AC, regular DPR, GWM DPR, and recommendation
      analysis.forEach(entry => {
        expect(entry).toHaveProperty('ac')
        expect(entry).toHaveProperty('regularDPR')
        expect(entry).toHaveProperty('gwmDPR')
        expect(entry).toHaveProperty('useGWM')
        expect(entry.ac).toBeGreaterThanOrEqual(10)
        expect(entry.ac).toBeLessThanOrEqual(20)
      })

      // At low AC, GWM should be better
      expect(analysis[0].useGWM).toBe(true)
      
      // At high AC, regular attacks should be better
      expect(analysis[10].useGWM).toBe(false)
    })

    it('handles advantage state correctly', () => {
      const params: GWMSSParams = {
        baseAttackBonus: 7,
        baseDamage: 11,
        critDamage: 18,
        advantageState: 'advantage',
        critRange: 20
      }

      const acRange = { min: 15, max: 15, step: 1 }
      const normalAnalysis = generateGWMAnalysis({...params, advantageState: 'normal'}, acRange)
      const advantageAnalysis = generateGWMAnalysis(params, acRange)

      // With advantage, both regular and GWM DPR should be higher
      expect(advantageAnalysis[0].regularDPR).toBeGreaterThan(normalAnalysis[0].regularDPR)
      expect(advantageAnalysis[0].gwmDPR).toBeGreaterThan(normalAnalysis[0].gwmDPR)
    })

    it('handles disadvantage state correctly', () => {
      const params: GWMSSParams = {
        baseAttackBonus: 7,
        baseDamage: 11,
        critDamage: 18,
        advantageState: 'disadvantage',
        critRange: 20
      }

      const acRange = { min: 15, max: 15, step: 1 }
      const normalAnalysis = generateGWMAnalysis({...params, advantageState: 'normal'}, acRange)
      const disadvantageAnalysis = generateGWMAnalysis(params, acRange)

      // With disadvantage, both regular and GWM DPR should be lower
      expect(disadvantageAnalysis[0].regularDPR).toBeLessThan(normalAnalysis[0].regularDPR)
      expect(disadvantageAnalysis[0].gwmDPR).toBeLessThan(normalAnalysis[0].gwmDPR)
    })

    it('handles improved critical range', () => {
      const params: GWMSSParams = {
        baseAttackBonus: 7,
        baseDamage: 11,
        critDamage: 18,
        advantageState: 'normal',
        critRange: 19 // Champion Fighter improvement
      }

      const acRange = { min: 15, max: 15, step: 1 }
      const normalCritAnalysis = generateGWMAnalysis({...params, critRange: 20}, acRange)
      const improvedCritAnalysis = generateGWMAnalysis(params, acRange)

      // Improved crit range should increase DPR for both options
      expect(improvedCritAnalysis[0].regularDPR).toBeGreaterThan(normalCritAnalysis[0].regularDPR)
      expect(improvedCritAnalysis[0].gwmDPR).toBeGreaterThan(normalCritAnalysis[0].gwmDPR)
    })
  })

  describe('findGWMBreakpoints', () => {
    it('finds breakpoint AC correctly', () => {
      const params: GWMSSParams = {
        baseAttackBonus: 7,
        baseDamage: 11,
        critDamage: 18,
        advantageState: 'normal',
        critRange: 20
      }

      const acRange = { min: 10, max: 20, step: 1 }
      const breakpoints = findGWMBreakpoints(params, acRange)

      expect(breakpoints.length).toBeGreaterThan(0)
      
      // Should find the AC where GWM switches from beneficial to detrimental
      const switchPoint = breakpoints[0]
      expect(switchPoint).toHaveProperty('ac')
      expect(switchPoint).toHaveProperty('type')
      expect(['gwm_to_normal', 'normal_to_gwm']).toContain(switchPoint.type)
    })

    it('handles no breakpoints correctly', () => {
      // Scenario where GWM is always better (very high damage bonus)
      const params: GWMSSParams = {
        baseAttackBonus: 15, // Very high attack bonus
        baseDamage: 50, // Unrealistically high damage
        critDamage: 100,
        advantageState: 'advantage',
        critRange: 18
      }

      const acRange = { min: 10, max: 20, step: 1 }
      const breakpoints = findGWMBreakpoints(params, acRange)

      // Might have no breakpoints if GWM is always optimal in this range
      expect(Array.isArray(breakpoints)).toBe(true)
    })
  })

  describe('calculateOptimalChoice', () => {
    it('returns correct optimal choice', () => {
      const params: GWMSSParams = {
        baseAttackBonus: 7,
        baseDamage: 11,
        critDamage: 18,
        advantageState: 'normal',
        critRange: 20
      }

      // Low AC - GWM should be better
      const lowACChoice = calculateOptimalChoice(params, 12)
      expect(lowACChoice.useGWM).toBe(true)
      expect(lowACChoice.dpr).toBeGreaterThan(lowACChoice.regularDPR)

      // High AC - regular should be better
      const highACChoice = calculateOptimalChoice(params, 18)
      expect(highACChoice.useGWM).toBe(false)
      expect(lowACChoice.dpr).toBeGreaterThanOrEqual(lowACChoice.gwmDPR)
    })

    it('provides accurate DPR calculations', () => {
      const params: GWMSSParams = {
        baseAttackBonus: 8,
        baseDamage: 12,
        critDamage: 19,
        advantageState: 'normal',
        critRange: 20
      }

      const choice = calculateOptimalChoice(params, 15)
      
      expect(choice.regularDPR).toBeGreaterThan(0)
      expect(choice.gwmDPR).toBeGreaterThan(0)
      expect(choice.dpr).toBeGreaterThanOrEqual(Math.max(choice.regularDPR, choice.gwmDPR))
    })
  })

  describe('Edge Cases', () => {
    it('handles zero damage correctly', () => {
      const params: GWMSSParams = {
        baseAttackBonus: 0,
        baseDamage: 0,
        critDamage: 0,
        advantageState: 'normal',
        critRange: 20
      }

      const choice = calculateOptimalChoice(params, 15)
      
      expect(choice.regularDPR).toBe(0)
      expect(choice.gwmDPR).toBeGreaterThanOrEqual(0) // GWM adds +10 damage
      expect(choice.useGWM).toBe(false) // But hit chance is too low
    })

    it('handles impossible to hit scenarios', () => {
      const params: GWMSSParams = {
        baseAttackBonus: -10,
        baseDamage: 20,
        critDamage: 40,
        advantageState: 'normal',
        critRange: 20
      }

      const choice = calculateOptimalChoice(params, 25)
      
      // Both should be very low (only nat 20 hits)
      expect(choice.regularDPR).toBeLessThan(5)
      expect(choice.gwmDPR).toBeLessThan(5)
    })

    it('handles guaranteed hit scenarios', () => {
      const params: GWMSSParams = {
        baseAttackBonus: 20,
        baseDamage: 10,
        critDamage: 20,
        advantageState: 'normal',
        critRange: 20
      }

      const choice = calculateOptimalChoice(params, 5)
      
      // GWM should be clearly better when always hitting
      expect(choice.useGWM).toBe(true)
      expect(choice.gwmDPR).toBeGreaterThan(choice.regularDPR + 8) // About +10 damage difference
    })

    it('handles very wide AC ranges', () => {
      const params: GWMSSParams = {
        baseAttackBonus: 7,
        baseDamage: 11,
        critDamage: 18,
        advantageState: 'normal',
        critRange: 20
      }

      const acRange = { min: 5, max: 35, step: 1 }
      const analysis = generateGWMAnalysis(params, acRange)

      expect(analysis).toHaveLength(31) // AC 5-35
      
      // Should handle extreme low and high ACs gracefully
      expect(analysis[0].regularDPR).toBeGreaterThan(0) // AC 5
      expect(analysis[30].regularDPR).toBeGreaterThan(0) // AC 35 (only crits hit)
    })
  })
})

// Sharpshooter tests (same mechanics as GWM but for ranged weapons)
describe('Sharpshooter Optimization', () => {
  it('calculates Sharpshooter thresholds correctly', () => {
    const params: GWMSSParams = {
      baseAttackBonus: 9, // +4 DEX + 3 prof + 2 Archery
      baseDamage: 8.5, // 1d8+4 longbow
      critDamage: 13, // 2d8+4 on crit
      advantageState: 'normal',
      critRange: 20
    }

    const acRange = { min: 12, max: 18, step: 1 }
    const analysis = generateGWMAnalysis(params, acRange)

    // At lower ACs, SS should be better
    expect(analysis[0].useGWM).toBe(true) // Using GWM flag for SS mechanics
    
    // Find the transition point
    let transitionFound = false
    for (let i = 1; i < analysis.length; i++) {
      if (analysis[i-1].useGWM && !analysis[i].useGWM) {
        transitionFound = true
        break
      }
    }
    
    expect(transitionFound).toBe(true)
  })

  it('handles Archery fighting style bonus correctly', () => {
    const baseParams: GWMSSParams = {
      baseAttackBonus: 7, // +4 DEX + 3 prof
      baseDamage: 8.5,
      critDamage: 13,
      advantageState: 'normal',
      critRange: 20
    }

    const archeryParams: GWMSSParams = {
      ...baseParams,
      baseAttackBonus: 9 // +2 from Archery fighting style
    }

    const acRange = { min: 15, max: 15, step: 1 }
    const baseAnalysis = generateGWMAnalysis(baseParams, acRange)
    const archeryAnalysis = generateGWMAnalysis(archeryParams, acRange)

    // Archery should make SS more attractive due to better hit chance
    expect(archeryAnalysis[0].gwmDPR).toBeGreaterThan(baseAnalysis[0].gwmDPR)
  })
})

// Integration test with realistic scenarios
describe('Realistic Scenario Testing', () => {
  it('Level 5 Great Weapon Master Fighter', () => {
    const params: GWMSSParams = {
      baseAttackBonus: 7, // +4 STR + 3 prof
      baseDamage: 11, // 2d6+4 greatsword
      critDamage: 18, // 4d6+4 crit
      advantageState: 'normal',
      critRange: 20
    }

    const analysis = generateGWMAnalysis(params, { min: 10, max: 20, step: 1 })
    
    // Should find a reasonable breakpoint around AC 14-16
    const breakpoints = findGWMBreakpoints(params, { min: 10, max: 20, step: 1 })
    expect(breakpoints.length).toBeGreaterThan(0)
    
    const breakpointAC = breakpoints[0].ac
    expect(breakpointAC).toBeGreaterThanOrEqual(12)
    expect(breakpointAC).toBeLessThanOrEqual(18)
  })

  it('Level 5 Sharpshooter Ranger with Archery', () => {
    const params: GWMSSParams = {
      baseAttackBonus: 9, // +4 DEX + 3 prof + 2 Archery
      baseDamage: 8.5, // 1d8+4 longbow
      critDamage: 13, // 2d8+4 crit
      advantageState: 'normal',
      critRange: 20
    }

    const choice = calculateOptimalChoice(params, 15)
    
    // With Archery fighting style, SS should be viable at moderate ACs
    expect(choice).toHaveProperty('useGWM') // SS uses same flag
    expect(choice.gwmDPR).toBeGreaterThan(choice.regularDPR - 2) // Should be competitive
  })
})