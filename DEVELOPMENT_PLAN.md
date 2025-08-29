# The Destiny Ledger - Development Plan

## Project Overview
Build a browser-based D&D 5e character optimizer with DPR simulation, character comparison, and level path optimization using React 18 + TypeScript + Vite.

**Key Features:**
- Full character builder with SRD 5.1 content
- Closed-form DPR simulation (3-round nova, attack-roll only)
- Multi-build comparison with radar charts
- Level path optimization with constraints
- Local persistence with Build Vault

## Tech Stack & Architecture

### Core Technologies
- **Framework**: React 18 + TypeScript + Vite
- **State Management**: Zustand + Immer
- **Validation**: Zod schemas + React Hook Form
- **Charts**: Recharts (line charts, radar charts)
- **Persistence**: Dexie (IndexedDB)
- **Math Engine**: Web Worker via Comlink
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router (GitHub Pages compatible)
- **CI/CD**: GitHub Actions → GitHub Pages

### Folder Structure
```
/src
  /app                  # routes & layout
  /components           # UI atoms/molecules
  /features
    /builder            # Character Builder
    /dpr                # DPR Lab & math views
    /compare            # Build comparison
    /explorer           # Level Path Explorer
    /vault              # Build Vault
    /settings           # Settings
  /engine               # closed-form math kernel (pure TS)
  /rules                # SRD data loaders + type defs
  /stores               # Zustand stores
  /lib                  # utils (dice, math helpers)
  /assets               # icons, illustrations
  /workers              # DPR worker entry
/tests                  # vitest
```

## Development Phases

### Phase 1: Project Foundation (Week 1-2)

#### 1.1 Setup Development Environment
- [ ] Initialize React 18 + TypeScript + Vite project
- [ ] Configure Tailwind CSS + shadcn/ui components
- [ ] Setup GitHub repository with Pages deployment
- [ ] Configure ESLint, Prettier, and testing framework (Vitest)

#### 1.2 Core Architecture
- [ ] Implement suggested folder structure
- [ ] Setup Zustand stores with Immer (builderStore, dprStore, vaultStore, settingsStore)
- [ ] Configure React Router with GitHub Pages SPA fallback
- [ ] Setup Dexie for IndexedDB persistence

#### 1.3 Initial UI Framework
- [ ] Create main layout with navigation
- [ ] Implement basic routing between screens
- [ ] Apply fantasy-themed design system with ledger textures and arcane colors
- [ ] Setup responsive layout system

**Deliverables:**
- Working development environment
- Basic navigation between empty screens
- Theme system with fantasy aesthetics
- Local storage persistence ready

### Phase 2: DPR Engine Core (Week 3-4)

#### 2.1 Math Kernel Development
- [ ] Build pure TypeScript math engine in `/engine` folder
- [ ] Implement closed-form hit/crit probability calculations
- [ ] Add advantage/disadvantage mechanics with exact joint probabilities
- [ ] Create Extra Attack and Action Surge support
- [ ] Implement GWM/Sharpshooter threshold optimization
- [ ] Add Fighting Style mechanics (Archery, Dueling, GWF)
- [ ] Implement Sneak Attack (once per turn, first qualifying hit)

#### 2.2 Web Worker Integration
- [ ] Setup Comlink for worker communication
- [ ] Create DPR calculation worker
- [ ] Implement performance targets (≤25ms per build evaluation)
- [ ] Add error handling and fallback mechanisms

#### 2.3 Testing Infrastructure
- [ ] Write comprehensive unit tests for math kernel
- [ ] Create golden test cases for accuracy validation (±0.5 DPR tolerance)
- [ ] Add integration tests for worker communication
- [ ] Test GWF reroll math vs exact enumeration

**Deliverables:**
- Fully tested math engine with all v1 mechanics
- Web worker integration with performance targets met
- Comprehensive test suite with golden test cases

### Phase 3: Character Builder (Week 5-6)

