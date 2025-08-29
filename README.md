# The Destiny Ledger - D&D 5e Character Optimizer

A browser-based character optimization tool for D&D 5e that provides sophisticated damage per round (DPR) analysis, character comparison, and level path optimization.

## 🚀 Live Demo

Visit the deployed application: [The Destiny Ledger](https://your-username.github.io/The-Destiny-Ledger/)

## 🎯 Project Overview

The Destiny Ledger is designed to help D&D 5e players build and optimize their characters using mathematical analysis and closed-form DPR calculations. The application focuses on accuracy, fast iteration, and clear visualization of character effectiveness.

### Current Implementation Status

✅ **Phase 1 - Foundation (Complete)**
- React 18 + TypeScript + Vite setup
- Tailwind CSS + shadcn/ui design system
- GitHub Pages deployment pipeline
- Project architecture and routing

✅ **Phase 2 - Core Data (Complete)**  
- SRD 5.1 data loaders for Fighter, Rogue, and Ranger
- Comprehensive type definitions for classes, features, weapons, and feats
- Rules validation system
- Data extensibility framework

✅ **Phase 3 - DPR Engine (Core Complete)**
- Closed-form mathematics for hit/crit probability
- Advantage/disadvantage calculations
- GWM/Sharpshooter optimization analysis
- Great Weapon Fighting mechanics
- Sneak Attack application
- Test suite with golden test cases

🚧 **Phase 4 - UI Integration (In Progress)**
- Character builder interface designed
- DPR visualization components created  
- Component integration pending

## 🛠 Technical Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **State**: Zustand + Immer
- **Testing**: Vitest with comprehensive test coverage
- **Deployment**: GitHub Pages with automated CI/CD

## 🎮 Features (Planned)

### Character Builder
- **Ability Scores**: Standard Array, Point Buy, and Manual entry
- **Classes**: Fighter, Rogue, Ranger with full subclass support
- **Multiclassing**: Up to 3 classes with constraint validation
- **Feats**: Complete feat system with half-feat support
- **Equipment**: Weapon and armor selection with magic items

### DPR Analysis
- **Attack Roll Math**: Precise hit/crit calculations
- **Damage Curves**: AC vs DPR visualization (10-30 AC range)
- **Optimization**: GWM/Sharpshooter breakpoint analysis
- **Comparison**: Side-by-side build comparison
- **Export**: Chart export and build sharing

### Level Path Explorer
- **Optimization**: Automatic level ordering for maximum DPR
- **Constraints**: Must-hit milestones and role requirements
- **Analysis**: Side-by-side comparison of optimization paths

## 🏗 Development

### Setup
```bash
npm install
npm run dev
```

### Building
```bash
npm run build
npm run preview
```

### Testing
```bash
npm run test        # Watch mode
npm run test:run    # Single run
```

## 📊 Engine Specifications

The DPR engine implements sophisticated combat mathematics:

- **Attack Probability**: `P(hit) = clamp((21 + attackBonus - AC)/20, 0, 1)`
- **Critical Hits**: Natural 20 (or improved ranges), with doubled weapon dice
- **Advantage/Disadvantage**: Exact joint probability calculations
- **Fighting Styles**: Archery (+2 hit), Dueling (+2 damage), GWF (reroll 1s/2s)
- **Feat Integration**: GWM/SS with automatic threshold optimization
- **Performance**: ≤25ms per build evaluation across AC 10-30

## 🎲 Supported Content

**Current**: SRD 5.1 content including:
- Classes: Fighter, Rogue, Ranger
- Core feats: GWM, Sharpshooter, Crossbow Expert, etc.
- Weapons: Complete SRD weapon list
- Fighting Styles: All standard options

**Future**: Extensible data system ready for:
- Additional official content
- Homebrew integration
- Custom data packs

## 🚀 Deployment

The application is automatically deployed to GitHub Pages via GitHub Actions:

1. Push to `main` branch triggers build
2. Tests run (with soft-fail during development)
3. Vite build creates production assets
4. Deployment to GitHub Pages

### Deployment Configuration
- **Base URL**: `/The-Destiny-Ledger/`
- **SPA Routing**: Configured with 404.html redirect
- **Performance Budget**: Monitored in CI

## 🤝 Contributing

This project follows a structured development plan with clearly defined phases. See `DEVELOPMENT_PLAN.md` for detailed roadmap and architecture decisions.

### Key Principles
- **Accuracy First**: Closed-form math, deterministic results
- **Fast Iteration**: No servers, instant feedback
- **Clean UI**: Modern design with subtle fantasy theming
- **Extensible**: Future-ready data architecture

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Complete UI component integration
- [ ] Implement equipment selection system
- [ ] Add radar chart for non-DPR roles
- [ ] Level path optimization UI
- [ ] Build vault with local storage
- [ ] Export/import functionality
- [ ] Multi-build comparison interface

---

**Note**: This application is currently in active development. Core functionality is implemented but UI integration is ongoing. Check back for regular updates as features are completed and deployed.