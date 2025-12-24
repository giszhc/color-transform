# Copilot instructions for this repo ✅

Short, actionable guide for an AI coding agent to be productive in this repo.

## Quick summary
- This is a small Vite + TypeScript frontend SDK (single-page app). Entry point: `src/main.ts`. Build tooling: `vite` + TypeScript (`tsc` used for type-checking).

## Quick start (commands) 🔧
- Install deps: `pnpm install` (repo contains `pnpm-lock.yaml`, prefer pnpm)
- Dev server: `pnpm run dev` → opens Vite dev server (default http://localhost:5173)
- Build: `pnpm run build` → runs `tsc && vite build` (note: `tsc` is used for type checking; `noEmit: true` so `tsc` won’t output JS)
- Preview production build: `pnpm run preview`

## Important files to check 📁
- `package.json` — scripts and package manager
- `tsconfig.json` — strict typing and bundler module resolution
- `index.html` — app root and script entry
- `src/main.ts`, `src/counter.ts`, `src/style.css` — canonical examples of import and component structure
- New: `src/colors/` contains color utilities (`color.ts`, `palettes.ts`). Key exports: `generateColors`, `randomHex`, `complementaryHex`, `hexToHsl`, `analogousPalette`, `hexToRgbaString`, `rgbStringToHex`.
  Use package entry: `import { generateColors, hexToRgbaString } from '@giszhc/color-transform'`.

## Project-specific conventions & patterns ⚠️
- ESM-only project: `package.json` contains `"type": "module"`. Use ES import/export syntax.
- Project layout: prefer grouping by feature under `src/` (e.g., `src/colors/`, `src/utils/`, `src/examples/`). Keep explicit `.ts` extensions for local imports.
- Library packaging: use Vite library build (`vite.config.ts`) and generate types with `tsc -p tsconfig.build.json`. `build` script runs `pnpm run build:types && vite build`.
- Package fields for publishing: add `files`, `main`, `module`, and `types` in `package.json` and ensure `dist/` contains generated JS + type declarations before publishing.
- Type checking: `pnpm run build` will fail if there are TypeScript errors because `tsc` runs with `strict` and `noEmit: true` in normal tsconfig; we use `tsconfig.build.json` to emit declaration files.
- Assets are imported directly (Vite handles assets): `import './style.css'`, `import typescriptLogo from './typescript.svg'`.
- Tests & CI: I recommend adding `vitest` and a simple GH Actions workflow to run `pnpm run build` and `pnpm test` on PRs; this repo currently does not include CI.

## Guidance for automated code changes 🤖
- Preserve explicit `.ts` extensions when adding or moving modules.
- Keep ESM import style and avoid CJS patterns.
- When proposing changes, ensure `pnpm run build` completes without `tsc` errors.
- For runtime behavior, validate with the dev server (`pnpm run dev`) and the browser console (Vite logs live reloads and runtime errors).
- When adding new dependencies, update `package.json` and run `pnpm install` to update `pnpm-lock.yaml`.

## Examples & references from the repo ✍️
- Import patterns: `src/main.ts` imports CSS and SVGs and references `setupCounter` from `src/counter.ts`.
- Type-checking / build: `package.json` `build` script: `tsc && vite build` (intentionally ensures type-safety before bundling).

## What I did not find / notes ❗
- No `.github` CI workflows, no tests, no lint scripts, and no explicit coding standards file. If you want those added, clarify which tools you prefer (ESLint, vitest, GH Actions, etc.).

---
If any section is unclear or you'd like more detail (examples for PR messages, suggested CI config, or tests), tell me which parts to expand and I will iterate. Thank you! 🙌