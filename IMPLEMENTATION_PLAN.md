# OpenDoor — Comprehensive Implementation Plan
## Qloo Agentic Hackathon 2026 | Windows 10 PowerShell | Strict $0 Budget

**Author:** Senior Software Engineer & Project Architect  
**Master Specification:** [`OPENDOOR_MASTER_SPEC.md`](./OPENDOOR_MASTER_SPEC.md)  
**Agent Operating Rules:** [`AGENTS.md`](./AGENTS.md)  
**Current Date:** October 30, 2026  
**Hard Submission Deadline:** October 30, 2026 at 11:45 PM EDT (**October 31, 2026 at 08:45 AM Pakistan Standard Time**)  

---

## 1. Verified Hackathon Requirements & Official API Findings

### 1.1 Hackathon Deliverables (Devpost)
1. **Functional Demo URL:** Live web application accessible to judges ($0 free hosting, no card required).
2. **Public Code Repository:** GitHub repository with open-source license (MIT) and clear documentation.
3. **Demonstration Video:** 60–90 second walkthrough video demonstrating real cultural queries and accessibility verification.
4. **Written Description:** English summary covering problem statement, architecture, Qloo workflow integration, and responsible data caveats.

### 1.2 Verified Qloo API Technical Findings
- **Base URL:** `https://hackathon.api.qloo.com` (Staging/Production: `https://api.qloo.com`)
- **Authentication:** Header `X-Api-Key: <key>`
- **No Accessibility Tags in Qloo:** Official OpenAPI schemas and documentation confirm that Qloo possesses cultural affinity and categorization data, but **no physical accessibility tags** (e.g., wheelchair ramps, step-free access).
- **Core Insights Endpoint:**
  - `GET /v2/insights`
  - Parameters:
    - `filter.type=urn:entity:place`: Limits recommendations to places/venues.
    - `signal.location.query=<city>`: Restricts geographic context (e.g. `London`, `New York`).
    - `signal.interests.entities=<comma-separated-entity-ids>`: Seed cultural entities (films, books, artists, games).
    - `feature.explainability=true`: Crucial parameter providing contribution scores and explanation for why venues matched.
    - `take=20`: Number of results.
- **Entity Search Endpoint:**
  - `GET /search?query=<text>&types=<category>&take=5` (Resolves user interest text into validated Qloo entity IDs).

---

## 2. Architecture & Project Structure

OpenDoor uses a clean, transparent Next.js App Router architecture with a deterministic TypeScript agent pipeline. No heavy paid LLMs or multi-agent orchestration bloat.

```
OpenDoor/
├── .env.example                     # Safe placeholder configuration
├── .gitignore                       # Ignores .env.local, node_modules, .next
├── LICENSE                          # MIT License
├── README.md                        # Setup, architecture, Qloo integration & demo
├── AGENTS.md                        # Persistent rules for agents and contributors
├── OPENDOOR_MASTER_SPEC.md          # Immutable master project specification
├── IMPLEMENTATION_PLAN.md           # This implementation plan
├── package.json                     # Next.js, React, Tailwind, Lucide, Vitest
├── tsconfig.json                    # Strict TypeScript configuration
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Accessible styling and high contrast tokens
├── vitest.config.ts                 # Vitest test runner configuration
├── data/
│   ├── evidence/
│   │   └── venues.london.json       # Factual, verified accessibility records with source URLs & dates
│   └── fixtures/
│       └── qloo.preview.json        # Clearly labeled offline fixtures when QLOO_API_KEY is unset
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── search/
│   │   │   │   └── route.ts         # Server-side agent orchestration endpoint
│   │   │   └── health/
│   │   │       └── route.ts         # Service and Qloo connection healthcheck
│   │   ├── layout.tsx               # Accessible root layout with skip-links
│   │   ├── page.tsx                 # Main discovery interface
│   │   └── globals.css              # Accessible color scheme & reduced-motion rules
│   ├── components/
│   │   ├── DiscoveryForm.tsx        # City, cultural interests & mobility selection
│   │   ├── VenueCard.tsx            # Dual badge card: Cultural Reason vs Accessibility Status
│   │   ├── AgentTraceDrawer.tsx     # Transparent agent reasoning & stage execution log
│   │   ├── MissingKeyBanner.tsx     # Transparent indicator when running in offline preview mode
│   │   └── EvidenceModal.tsx        # Provenance viewer showing exact checked URL and date
│   └── lib/
│       ├── types.ts                 # Strongly-typed schemas (Qloo, Evidence, AgentTrace)
│       ├── agent/
│       │   ├── pipeline.ts          # Main orchestrator running stages 1 to 7
│       │   ├── validator.ts         # Stage 1: Input sanitization & boundary checking
│       │   ├── resolver.ts          # Stage 2: Resolve cultural interests to Qloo entities
│       │   ├── qlooConnector.ts     # Stage 3: Server-side API client with timeout/retry
│       │   ├── normalizer.ts        # Stage 4: Map raw Qloo response to venue models
│       │   ├── evidenceMatcher.ts   # Stage 5: Conservative venue linking to verified claims
│       │   └── transparentRanker.ts # Stage 6: Explainable ranking & dual-signal synthesis
│       └── evidenceStore.ts         # Local evidence lookup engine
└── tests/
    ├── validator.test.ts            # Input validation tests
    ├── evidenceMatcher.test.ts      # Conservative matching tests
    ├── transparentRanker.test.ts    # Explainable ranking logic tests
    ├── security.test.ts             # Secret isolation & key leak prevention tests
    └── pipeline.test.ts             # End-to-end agent workflow integration tests
```

