# OpenDoor — Agent & Developer Operating Guidelines

**Reference Document:** [`OPENDOOR_MASTER_SPEC.md`](./OPENDOOR_MASTER_SPEC.md) is the immutable master specification and single source of truth for all requirements, architecture, rules, and compliance criteria.

---

## 1. Core Mission & Critical Distinction
- **What OpenDoor is:** An accessibility-aware cultural discovery agent helping users discover cultural places (dining, arts, cinema, literature) matching their tastes, with transparent, independently verified physical accessibility evidence.
- **The Golden Rule:** **Qloo cultural affinity is NOT evidence of wheelchair accessibility.**
  - Never infer wheelchair accessibility or step-free access from venue popularity, photos, ratings, or similarity scores.
  - Qloo does not have accessibility tags. Accessibility claims must come strictly from our local verified evidence database with real source URLs and actual check dates.

---

## 2. Security & Secrets Management
- **Never expose or commit API keys:** `QLOO_API_KEY` must never appear in client bundles, browser network calls, logs, screenshots, Git commits, or documentation.
- Keep all Qloo calls strictly in server-side Next.js route handlers (`app/api/...`).
- Ensure `.env.local` is present in `.gitignore`.
- Provide `.env.example` with sanitized placeholders only (`QLOO_API_KEY=your_key_here`).
- If an API key is missing in the environment, the app must gracefully enter a transparent "Demo / Missing Key" mode with explicit UI labeling; never crash and never pretend mock data came from live Qloo.

---

## 3. Strict Zero Fabrication Policy
- **No fabricated API parameters:** Use only verified official Qloo parameters (`filter.type=urn:entity:place`, `signal.interests.entities`, `signal.location.query`, `feature.explainability=true`).
- **No fabricated accessibility data:** Every venue in the evidence dataset must have:
  - Exact verified name and address.
  - Exact source URL (e.g. official venue accessibility page or recognized accessibility guide like AccessAble).
  - Actual date checked (ISO format `YYYY-MM-DD`).
  - Strict claim status: `verified`, `partially_verified`, `unknown`, or `conflicting`.
  - If a venue has no verified data, status MUST be `unknown` with copy: *"Not verified — contact the venue before visiting."*
- **No fabricated test passes or deployment claims:** Only report commands that were actually executed and results actually observed.

---

## 4. Strict $0 Budget & Minimal Stack
- **Budget:** Strict $0. Reject all card-required services, paid APIs, paid trials, and paid database hosting.
- **Stack:**
  - Next.js (App Router, TypeScript, React, Tailwind CSS).
  - Lightweight deterministic agent pipeline written in native TypeScript (no heavy external LLM framework, no OpenAI/Anthropic paid dependencies).
  - Automated testing with Vitest.
  - Free deployment on Vercel Hobby (card-free, native Next.js support) or Netlify.

---

## 5. Agent Workflow Architecture
Every user request flows through inspectable stages:
1. **Input Validator:** Validates city, cultural interests, and mobility requirement.
2. **Entity Resolver:** Resolves user's free-text interests to verified Qloo entity IDs via `/search`.
3. **Cultural Insights Connector:** Queries Qloo `/v2/insights` with `signal.interests.entities`, `signal.location.query`, and `feature.explainability=true`.
4. **Result Normalizer:** Maps raw Qloo entities to clean internal TypeScript representations.
5. **Accessibility Evidence Assessor:** Conservative fuzzy/exact matcher linking Qloo places to verified local evidence records.
6. **Transparent Ranker:** Ranks based on explicit criteria, separating cultural affinity reasons from accessibility status.
7. **Trace Builder:** Provides an inspectable "How OpenDoor works" workflow trace for judges and users.

---

## 6. Beginner-Friendly Collaboration & Working Loop
- The project owner is learning. Always explain commands in plain English before running them.
- Provide exact Windows 10 PowerShell commands.
- Use small, incremental, verifiable steps. Run tests and typechecks after every increment.
- Never delete working user code or regenerate files blindly.
