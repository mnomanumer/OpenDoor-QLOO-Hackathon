# OpenDoor 🚪

**Accessibility-Aware Cultural Discovery Agent**  
*Built for the Qloo Agentic Hackathon 2026 | Strict $0 Budget | Windows 10 PowerShell*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Tests: Vitest](https://img.shields.io/badge/Tests-13%20Passed-emerald.svg)](./tests)
[![Build: Next.js 15](https://img.shields.io/badge/Build-Passing-black.svg)](./package.json)
[![Hosting: $0 Free Tier](https://img.shields.io/badge/Hosting-Vercel%20Hobby%20($0)-green.svg)](#free-deployment-strategy-0-budget)

---

## 1. Problem Statement & The Critical Distinction

Cultural discovery algorithms often recommend exciting museums, historic cinemas, or avant-garde venues based on user taste profiles. However, for wheelchair users, people with mobility impairments, and caregivers, a cultural recommendation without physical accessibility verification is a high-risk gamble.

### The Golden Rule of OpenDoor:
> **Qloo cultural affinity recommendations are NOT evidence of wheelchair accessibility.**  
> Never infer accessibility from venue popularity, photos, reviews, or cultural similarity scores.

OpenDoor solves this by creating a **dual-engine discovery agent**:
1. **Taste Intelligence Engine (Qloo API):** Discovers places and cultural events grounded in user interests (directors, literature, art movements).
2. **Independent Physical Evidence Engine (OpenDoor):** Audits physical accessibility claims against verified venue accessibility guides with exact URLs and actual check dates.

---

## 2. Transparent 7-Stage Agent Architecture

OpenDoor rejects opaque multi-agent blackboxes and paid LLM orchestration wrappers. It implements an inspectable, deterministic 7-stage pipeline written in native TypeScript:

```
[ User Input: City + Cultural Interests + Mobility Filter ]
                           │
                           ▼
  1. Request Validator (Sanitization, input bounds)
                           │
                           ▼
  2. Interest Resolver (Matches interests to Qloo entities)
                           │
                           ▼
  3. Qloo Connector (Server-side /v2/insights with explainability=true)
                           │
                           ▼
  4. Place Normalizer (Maps Qloo entities & extracts taste reasons)
                           │
                           ▼
  5. Evidence Matcher (Conservative linking to local access audits)
                           │
                           ▼
  6. Transparent Ranker (Verified venues first, then Qloo taste score)
                           │
                           ▼
  7. Audit Trace Generator (Outputs inspectable reasoning trace for judges)
                           │
                           ▼
[ Dual-Badge Venue Cards + Real Source Provenance + Agent Trace Drawer ]
```

---

## 3. Verified Qloo API Integration

- **Base URL:** `https://hackathon.api.qloo.com` (Fallback: `https://api.qloo.com`)
- **Authentication:** `X-Api-Key: <key>` header on server-side requests only.
- **Key Secrecy:** `QLOO_API_KEY` is never exposed in browser requests, bundles, or logs.
- **Endpoints Used:**
  - `GET /v2/insights`:
    - `filter.type=urn:entity:place`
    - `signal.location.query=<city>`
    - `signal.interests.entities=<comma-separated-ids>`
    - `feature.explainability=true` (captures exact contribution scores)
    - `take=20`
  - `GET /search`:
    - `query=<interest_text>&take=1` (resolves free-text interests to entity IDs)

### Offline Preview Mode vs. Live Qloo Mode
If `QLOO_API_KEY` is not present in `.env.local`, OpenDoor enters a transparent **Offline Preview Mode**:
- Uses authentic preview fixtures.
- Clearly displays a prominent **"Running in Offline Preview Mode"** banner.
- Never pretends fixture data is live Qloo data.
- When an API key is added, OpenDoor immediately switches to live queries with zero code changes.

---

## 4. Quickstart Guide (Windows 10 PowerShell)

### Prerequisites
- Node.js 22.19.0 or newer (tested on Node v24.20.0, npm 11.19.0)
- Git for Windows

### Setup Commands
```powershell
# 1. Clone repository
git clone https://github.com/your-username/opendoor.git
cd opendoor

# 2. Install dependencies
npm install

# 3. Configure environment (Optional for live API, offline mode works out of the box)
copy .env.example .env.local
# Edit .env.local and add your QLOO_API_KEY

# 4. Run automated test suite
npm run test

# 5. Build production bundle
npm run build

# 6. Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Automated Testing Strategy

OpenDoor includes comprehensive unit and integration tests powered by Vitest:

| Test File | Focus Area | Status |
| :--- | :--- | :--- |
| `tests/validator.test.ts` | Request sanitization, input limits, valid mobility filters | **5 Passed** |
| `tests/evidenceMatcher.test.ts` | Conservative venue matching, alias resolution, unknown rejection | **3 Passed** |
| `tests/transparentRanker.test.ts` | Honest fallback for unverified venues, safety-first ranking | **2 Passed** |
| `tests/security.test.ts` | Secret isolation, ensures no `QLOO_API_KEY` leak in client payloads | **1 Passed** |
| `tests/pipeline.test.ts` | Complete 7-stage end-to-end agent workflow and trace validation | **2 Passed** |
| **Total** | **5 Test Suites** | **13 Passed (100%)** |

Run tests anytime with:
```powershell
npm run test
```

---

## 6. Accessibility Evidence Methodology & Grounded Dataset

Physical access claims in OpenDoor follow strict provenance rules:
- **Verified Status:** Only applied when an official venue accessibility guide explicitly confirms step-free access or wheelchair facilities.
- **Partially Verified Status:** Used when some access exists (e.g. ground floor/stalls) but upper tiers are restricted (e.g. Shakespeare's Globe).
- **Unknown Status:** If no official physical access audit is linked, the card displays:  
  *“Not verified — contact the venue before visiting.”*
- **Audit Dates & Links:** Every verified venue links directly to its source URL and records the check date (`2026-10-30`).

Initial verified demo venues (London):
- **The British Museum** (Montague Place step-free entrance, lifts throughout)
- **Tate Modern** (Turbine Hall ramp, full lift access to all levels)
- **Barbican Centre** (Silk Street level entrance, accessible halls & cinemas)
- **Royal Opera House** (Bow Street street-level access, dedicated wheelchair positions)
- **Southbank Centre** (Level entrance, external glass lift)
- **The National Gallery** (Getty Entrance street-level access, lifts to all galleries)
- **BFI Southbank** (Level entrance from Theatre Avenue, step-free access to all NFT screens)
- **Shakespeare's Globe** (Level Yard/foyer access; upper galleries historical stair restriction)

---

## 7. Free Deployment Strategy ($0 Budget)

OpenDoor strictly enforces a $0 budget:
- **Hosting Platform:** **Vercel Hobby Tier**
  - Completely free ($0 forever).
  - No credit card required.
  - Native support for Next.js App Router and serverless route handlers (`/api/search`).
- **Environment Variables:** Set `QLOO_API_KEY` securely in the Vercel Project Settings > Environment Variables.
- **Zero Paid Addons:** No Redis, no external vector databases, no paid LLM tokens.

---

## 8. Responsible Data Handling & Security

- **No User Tracking:** User cultural preferences and mobility queries are processed purely in memory and never persisted.
- **No Accounts Required:** Fully accessible without registration or passwords.
- **WCAG Compliance:** Designed with high-contrast text, visible focus indicators, skip-links, and semantic HTML landmarks.

---

## 9. Submission Checklist (Devpost Qloo Agentic Hackathon 2026)

- [x] Functional web application integrating Qloo cultural intelligence.
- [x] Clear agentic tool architecture (7-stage inspectable pipeline with audit trace).
- [x] Public GitHub repository with open-source license ([MIT](./LICENSE)).
- [x] Complete README with reproducible setup instructions for Windows 10 PowerShell.
- [x] Strict $0 budget adherence (no card-required or paid dependencies).
- [x] Comprehensive automated test suite (13 passing tests).
- [x] Grounded accessibility evidence dataset with verified URLs and dates.
- [x] Security guarantees (strict server-side key management).

---

## 10. License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
