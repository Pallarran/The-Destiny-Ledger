# The Destiny Ledger — Development Plan
**Version:** v1.1 — 2025-08-29

This plan updates the original development plan to enforce the **Modern‑Fantasy Skin** introduced in the product spec (Section 9). It preserves the overall feature cadence and architecture, but adds concrete theming work, CI guardrails, and acceptance criteria tied to the visual direction.

> **Design reference:** concept images live in the repository at `./concept/` (Compare Builds, Character Builder, DPR Lab, Level Path Explorer, and Logo). Visual snapshot tests must match these.

---

## 1) Project Overview
Build a browser‑based D&D 5e optimizer that includes a character builder, closed‑form DPR simulation (3‑round nova + toggleable advantage/disadvantage), multi‑build comparison, and level‑path optimization. Ship as a static site (GitHub Pages).

**Key Features**
- Character builder with SRD 5.1 content and validation
- DPR Lab (3‑round sim, SS/GWM breakpoints, charts)
- Compare builds (radar of non‑DPR roles + DPR curves + per‑build stats)
- Level Path Explorer with constraints and preview sparklines
- Local persistence (Build Vault), import/export JSON

---

## 2) Tech Stack & Architecture

- **Framework:** React 18 + TypeScript + Vite
- **UI:** Tailwind CSS + shadcn/ui (Radix) — *reskinned to the Spec §9 tokens*
- **Charts:** Recharts
- **Motion:** Framer Motion (reduced when `prefers-reduced-motion`)
- **State:** React Query + Zustand (or Context for light state)
- **Testing:** Vitest + React Testing Library; Playwright for E2E/visual
- **CI/CD:** GitHub Actions → Lighthouse CI + axe + Playwright → GitHub Pages

**Folder Skeleton**
```
/src
  /theme              # tokens.css, noise.png, rune svgs, theme.ts
  /components/ui      # shadcn components themed to tokens
  /components/charts  # chart wrappers with themed defaults
  /modules/builder    # character builder
  /modules/dpr        # DPR lab + engine
  /modules/compare    # compare builds
  /modules/explorer   # level path explorer
  /lib                # utils, math, data
  /data               # SRD data, enums
/tests                # vitest + rtl
/e2e                  # Playwright visual tests
```

---

## 3) Development Phases & Deliverables

### Phase 1 — Foundation & Theme (Weeks 1–2)
**Tasks**
- Initialize React + TS + Vite; set up routing and base pages
- Install Tailwind + shadcn/ui; generate Card, Tabs, Input, Select, Button, Tooltip, Alert
- Implement **Modern‑Fantasy Skin** (Spec §9):
  - Load Inter + Cinzel/Cormorant (Google Fonts)
  - Create `/theme/tokens.css` with the canonical CSS variables (`--bg`, `--panel`, `--ink`, `--accent`, `--gold`, `--emerald`, `--border`, `--danger`, `--radius`, `--shadow`)
  - Global CSS: `body { background: var(--bg); color: var(--ink); }`
  - Utility: `.panel` applies parchment card surface (panel bg + etched border + inner shadow + radius)
  - Assets: add `noise.png` (≤6% opacity overlay) and rune-corner SVGs (used sparingly)
  - Reskin shadcn components to tokens; focus rings use `--accent`
- Scaffold Storybook with themed components (Card, Tabs, Inputs, Chart container)
- Set up ESLint/Prettier/Vitest; configure GitHub Actions + Pages

**Deliverables**
- Themed component library in Storybook
- Fonts, tokens, assets committed under `/src/theme`
- CI running lint, unit tests, **Lighthouse CI**, and **axe**

**Acceptance**
- Token existence test passes; AA contrast of `--ink` on `--panel`
- Storybook pages show parchment panels with serif headings and arcane‑blue focus

---

### Phase 2 — DPR Engine (Weeks 3–4)
- Implement closed‑form DPR engine (attack‑roll only, 3‑round sim); unit tests for math cases
- Export SS/GWM breakpoint helpers
- Provide typed API consumed by DPR Lab

**Acceptance**
- Deterministic snapshot tests for standard builds
- Performance budget: DPR eval for 100 AC samples < 50ms on mid‑tier laptop