#### 3.1 SRD Data Integration
- [ ] Create SRD 5.1 JSON data loaders for Fighter/Rogue/Ranger subset
- [ ] Implement type definitions for classes, feats, weapons, armor
- [ ] Build rules validation system
- [ ] Create data extensibility framework for future expansion

#### 3.2 Builder UI Components
- [ ] Ability score methods (standard/point buy/manual)
- [ ] Class/subclass selection with level timeline (1-20)
- [ ] Feat selection with half-feat ASI choices
- [ ] Gear editor with weapon/armor/magic item support
- [ ] Buff toggle system with concentration conflict detection
- [ ] Per-level milestone and feature tracking

#### 3.3 Validation System
- [ ] Implement Zod schemas for data validation
- [ ] Add React Hook Form integration
- [ ] Create validation badge system for conflicts/missing choices
- [ ] Round-0 concentration conflict warnings

**Deliverables:**
- Complete character builder for core classes
- Full validation and conflict detection
- Per-level timeline with milestone tracking

### Phase 4: DPR Lab & Visualization (Week 7)

#### 4.1 DPR Lab Interface
- [ ] Build input controls for AC range (10-30), advantage states
- [ ] Create Round-0 toggle system
- [ ] Implement resource heuristic configuration
- [ ] Add real-time chart updates (≤100ms UI response)

#### 4.2 Chart Implementation
- [ ] Setup Recharts for line charts with three overlay curves (normal/adv/disadv)
- [ ] Create GWM/Sharpshooter breakpoint tables
- [ ] Add per-round damage breakdown displays
- [ ] Implement responsive chart design

**Deliverables:**
- Interactive DPR Lab with real-time updates
- Multi-state overlay charts
- Breakpoint analysis tables

### Phase 5: Comparison & Non-DPR Scoring (Week 8)

#### 5.1 Build Comparison
- [ ] Implement 3-build comparison interface
- [ ] Create DPR overlay charts for multiple builds
- [ ] Add build notes and comparison controls
- [ ] Implement comparison export functionality

#### 5.2 Radar Chart System
- [ ] Implement 6-axis role scoring (Social, Control, Exploration, Defense, Support, Mobility)
- [ ] Create objective scoring algorithms with manual nudge capability (-10 to +10)
- [ ] Build radar chart visualization with tooltips
- [ ] Add "why" breakdown for scoring rationale

**Deliverables:**
- Multi-build comparison interface
- 6-axis radar chart with objective scoring
- Manual nudge system for role adjustments

### Phase 6: Level Path Explorer (Week 9-10)

#### 6.1 Optimization Engine
- [ ] Implement beam search algorithm for level path optimization
- [ ] Create constraint system (max 3 classes, must-hit milestones)
- [ ] Build objective functions (default: L20 DPR maximization)
- [ ] Add role-by-level targeting system

#### 6.2 Explorer UI
- [ ] Create side-by-side comparison view for up to 3 paths
- [ ] Add per-level DPR sparklines
- [ ] Implement milestone markers and badges
- [ ] Build constraint configuration interface

**Deliverables:**
- Level path optimization engine
- Side-by-side comparison interface
- Constraint-based optimization

### Phase 7: Build Vault & Settings (Week 11)

#### 7.1 Build Management
- [ ] Create Build Vault interface with card-based layout
- [ ] Implement search, filter, and organization features
- [ ] Add duplicate/rename/delete functionality
- [ ] Build usage metrics and performance monitoring

#### 7.2 Settings & Persistence
- [ ] Build settings page for themes, defaults, data management
- [ ] Implement JSON export/import system
- [ ] Add data reset and migration capabilities
- [ ] Create backup/restore functionality

**Deliverables:**
- Complete Build Vault with management features
- Settings system with data controls
- Export/import functionality

### Phase 8: Polish & Launch Prep (Week 12)

#### 8.1 Landing Page & Help
- [ ] Create engaging landing page explaining features
- [ ] Add help tooltips and user guidance
- [ ] Implement empty states and loading indicators
- [ ] Build feature overview and tutorial system

