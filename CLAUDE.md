# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

DocMan is a single-user PWA: upload a document (.pdf/.docx/.md/.txt) or photo → Gemini analyzes it → the original and the analysis are saved to the user's Google Drive `DocMan/` folder → a dashboard lists, searches, and graphs saved items.

Planning is finished and development follows `docs/ROADMAP.md` phase by phase. The source docs are, in order: `docs/DocMan-draft.md` (original request) → `docs/Plan.md` → `docs/PRD.md` → `docs/ROADMAP.md` → `docs/Prepare.md`. **The PRD is the spec.** Feature IDs (F001–F016), page IDs (P01–P05), and modal IDs (M01 summary box, M02 search result box) come from the PRD. Use them in code comments, commits, and discussion, and keep the PRD's feature spec, menu structure, and page details consistent with each other when anything changes.

Write docs and user-facing text in Korean.

## Commands

Planned Vite + React + TypeScript setup, created in Roadmap Phase 1. Update this section once `package.json` exists.

- `npm run dev`: dev server at http://localhost:5173. This origin is registered in Google OAuth, so don't change the port.
- `npm run build`: type check + production build
- `npx vitest run`: all unit tests. For one file: `npx vitest run src/utils/search.test.ts`; for one test by name: `npx vitest run -t "<name>"`

## Architecture

There is no backend. The browser talks directly to three Google services:
- Google Identity Services: OAuth token with `drive.file` scope only, so the app sees only the files it created itself
- Google Drive API: acts as the database
- Gemini API: analysis. The API key is entered by the user on the Settings page (P05) and stored only in localStorage. It never goes in code or env files.

The OAuth client ID is public and comes from `.env.local`, which is not committed.

Structure-first rule from the Roadmap:
- Each service in `src/services/` (auth, drive, gemini) is defined as a TypeScript interface.
- A `Mock*` implementation backs Phases 2–3, and the real implementation replaces it in Phase 4.
- UI code in `src/features/` and `src/components/` must depend only on the interfaces, never call Google/Gemini APIs directly.
- Don't mix phases: don't wire real APIs before the dummy UI (Phase 3) is complete.

Extensibility: per-format text extractors live in `src/extractors/`, and per-category analysis prompts are separate modules. New formats like HWP (explicitly out of MVP scope) are added as a new extractor.

### Drive data model

`index.json` is the source of truth for the dashboard, search, and graph. Only `index.json` is read at runtime; the MD files are human-readable outputs.

```
DocMan/
├─ index.json            # counts, topics {topic: n}, items[] (newest first)
├─ Documents/{originals/, summaries/, Documents.md}
└─ Photos/{originals/, summaries/, Photos.md}
```

- **Counts are incremented on each save, never recomputed** (explicit requirement). The category "topic count" is the number of keys in `topics[category]`.
- A save (F009) has four steps, in this order:
  1. Upload the original file.
  2. Write the per-item MD to `summaries/`.
  3. Insert a row directly under the header of the cumulative table MD, so the newest row is at the top. Line breaks inside a cell are `<br>`.
  4. Update `index.json`.
- Analysis limits:
  - Documents: ≤5 keywords, ≤10 bullet lines of summary
  - Photos: ≤3 keywords, ≤4 lines
  - Enforce the limits through Gemini JSON output mode plus validation.
- Search: substring match on topic and keywords only. Graph: nodes are topics, edge weight is the number of shared keywords.

## Deployment

The app deploys from GitHub Actions to GitHub Pages at `https://tksong-sogang.github.io/DocMan/`. Vite `base` must be `/DocMan/`.
