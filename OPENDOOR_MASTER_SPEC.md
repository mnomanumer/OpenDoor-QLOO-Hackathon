# OPENDOOR — MASTER PROJECT SPECIFICATION
## Qloo Agentic Hackathon 2026 | Windows 10 | Strict $0 budget

**Purpose:** This document is the source of truth for planning, implementing, testing, deploying, and submitting OpenDoor. Read it before changing files. Keep it updated as real implementation decisions are made.

**Owner skill level:** Beginner. Explain commands and decisions in plain English. Do not assume knowledge of terminals, APIs, environment variables, Git, or deployment.

**Deadline warning:** The official Devpost rules list the submission deadline as **October 30, 2026 at 11:45 PM EDT**, which is **October 31, 2026 at 8:45 AM Pakistan Standard Time (PKT)**. Verify the live Devpost page immediately before relying on this. Current date is October 30, 2026 in Pakistan. The deadline is extremely close.

---

## 1. Product summary

OpenDoor is an accessibility-aware cultural discovery agent. It helps people discover places that may match their cultural interests while clearly distinguishing cultural relevance from independently verified physical accessibility.

Core user questions:
1. What places might be relevant to my chosen interests in a selected city?
2. What reliable evidence exists for wheelchair access and step-free entry at each place?

**Critical distinction:** Qloo cultural affinity/recommendations are not evidence of wheelchair accessibility. Never infer accessibility from a venue photo, popularity, a Qloo score, or similarity to another venue.

Target users include wheelchair users, people with mobility needs, caregivers, and people planning accessible cultural outings.

## 2. Hackathon compliance and official sources

Check these sources directly and prefer current official documentation over assumptions:
- Hackathon: https://qloo.devpost.com/
- Rules: https://qloo.devpost.com/rules
- Developer guide: https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide
- Qloo API docs: https://docs.qloo.com/
- Public docs/examples: https://github.com/qloo/docs-public
- Official hackathon kit: https://github.com/qloo/qloo-hackathon-kit
- Submission guidance: https://github.com/qloo/qloo-hackathon-kit/blob/main/docs/SUBMISSION.md
- Community: https://discord.gg/rF9PKsD5Q7

The official rules require a working application integrating Qloo that either functions as an agentic tool, uses an agent framework, or integrates Qloo into an existing agent. Submission requires a functional demo URL, public source repository, open-source licence, and English project description. Re-check all requirements before submitting.

Qloo API access is obtained separately through the request process in the developer guide. Approval is not guaranteed. Do not block all work while waiting for the key.

## 3. Non-negotiable constraints

- Strict $0 budget. No paid API credits, subscriptions, paid trials, card-required services, paid hosting, paid maps APIs, or paid AI services.
- Prefer the simplest stack that can be completed, tested, and deployed before the deadline.
- Never commit or expose the real Qloo key.
- Do not request the user to paste the key into chat, source code, screenshots, or public files.
- Keep all Qloo calls server-side.
- Add `.env.local` to `.gitignore`; create `.env.example` with placeholders only.
- Do not invent API endpoints, query parameters, response fields, Qloo data, venues, source URLs, accessibility claims, or test results.
- Never describe fixtures or mock results as live Qloo results.
- No user accounts required.
- Do not persist disability-related information or user interests unnecessarily.
- Do not claim a deployment, build, test, API call, or submission succeeded unless observed.

## 4. Preferred stack

Inspect the existing machine and project before installing tools. Use the simplest stack compatible with the current environment and free deployment options.

Preferred:
- Next.js App Router, TypeScript, React, Tailwind CSS.
- Next.js server route handlers for Qloo requests.
- A transparent, deterministic workflow implemented in ordinary TypeScript. Do not add a complex multi-agent framework or paid LLM.
- A small, local, source-backed accessibility evidence dataset for carefully verified demo venues.
- Git and a public GitHub repository.
- Free deployment only if the current free tier genuinely supports the application and does not require payment/card.

