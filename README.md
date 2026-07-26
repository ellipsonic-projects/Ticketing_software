# Multi-Tenant Ticketing System

An enterprise-grade, multi-tenant ticketing platform built with Next.js App Router, strict TypeScript, Prisma, and Neon (PostgreSQL).

## Prerequisites

- **Node.js**: The project is pinned to Node.js v22 (see `.nvmrc`).
  - Ensure you are running Node 22 (e.g., `nvm use`).
- **PostgreSQL**: Neon database URL required.

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Configure `.env`:
   - `DATABASE_URL`: Primary connection string
   - `DIRECT_URL`: Direct connection string (for migrations)
   - `NODE_ENV`: `development` | `production` | `test`

## Development Workflow

### Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Creates an optimized production build.
- `npm run lint` - Runs ESLint.
- `npm run type-check` - Runs strict TypeScript validation.
- `npm run format` - Runs Prettier formatting.

### Git Hooks & Commit Standards

This project enforces quality natively via Git Hooks (Husky).

1. **Pre-commit**: Automatically lints and formats staged files using `lint-staged`.
2. **Commit Messages**: We strictly enforce Conventional Commits (e.g., `feat(auth): add login`, `fix(ui): resolve button padding`). The commit will be rejected if the format is invalid.

## Testing

We use **Vitest** for our unit testing framework, chosen for its speed and native ESM support.

- `npm run test` - Runs the full test suite once.
- `npm run test:watch` - Runs the tests in interactive watch mode.
- `npm run test:coverage` - Generates a V8 coverage report.

## CI Pipeline

We utilize GitHub Actions to enforce strict pipeline gates on every pull request to `main`.
The CI script can be run locally before opening a pull request to ensure parity:

```bash
npm run ci
```

This sequentially executes:

1. Type checking (`tsc`)
2. Linting (`eslint`)
3. Unit Testing (`vitest`)
4. Production Build (`next build`)

## Project Structure

```text
src/
├── app/          # Next.js App Router endpoints & pages
├── config/       # Centralized Zod-validated environment config
├── constants/    # Static system constants (AppInfo, Status Codes)
├── lib/          # Core infrastructure logic
│   ├── errors/   # Global error handling & custom exceptions
│   ├── logger/   # Structured context-aware logger
│   ├── mail/     # Email abstractions
│   ├── storage/  # File storage abstractions
│   ├── time/     # System clock provider
├── middleware/   # API route wrappers and HOCs (Tenant/Auth)
├── repositories/ # Prisma abstractions & data access
├── test/         # Global test setups & utilities
└── validations/  # Request validation schemas
```
