# AGENTS.md - Hono Bun Starter

Essential information for AI coding agents working in this repository.

## Tech Stack

- **Framework**: Hono v4.x
- **Runtime**: Bun v1.3.5
- **Language**: TypeScript v5.x (ESNext, ES modules)
- **Database**: Drizzle ORM with Neon PostgreSQL
- **Auth**: Better Auth v1.x
- **Validation**: Zod v4.x

## Commands

### Development

- `bun run dev` - Start dev server with hot reload
- `bun start` - Start production server from dist/
- `bun run build` - Compile TypeScript to dist/
- `bun run type-check` - Type check without emitting

### Code Quality

- `bun run lint` - Run ESLint on src/
- `bun run lint:fix` - Auto-fix ESLint issues
- `bun run format` - Format with Prettier
- `bun run format:check` - Check Prettier formatting

### Database

- `bun run db:push` - Push schema changes directly
- `bun run db:generate` - Generate Drizzle migrations
- `bun run db:migrate` - Run database migrations
- `bun run db:studio` - Open Drizzle Studio

### Testing

**Note**: No testing framework configured. CI expects `npm test`. To add Vitest:

1. Install: `bun add -D vitest`
2. Add to package.json scripts:
   ```json
   "test": "vitest run",
   "test:watch": "vitest"
   ```
3. Run single test: `bun run test:run path/to/test.ts`

## Code Style

### TypeScript

- Strict mode enabled (tsconfig.json)
- ES modules (`"type": "module"` in package.json)
- Path mapping: `@/*` maps to `src/*`
- Target: ESNext

### Imports

- Prefer named imports for tree-shaking
- Group: external libs first, then local imports
- Use `@/` prefix for internal modules

```typescript
import { Hono } from "hono"
import { z } from "zod"

import { db } from "@/db"
import { getUsers } from "@/controllers/user"
```

### Naming

- **Variables/Functions**: camelCase (`getUsers`, `waitlistRoutes`)
- **Types/Classes**: PascalCase (`UserData`, `WaitlistController`)
- **Files**: kebab-case (`user-routes.ts`, `auth-utils.ts`)
- **Database**: snake_case (Drizzle convention)
- **Constants**: UPPER_SNAKE_CASE

### Formatting (Prettier)

- No semicolons
- Double quotes
- 2-space indentation
- ES5 trailing commas
- Auto end-of-line

### ESLint

- Flat config with typescript-eslint
- Uses eslint-config-love, security, promise, node plugins
- Prettier integration
- Disabled strict rules: `no-magic-numbers`, `eqeqeq`, `no-console`

## Patterns

### Hono Routes

```typescript
import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"

const router = new Hono()

router.get("/", async (c) => {
  const result = await getData()
  return c.json(result)
})

router.post(
  "/",
  zValidator("json", z.object({ email: z.string() })),
  async (c) => {
    const body = c.req.valid("json")
    const result = await createData(body)
    return c.json(result, 201)
  }
)

export default router
```

### Controllers

```typescript
export async function getUsers() {
  try {
    const users = await db.select().from(userTable)
    return { success: true, data: users }
  } catch (error) {
    console.error("Error:", error)
    return { success: false, message: "Failed to fetch users" }
  }
}
```

### Database (Drizzle)

```typescript
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
```

### Auth (Better Auth)

```typescript
app.on(
  ["POST", "GET"],
  "/api/auth/*",
  async (c) => await auth.handler(c.req.raw)
)
```

## Project Structure

```
src/
├── index.ts           # App entry point, middleware setup
├── routes/            # Hono route definitions
│   ├── user.ts
│   ├── waitlist.ts
│   └── stream.ts
├── controllers/       # Business logic
│   └── waitlist.ts
├── db/                # Database schema & connection
│   ├── index.ts
│   └── schema.ts
└── utils/             # Utilities
    ├── auth.ts
    └── datetime.ts
```

## Environment Variables

- `PORT` - Server port (default: 9000)
- `DATABASE_URL` - Neon PostgreSQL connection string

Copy `.env.example` to `.env` and fill in values.

## Git Hooks

- **Husky**: Pre-commit hooks configured
- **lint-staged**: Runs ESLint on staged `*.{js,ts}` files

## CI/CD

GitHub Actions workflow (`.github/workflows/node.js.yml`):

- Runs on Node.js 20.x
- Steps: checkout → setup Node → npm ci → build → test

## Quick Start

1. `bun install`
2. `cp .env.example .env` and configure
3. `bun run dev`
4. Before committing: `bun run lint:fix && bun run format`

## Security Best Practices

- Use Zod for all input validation
- Use parameterized queries (Drizzle handles this)
- Validate environment variables
- Never log sensitive data
- Implement secure headers (already in index.ts)