#### 8.2 Final Testing & Performance
- [ ] Complete end-to-end testing
- [ ] Performance optimization and budget validation
- [ ] Accessibility audit (WCAG AA compliance)
- [ ] Cross-browser testing

#### 8.3 Deployment
- [ ] Configure GitHub Actions for automated deployment
- [ ] Setup GitHub Pages with proper SPA routing
- [ ] Final production testing and validation
- [ ] Documentation and user guide

**Deliverables:**
- Production-ready application
- Complete documentation
- Automated deployment pipeline

## Technical Priorities

### 1. Engine-First Development
- Build and thoroughly test the math kernel before UI integration
- Keep engine completely separate from UI components
- Use translator modules for data mapping between engine and UI
- Freeze API types before UI wiring begins

### 2. Static Data Start
- Begin with Fighter/Rogue/Ranger subset to unblock development
- Create extensible data loading architecture
- Plan for future SRD expansion and homebrew support

### 3. Performance Focus
- Maintain ≤25ms DPR calculation target
- Keep UI updates ≤100ms for real-time feedback
- Optimize for 20+ builds in vault without degradation

### 4. Modular Architecture
- Isolated math engine with pure functions
- Separate concerns between features
- Reusable component library
- Clear data flow patterns

## Testing Strategy

### Unit Testing
- Math kernel golden tests for all mechanics
- Hit/crit probability edge cases
- Advantage/disadvantage calculations
- GWM/Sharpshooter threshold detection
- Sneak Attack application logic
- Great Weapon Fighting reroll enumeration

### Integration Testing
- Builder → engine translation accuracy
- Round-0 concentration warnings
- Worker communication reliability
- Data persistence and migration

### UI Testing
- Screen mounting smoke tests
- Critical form validation
- Chart rendering and interaction
- Accessibility compliance

## Success Metrics

### Functional Requirements
- [ ] Create and save 20+ builds without performance degradation
- [ ] Accurate DPR calculations within ±0.5 tolerance vs hand calculations
- [ ] All concentration conflicts properly detected and warned
- [ ] Level Path Explorer produces 3+ viable optimization candidates
- [ ] Complete test suite passing with good coverage

### Performance Requirements
- [ ] DPR evaluation ≤25ms per build across AC 10-30
- [ ] UI interaction to chart update ≤100ms
- [ ] Vault operations remain fast with 20+ builds
- [ ] Chart rendering smooth and responsive

### User Experience
- [ ] Intuitive navigation between all screens
- [ ] Clear validation feedback and error states
- [ ] Accessible design meeting WCAG AA standards
- [ ] Mobile-responsive interface

## Risk Mitigation

### Technical Risks
- **Math Complexity**: Start with golden test cases, cross-validate with manual calculations
- **Performance**: Early profiling, Web Worker isolation, incremental optimization
- **Data Integrity**: Schema versioning, migration strategies, backup systems

### Scope Risks
- **Feature Creep**: Gate with feature flags, prioritize core mechanics first
- **Rules Coverage**: Focus on SRD subset, plan extensibility for future expansion
- **UI Polish**: Time-box visual enhancements, focus on functionality first

### Development Risks
- **Testing Debt**: Write tests alongside features, not after
- **Architecture Drift**: Regular architecture reviews, enforce separation of concerns
- **Performance Regression**: Continuous performance monitoring, budget alerts

## Next Steps

1. **Immediate Actions**
   - Initialize project with Vite + React 18 + TypeScript
   - Setup development environment and tooling
   - Create basic folder structure and routing

2. **Week 1 Goals**
   - Complete project foundation setup
   - Basic navigation between screens
   - Theme system implementation

3. **Milestone Checkpoints**
   - End of Week 2: Foundation complete, ready for engine development
   - End of Week 4: DPR engine fully tested and integrated
   - End of Week 6: Character builder functional
   - End of Week 12: Production launch ready

This development plan provides a structured approach to building The Destiny Ledger while maintaining focus on the core requirements and technical excellence outlined in the product specification.