Avoid Docker, Redis, hosted vector databases, paid analytics, paid authentication, unnecessary database infrastructure, and unnecessary dependencies.

If the preferred stack cannot be completed in time, recommend the simplest free alternative and explain why before switching.

## 5. Qloo integration: verify before coding

Use official documentation and the event environment. The hackathon email says the API base URL is:
`https://hackathon.api.qloo.com`

The event email documents a CLI option:
- Install Node.js 22.19 or newer.
- `npm install --global @qloo/qloo-harness`
- Set `QLOO_BASE_URL=https://hackathon.api.qloo.com`
- Set `QLOO_TRUSTED_BASE_URL=https://hackathon.api.qloo.com`
- Run `qloo setup --qloo` and `qloo setup --status`
- Expected status: `Qloo data: ready`
- Test official kit workflow from `https://github.com/qloo/qloo-hackathon-kit`, such as `qloo exec find_tags --input-file request.json`.

Treat the user's supplied event email as useful context, but verify current documentation. Before implementing direct API calls, confirm from official docs:
- Correct base URL.
- Authentication header and key format.
- Exact entity search and recommendation endpoints.
- Supported entity types and location parameters.
- Required and optional query parameters.
- Response shapes and error handling.
- Rate limits/quotas.
- Whether any accessibility tags/filters actually exist.

Do not assume endpoint or header details from memory. Do not invent a wheelchair filter. If direct API calls are appropriate, use only verified official details. Keep key in `QLOO_API_KEY` on the server. If the official hackathon kit/CLI is a better fit for a required agentic workflow, inspect its supported workflows and use them without relying on unsupported harness chat/plan/build modes.

When key is missing:
- Build the UI, validation, workflow interfaces, evidence matching, test suite, documentation, and deployment setup.
- Provide clearly labelled development fixtures solely for UI/testing.
- In the UI and README, disclose that live discovery requires configuring a valid Qloo key.
- Never submit a mock-only build as if it has genuine Qloo recommendations.
- Design the live integration so it can be enabled without rewriting the app once the key arrives.

## 6. MVP user journey

1. User opens the app without logging in.
2. User selects a city (initially use the city that can be supported by real Qloo results and verifiable venue evidence; Karachi may be considered but must not be assumed to work).
3. User enters/selects cultural interests such as films, artists, books, or games.
4. User chooses the mobility requirement: wheelchair access and/or step-free entry.
5. App validates the request and resolves interest names to Qloo entities using documented supported functionality.
6. App calls a documented Qloo recommendation/search workflow using actual user inputs.
7. App maps returned Qloo entities to place/venue records only when there is a defensible match. Do not assume every returned entity is a venue.
8. App independently checks locally maintained accessibility evidence for each matched venue.
9. App ranks/presents results using transparent rules, clearly separating cultural relevance from evidence completeness.
10. App explains what is known, unknown, or conflicting and links to evidence.
11. User can change the city, interests, and accessibility requirement and run another search.

## 7. Accessibility evidence model

Represent each factual accessibility claim with traceable provenance. Suggested TypeScript model:

- `venueId`: stable internal identifier.
- `venueName`: verified name.
- `city`: city.
- `officialWebsiteUrl`: optional URL, only when verified.
- `accessibilityClaims`: list of claim records.
- Each claim record:
  - `feature`: `wheelchair_access` or `step_free_entry`.
  - `status`: `verified`, `partially_verified`, `unknown`, or `conflicting`.
  - `statement`: concise claim limited to what the source actually says.
  - `sourceName`: identifiable publisher/venue.
  - `sourceUrl`: exact, checked URL.
  - `sourceType`: e.g. official venue accessibility page or identifiable reliable source.
  - `checkedAt`: actual date the source was checked, ISO `YYYY-MM-DD`.
  - `notes`: optional caveat.

Only use `verified` if a reliable source explicitly confirms the specific feature. `partially_verified` means some relevant evidence exists but does not establish the user's whole requirement. `unknown` means reliable evidence was not found. `conflicting` means sources disagree and human confirmation is needed.

