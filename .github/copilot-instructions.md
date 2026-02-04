# Copilot Instructions for AI Agents

## Project Overview
- **Stack:** Vite + React + TypeScript + shadcn-ui + Tailwind CSS
- **Purpose:** QDiabetes risk calculator and health assistant, with a focus on user-friendly UI and clinical accuracy.
- **Hosting:** Designed for Lovable.dev, but can be run locally with Node.js/npm.

## Key Architecture & Patterns
- **src/components/**: All UI components, including custom (e.g., `QDiabetesCalculator.tsx`, `RiskGauge.tsx`) and shadcn-ui primitives (`ui/` subfolder).
- **src/pages/**: Top-level route components (e.g., `Index.tsx`).
- **src/lib/qdiabetes.ts**: Core QDiabetes risk calculation logic. This is the main business logic for risk scoring.
- **src/integrations/supabase/**: Supabase integration (e.g., `client.ts` for setup, `types.ts` for DB types).
- **supabase/functions/**: Edge functions (e.g., Deepgram token, variable extraction) for serverless backend logic.
- **Tailwind:** Utility-first styling, with custom config in `tailwind.config.ts`.

## Developer Workflows
- **Install dependencies:** `npm i`
- **Start dev server:** `npm run dev` (Vite, hot reload)
- **Build for production:** `npm run build`
- **Run tests:** `npm run test` (Vitest)
- **Lint:** `npm run lint`
- **Preview build:** `npm run preview`
- **Supabase functions:** Managed in `supabase/functions/`, configured via `supabase/config.toml`.

## Project-Specific Conventions
- **Component structure:** Prefer function components, colocate styles (Tailwind classes) in JSX.
- **UI primitives:** Use shadcn-ui components from `src/components/ui/` for consistency.
- **Form handling:** Uses React Hook Form (`@hookform/resolvers`), see `QDiabetesCalculator.tsx` and `FormField.tsx` for patterns.
- **TypeScript:** All code is typed; extend types in `src/lib/` or `src/integrations/supabase/types.ts`.
- **Disclaimer:** Legal/clinical disclaimer in `Disclaimer.tsx` must be shown on relevant pages.
- **External links:** Use `ExternalLink` icon for outbound links (see `Disclaimer.tsx`).

## Integration Points
- **Supabase:** Used for backend data and edge functions. Configure endpoints in `supabase/config.toml`.
- **Deepgram:** Voice input via Deepgram, token managed by Supabase function.
- **Lovable.dev:** Project is optimized for Lovable's deploy/edit workflow, but standard local dev is supported.

## Examples
- **Add a new UI component:** Place in `src/components/`, import in relevant page/component.
- **Add a new Supabase function:** Place in `supabase/functions/`, update `config.toml` if needed.
- **Update risk logic:** Edit `src/lib/qdiabetes.ts` and ensure all dependent components are updated.

## References
- See `README.md` for setup, deployment, and editing instructions.
- See `tailwind.config.ts` and `postcss.config.js` for styling setup.
- See `package.json` for scripts and dependencies.

---

**When in doubt, follow the structure and patterns of existing files.**