---

## 3. Implementation Phases & Exact Windows 10 PowerShell Commands

### Phase 1: Environment & Project Scaffolding
- Initialize Git repository.
- Create Next.js project with TypeScript, Tailwind CSS, App Router.
- Install necessary production dependencies (`lucide-react` for accessible icons) and dev dependencies (`vitest`, `@testing-library/react`).
- Ensure `.gitignore` explicitly blocks `.env.local` and all secret files.

**Exact PowerShell Commands:**
```powershell
cd "g:\QLOO Hackathon\OpenDoor"
git init
npm init -y
npm install next react react-dom lucide-react
npm install --save-dev typescript @types/node @types/react @types/react-dom tailwindcss postcss autoprefixer vitest
```

### Phase 2: Typed Data Models & Grounded Evidence Dataset
- Define TypeScript interfaces in `src/lib/types.ts`:
  - `AccessibilityClaim` (`feature`, `status`, `statement`, `sourceName`, `sourceUrl`, `checkedAt`, `notes`).
  - `VenueEvidence` (`venueId`, `venueName`, `address`, `city`, `officialWebsiteUrl`, `claims`).
  - `QlooPlaceEntity` (`id`, `name`, `address`, `description`, `imageUrl`, `affinityScore`, `reasons`).
  - `DiscoveryResult` (Combined place card with separated cultural reason and accessibility status).
  - `AgentTrace` (Step-by-step audit trail for transparency).
- Construct `data/evidence/venues.london.json` containing 8-12 thoroughly verified real cultural venues in London (e.g. British Museum, Tate Modern, Barbican Centre, Royal Opera House, Southbank Centre) with real, checked URLs (e.g. AccessAble or official museum accessibility pages) and the date checked (`2026-10-30`).

### Phase 3: Deterministic Agent Pipeline & Qloo Connector
- Create `src/lib/agent/qlooConnector.ts`:
  - Strict server-side execution.
  - Queries `https://hackathon.api.qloo.com/v2/insights`.
  - Sends `X-Api-Key` header from `process.env.QLOO_API_KEY`.
  - Sets `feature.explainability=true` to capture real matching rationales.
  - Gracefully detects missing API key and falls back to labeled offline preview fixtures without crashing.
- Implement `src/lib/agent/pipeline.ts` executing the 7 transparent stages and generating the full execution trace.

### Phase 4: Accessible, Trustworthy UI & Workflow Inspector
- WCAG AA compliant contrast, large touch targets, visible focus rings, ARIA labels.
- Dual-badge presentation:
  - **Cultural Affinity (Qloo):** What cultural signals matched the user's input.
  - **Physical Accessibility (OpenDoor Evidence):** Verified, Partially Verified, Unknown, or Conflicting, with direct link to source and date checked.
- Expandable "How OpenDoor Decided" workflow trace drawer so judges can see the transparent agent pipeline in action.
- "Configure Qloo API Key" modal with clear, non-technical instructions for setting `QLOO_API_KEY` in `.env.local` or Vercel environment variables.

### Phase 5: Verification, Automated Testing & Build Validation
- Unit tests for input validation, secret leakage prevention, evidence assessment, and conservative matching.
- Integration tests simulating missing key, valid key, API errors (429, 500, timeout).
- Production build validation (`npm run build`).

**Exact PowerShell Commands:**
```powershell
npm run test
npm run build
```

### Phase 6: Free Deployment ($0 Budget) & Submission Kit
- Deploy to Vercel Hobby ($0, no credit card required, native Next.js server support).
- Create `.env.example` and MIT `LICENSE`.
- Write thorough, beginner-friendly `README.md` with quickstart instructions, architecture diagram, security disclosures, and Devpost submission pitch.
- Prepare demo walkthrough script and verification checklist.

---

## 4. Testing Strategy

1. **Secret Isolation Test:** Verifies that no API key or sensitive token is ever returned in client payloads, API responses, or serialized HTML.
2. **Conservative Matching Test:** Ensures an unknown venue is never accidentally linked to an accessibility claim without exact/close address or canonical name match.
3. **Accessibility Integrity Test:** Tests that when evidence is missing, status is strictly `unknown` with text *"Not verified — contact the venue before visiting."* Never infers accessibility from Qloo scores.
4. **Resilience & Fallback Test:** Verifies that if `QLOO_API_KEY` is not present, the app serves preview fixtures with a prominent warning badge and does not crash or fake a live API connection.

---

## 5. Free Deployment Strategy ($0 Budget)

- **Platform:** **Vercel Hobby Tier**
  - Cost: Free forever ($0), no credit card required for standard hobby accounts.
  - Runtime: Natively supports Next.js App Router and serverless route handlers (`/api/search`).
  - Environment Variables: Secure server-side injection of `QLOO_API_KEY`.
- **Alternative:** **Netlify Free Tier** (supported fallback if Vercel is unavailable).

---

## 6. Current Blockers & Next Immediate Action

- **Current Blocker:** `QLOO_API_KEY` is not yet available in the environment.
  - **Mitigation:** The application is architected with a verified live connector and an authentic offline preview mode. When the key is acquired, adding `QLOO_API_KEY=...` to `.env.local` immediately activates live queries with zero code changes.
- **Single Most Important Next Action:** Initialize Git repository and scaffold the Next.js TypeScript project.