Rules:
- Never invent records, URLs, dates, or claims.
- A source date is the date the developer actually checked it, not a guessed date.
- If no real evidence can be verified, show an empty/unknown state instead of filling the dataset with fabricated venues.
- Show the source link and last-checked date on the card.
- Default unknown copy: **“Not verified — contact the venue before visiting.”**
- State clearly that conditions may change and users should confirm critical access requirements directly with the venue.
- Do not use photographs as proof of access.
- Do not scrape aggressively or violate site terms.

## 8. Transparent agentic workflow

Implement a real, inspectable workflow, with no fake claims of autonomous reasoning:

1. **Request interpreter/validator:** validate city, interests, and mobility requirement; normalize input; reject malformed/oversized inputs.
2. **Action selector:** choose a documented Qloo entity lookup or recommendation action appropriate to available inputs.
3. **Qloo connector:** perform the real server-side API/official tool call, validate responses, handle timeout/rate-limit/auth/server errors.
4. **Result normalizer:** convert supported response fields into an internal typed structure; unknown fields must not be guessed.
5. **Venue matcher:** match to evidence records only with a documented, conservative matching method; ambiguous matches must be excluded or flagged.
6. **Evidence assessor:** evaluate each requested feature using source-backed evidence and produce verified/partially verified/unknown/conflicting status.
7. **Transparent ranker:** use explainable rules. Do not fabricate a numeric Qloo affinity score. If Qloo provides a score, show it only when the docs define it and clearly label its meaning. Otherwise explain relevance using actual returned fields/signals.
8. **Response builder:** return results, reasons, source provenance, caveats, and status.
9. **UI:** clearly separate cultural match from accessibility evidence.

Add a small “How OpenDoor works” panel or expandable workflow trace showing stages completed, Qloo request type (not secrets), results count, evidence matches, and limitations. Never display API keys or unnecessary personal data in logs.

## 9. Interface and accessibility requirements

Create a polished, calm, trustworthy, mobile-first interface with clear typography, sufficient contrast, visible focus states, semantic HTML, keyboard navigation, labels, accessible error messages, and reduced-motion respect. Avoid clutter and unsupported claims.

Essential screens/states:
- Landing/search page.
- City and interest inputs.
- Wheelchair/step-free selection.
- Loading/progress state with meaningful stage descriptions.
- Result cards.
- Empty result state.
- Missing API key state.
- API error/rate limit state.
- Unknown accessibility evidence state.
- Conflicting evidence state.
- About/limitations explanation.

Each result card should display:
- Venue name.
- A valid image/identity if legitimately available; otherwise use a designed placeholder, not a fabricated photo.
- Why it matched, based on real Qloo output.
- Separate accessibility status for each requested feature.
- Exact source link and date checked when evidence exists.
- Official venue website when verified.
- Clear limitation copy.

Do not use decorative colour alone to convey status. Ensure readable status text and icon/label pairing.

## 10. Security and privacy

- `.env.local` must be ignored by Git.
- `.env.example` contains placeholder values only, e.g. `QLOO_API_KEY=replace_me_locally`.
- API key must be read server-side only; never use a `NEXT_PUBLIC_` prefix for the key.
- Do not print request headers, API keys, or complete secret-bearing environment objects.
- Do not put the key into client components, browser requests, HTML, screenshots, test fixtures, README, logs, or Devpost.
- Validate and bound user input.
- Add reasonable request timeouts and error handling.
- No user accounts or persistence of disability-related information.
- Do not store raw requests longer than necessary.
- Never commit secrets. If a key is exposed, instruct the user to rotate/revoke it.

## 11. Testing requirements

Create useful automated tests for:
- Input validation.
- Accessibility status evaluation.
- Missing evidence -> unknown, never verified.
- Conflicting evidence -> conflicting.
- No source URL/date -> cannot claim verified.
- Conservative venue matching.
- Transparent ranking.
- Missing API key.
- Qloo authentication errors, rate limits, malformed responses, timeouts, empty results.
- Key secrecy in client output/logging.
- UI loading, empty, error, and accessibility states.

