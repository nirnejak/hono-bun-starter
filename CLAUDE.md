# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Dev server with hot reload (port 9000)
bun run build        # Compile to dist/ via Bun bundler
bun start            # Run production build from dist/
bun run type-check   # TypeScript type checking only

bun run lint         # Biome lint on src/
bun run lint:fix     # Auto-fix lint issues
bun run format       # Biome formatting
bun run format:check # Check formatting
bun run check        # Biome lint + format + import sorting
bun run check:fix    # Auto-fix all Biome issues

bun run db:push      # Push schema changes to database
bun run db:generate  # Generate Drizzle migrations
bun run db:migrate   # Run migrations
bun run db:studio    # Visual database editor
```

No test framework is configured yet.

## Architecture

Hono web framework running on Bun with Drizzle ORM (Neon PostgreSQL) and Better Auth.

**Entry point**: `src/index.ts` — sets up middleware (logger, secureHeaders), mounts auth handler at `/api/auth/*`, and mounts route modules.

**Layers**:
- `src/routes/` — Hono routers with Zod validation via `@hono/zod-validator`. Each file exports a `Hono()` instance mounted in index.ts.
- `src/controllers/` — Business logic functions that interact with the database and return `{ success, data/message }` objects.
- `src/db/schema.ts` — Drizzle table definitions (waitlist, user, session, account, verification). Relations defined here too.
- `src/db/index.ts` — Drizzle client instance using Neon serverless driver.
- `src/utils/auth.ts` — Better Auth config with Google OAuth and Drizzle adapter.
- `src/utils/datetime.ts` — date-fns formatting helpers.

## Code Style

- **No semicolons**, double quotes, 2-space indent (Biome)
- Path alias: `@/*` maps to `src/*`
- Biome handles linting, formatting, and import sorting via `biome.json`
- `noDoubleEquals`, `noExplicitAny`, and `noNonNullAssertion` are intentionally disabled
- Pre-commit hook (Husky + lint-staged) runs `biome check` on staged `*.{js,ts}` files

## Patterns

Routes create a `new Hono()`, define handlers, and `export default router`. POST routes use `zValidator("json", schema)` middleware for request validation. Controllers use try-catch and return result objects rather than throwing. Database access uses Drizzle's query builder (`db.select().from(table)`).

## Environment

Copy `.env.example` to `.env`. Key variables: `DATABASE_URL` (Neon PostgreSQL), `BETTER_AUTH_SECRET`, Google OAuth credentials (`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`).
