<h1 align="center">
  Hono Bun Starter
</h1>

<p align="center">
  Hono and Bun project starter using TypeScript.
</p>

## Tech Stack

- **Framework**: Hono v4.x
- **Language**: TypeScript v5.x
- **Database**: Drizzle ORM with Neon PostgreSQL
- **Runtime**: Bun v1.3.5 or Node.js 24.12.0 (Volta)
- **Package Manager**: Bun
- **Database**: Drizzle ORM with Neon PostgreSQL

## Getting Started

1. Clone and install: `git clone https://github.com/nirnejak/hono-bun-starter.git && cd hono-bun-starter && bun install`

2. Set up environment: `cp .env.example .env` and update `.env` with your config

3. Start dev server: `bun run dev`

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run lint` - Run linter with Biome
- `bun run format` - Format with Biome
- `bun run check` - Run Biome lint + format + import sorting
- `bun run db:generate` - Generate migrations
- `bun run db:migrate` - Run migrations