Run lint, typecheck, tests, and production build if the package scripts support them. Fix real failures. Record the exact commands and observed results in the README. Do not claim a test passed without running it.

## 12. Free deployment and GitHub

Verify current free-tier restrictions before selecting a host. Never assume a service is free or does not require a card. Prefer a service that supports Next.js server route handlers and environment variables on its free tier. If no suitable no-card free host can be verified, state the blocker and provide the best legitimate free alternative; do not create a paid resource.

Before publishing:
- Check `.gitignore`.
- Scan for secrets.
- Ensure `.env.local` is not tracked.
- Create `.env.example`.
- Include an MIT `LICENSE` unless a specific dependency or user requirement makes another compatible licence more appropriate.
- Write complete README with setup, architecture, env vars, tests, Qloo integration, deployment, evidence methodology, limitations, and screenshots/demo flow.
- Create a public repository only with the user's explicit authorization.
- Do not claim repository or deployment is public until the actual URL is opened and verified.

## 13. Submission deliverables

Prepare:
1. Working application with genuine Qloo integration, if key access is available.
2. Public source repository with open-source licence.
3. Functional public demo URL.
4. README and reproducible setup instructions.
5. English Devpost title and description.
6. Problem/solution/architecture explanation.
7. Redacted request-to-result explanation showing which Qloo entity/tag choices affected results.
8. Demo script of about 60–90 seconds.
9. Screenshots/video with no secrets or personal data.
10. Known limitations and exact test status.
11. Final compliance checklist mapped to the live official rules.

Do not say a mock-only implementation has live Qloo integration. If the key is still unavailable at submission time, be truthful about that limitation and understand it may fail the required working-integration criterion.

## 14. Working method for the coding agent

Work autonomously inside the project folder, but do not take dangerous external actions without asking. Before editing, inspect existing files and preserve user work.

Follow this loop:
1. Inspect repository, installed tools, and current state.
2. Produce a concise task plan with risks and fastest viable path.
3. Implement the smallest complete vertical slice.
4. Run checks and inspect failures.
5. Fix failures before expanding scope.
6. Keep this specification and README synchronized with reality.
7. Provide the beginner with exact PowerShell commands and explain what they do.
8. Ask for help only when blocked by a decision or credential that cannot be inferred safely.
9. Never stop after writing a plan; continue implementing and verifying.
10. Do not repeatedly regenerate the entire project. Make focused changes.

If an API key is unavailable, continue all independent work. Do not ask the user to paste the key into chat. Tell the user how to enter it locally in `.env.local` or the host's secret settings.

## 15. Priority order under the deadline

P0:
- Confirm Devpost registration and deadline.
- Check/request Qloo key.
- Create app shell and search form.
- Implement verified server-side Qloo connector.
- Implement genuine end-to-end search workflow.
- Implement honest accessibility evidence status.
- Test, build, and deploy if possible.
- Prepare and submit required Devpost fields before deadline.

P1:
- Evidence source links and checked dates.
- Responsive/keyboard-accessible design.
- Error/empty states.
- README, licence, public repo.
- Demo script and screenshots.

P2 only if everything above works:
- Visual polish and optional enhancements.

Do not spend deadline-critical time on decorative features, unnecessary frameworks, or infrastructure.

## 16. Definition of done

A task is done only when:
- The code exists in the workspace.
- Relevant checks were actually run and their outcomes recorded.
- The app handles expected failures honestly.
- Qloo-derived data is distinguishable from local evidence.
- Accessibility claims are source-backed.
- No key or secret is exposed.
- The app can be reproduced from README instructions.
- The deployment/repository URLs have actually been verified, if published.
- Submission checklist reflects the live official rules and actual implementation.

**North-star rule:** Build a small, honest, useful product. Never trade factual accessibility information or genuine Qloo integration for a more impressive-looking mockup.