---

### Phase 3 — Character Builder (Weeks 5–6)
- Identity, Ability Scores (point‑buy + manual), Class & Levels, Feats, Gear, Notes
- Ability score **cards** use rune corners + etched borders; timeline uses circular milestone badges
- Validation banner uses parchment with `--gold` warnings and `--danger` errors

**Acceptance**
- Axe: zero criticals; required labels/tooltips present
- Playwright visual snapshot matches `./concept/Character builder concept.jpeg` (±2% threshold)

---

### Phase 4 — DPR Lab (Week 7)
- Left configuration panel on parchment; right Recharts line chart
- Three curves (Normal/Advantage/Disadvantage), `strokeWidth=3`, dots at AC ticks, faint gridlines; minimal legend
- SS/GWM table as **dark slate sub‑card** per Spec §9

**Acceptance**
- Visual snapshot ~ `./concept/DPR Lab concept.jpeg`
- `prefers-reduced-motion`: transitions/glow disabled

---

### Phase 5 — Compare Builds & Non‑DPR Roles (Weeks 8–9)
- Radar chart (non‑DPR roles) with ~35% fill + thin stroke on parchment
- DPR comparison chart; per‑build SS/GWM stats in dark sub‑cards; 8px spacing grid

**Acceptance**
- Visual snapshot ~ `./concept/Build compare concept.jpeg`
- Snapshot suites for 1, 2, and 3 builds

---

### Phase 6 — Level Path Explorer (Weeks 10–11)
- Candidate class filters; 3–4 parchment tiles with DPR progression **sparklines**
- Milestone badges consistent with Builder

**Acceptance**
- Visual snapshot ~ `./concept/Level path explorer concept.jpeg`

---

### Phase 7 — Settings & Export (Week 12)
- App settings (units, defaults); JSON import/export for builds
- Add **hidden Theme toggle scaffold** (off by default) to future‑proof a plain modern theme without modifying the Ledger skin now

---

## 4) Testing Strategy

**Unit (Vitest)**
- DPR math, breakpoint logic, parsing/validation
- Token presence + contrast test (`--ink` vs `--panel`)

**Component (RTL)**
- Form controls, tabs, timeline interactions

**E2E & Visual (Playwright)**
- Smoke flows for all four primary screens
- Visual snapshots matched to files in `./concept/`

**Accessibility**
- axe in CI (zero criticals); keyboard traversal tests; visible `:focus-visible`

---

## 5) CI/CD

**Pipeline (GitHub Actions)**
1. Install & build
2. Lint + unit tests
3. axe + Lighthouse CI (desktop: Perf ≥ 90, A11y ≥ 95)
4. Playwright E2E + visual snapshots
5. Deploy to GitHub Pages on `main`

**Artifacts**
- Store Playwright screenshots and Lighthouse reports for each run

---

## 6) Performance & Quality Budgets

- DPR calculation per profile: < 50ms for 100 AC samples
- First load (cold): < 250KB gzipped JS per route (code‑split charts)
- Interaction delay: < 100ms for toggles/inputs
- Fonts: 2 families (serif + Inter) with `display=swap`

---

## 7) Definition of Done (UI Screens)

A screen is **Done** when:
- Uses **Spec §9 tokens** (no ad‑hoc colors) and serif headings (H1–H2)
- Passes Lighthouse budgets and axe (zero criticals)
- Visual snapshot diff ≤ 2% against `./concept/` image
- `prefers-reduced-motion` respected; AA contrast maintained
- Keyboard navigation covers all interactive controls

---

## 8) Milestones

- **W2:** Foundation & theme complete; Storybook published
- **W4:** DPR engine integrated; lab scaffolded
- **W6:** Character Builder functional
- **W9:** Compare Builds complete
- **W11:** Level Path Explorer complete
- **W12:** Production launch

---

## 9) Risks & Mitigations

- **Theme drift due to defaults.** → Enforced tokens + visual snapshots + DoD
- **Chart readability on parchment.** → Tokenized colors + thicker strokes (3px) + contrast tests
- **Accessibility regressions.** → axe in CI + explicit labels and focus management

---

*End of plan.*
