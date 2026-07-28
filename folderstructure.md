# Multi-Tenant Ticketing System - Folder Structure

Here is the organized folder structure of the `src` directory, broken down by architectural layers.

### 1. App Routing & API (`src/app/`)

Uses the Next.js App Router pattern for both frontend pages and backend API endpoints.

```text
src/app/
├── (protected)/         # Authenticated UI routes (dashboard, tenants, users, profile)
├── api/v1/              # Backend REST API
│   ├── auth/            # Auth endpoints (login, logout, refresh, reset, etc.)
│   ├── platform/        # Super-admin endpoints (managing tenants)
│   ├── profile/         # Current user profile endpoints
│   └── users/           # Tenant-level user management
├── auth/                # Public Auth UI routes (login, forgot-password, accept-invitation)
└── layout.tsx / page.tsx
```

### 2. UI Components (`src/components/`)

Separated by domain and utilizing Shadcn UI for base components.

```text
src/components/
├── auth/                # Specialized UI for the login and auth flows (widgets, cards, forms)
├── tenants/             # Tenant management components (lists, details, creation dialogs)
├── ui/                  # Reusable base UI components (buttons, dialogs, inputs)
└── users/               # User management components (lists, creation dialogs)
```

### 3. Core Business Logic (`src/services/`)

The service layer contains the application's core business logic, ensuring API routes remain thin.

```text
src/services/
├── api/                 # Frontend API fetch clients (api-client, auth-api, tenant-api)
├── audit/               # Centralized audit logging service
├── auth/                # Core authentication and session management logic
├── base/                # Base transaction utilities for Prisma
├── email/               # Email delivery service and Resend provider implementation
├── tenant/              # Tenant lifecycle logic (creation, status updates)
└── user/                # User lifecycle logic (invitations, updates)
```

### 4. Database Access (`src/repositories/`)

The repository layer handles direct interactions with Prisma, abstracting queries away from services.

```text
src/repositories/
├── auth/                # Session and token queries
├── tenant/              # Tenant CRUD queries
└── user/                # User CRUD queries
```

### 5. Infrastructure & Configuration (`src/lib/` & `src/config/`)

Shared utilities, database clients, error handling, and configurations.

```text
src/config/              # Environment variables, email, and DB configs
src/lib/
├── auth/                # JWT utilities, Role/Permission definitions, password hashing
├── errors/              # Centralized custom error classes (AppError, ForbiddenError, etc.)
├── logger/              # Winston-based logging setup
├── storage/             # File storage interfaces
├── tenant/              # Tenant schemas and request context resolution
├── time/                # Time utilities and mocks for testing
├── user/                # Zod schemas for user validation
├── prisma.ts            # Singleton Prisma client instance
└── request-context.ts   # AsyncLocalStorage for tracing requests and identity
```

### 6. Miscellaneous

```text
src/
├── constants/           # Shared constants (routes, HTTP statuses, app info)
├── contexts/            # React Context providers (AuthContext)
├── emails/              # React-Email templates (welcome, password reset, invitations)
├── hooks/               # Custom React hooks (use-auth, use-can, use-role)
├── middleware/          # Server-side middleware (Auth HOCs, Tenant routing)
├── tests/               # Vitest suite covering APIs, auth, and services
└── validations/         # Form and data validation logic (Zod)
```

### Full Directory Tree Skeleton

```text
.
├── .agents
│   └── skills
│       ├── prisma-cli
│       │   ├── references
│       │   │   ├── db-execute.md
│       │   │   ├── db-pull.md
│       │   │   ├── db-push.md
│       │   │   ├── db-seed.md
│       │   │   ├── debug.md
│       │   │   ├── dev.md
│       │   │   ├── format.md
│       │   │   ├── generate.md
│       │   │   ├── init.md
│       │   │   ├── mcp.md
│       │   │   ├── migrate-deploy.md
│       │   │   ├── migrate-dev.md
│       │   │   ├── migrate-diff.md
│       │   │   ├── migrate-reset.md
│       │   │   ├── migrate-resolve.md
│       │   │   ├── migrate-status.md
│       │   │   ├── studio.md
│       │   │   └── validate.md
│       │   └── SKILL.md
│       ├── prisma-client-api
│       │   ├── references
│       │   │   ├── client-methods.md
│       │   │   ├── constructor.md
│       │   │   ├── filters.md
│       │   │   ├── model-queries.md
│       │   │   ├── query-options.md
│       │   │   ├── raw-queries.md
│       │   │   ├── relations.md
│       │   │   └── transactions.md
│       │   └── SKILL.md
│       ├── prisma-compute
│       │   ├── references
│       │   │   ├── app-deploy-cli.md
│       │   │   ├── compute-config.md
│       │   │   ├── create-prisma.md
│       │   │   ├── frameworks.md
│       │   │   ├── sdk-api.md
│       │   │   └── troubleshooting.md
│       │   └── SKILL.md
│       ├── prisma-database-setup
│       │   ├── references
│       │   │   ├── cockroachdb.md
│       │   │   ├── mongodb.md
│       │   │   ├── mysql.md
│       │   │   ├── postgresql.md
│       │   │   ├── prisma-client-setup.md
│       │   │   ├── prisma-postgres.md
│       │   │   ├── sqlite.md
│       │   │   └── sqlserver.md
│       │   └── SKILL.md
│       ├── prisma-driver-adapter-implementation
│       │   └── SKILL.md
│       ├── prisma-mongodb-upgrade
│       │   ├── references
│       │   │   ├── client-api-mapping.md
│       │   │   ├── decision-stay-or-migrate.md
│       │   │   ├── migrations-mapping.md
│       │   │   ├── schema-contract-mapping.md
│       │   │   └── verify-cutover-checklist.md
│       │   └── SKILL.md
│       ├── prisma-postgres
│       │   ├── references
│       │   │   ├── console-and-connections.md
│       │   │   ├── create-db-cli.md
│       │   │   ├── management-api.md
│       │   │   └── management-api-sdk.md
│       │   └── SKILL.md
│       ├── prisma-postgres-setup
│       │   ├── references
│       │   │   ├── api-basics.md
│       │   │   ├── auth.md
│       │   │   ├── endpoints.md
│       │   │   └── prisma7-client.md
│       │   └── SKILL.md
│       └── prisma-upgrade-v7
│           ├── references
│           │   ├── accelerate-users.md
│           │   ├── driver-adapters.md
│           │   ├── env-variables.md
│           │   ├── esm-support.md
│           │   ├── prisma-config.md
│           │   ├── removed-features.md
│           │   └── schema-changes.md
│           └── SKILL.md
├── AGENTS.md
├── .claude
│   └── skills
│       ├── prisma-cli -> ../../.agents/skills/prisma-cli
│       ├── prisma-client-api -> ../../.agents/skills/prisma-client-api
│       ├── prisma-compute -> ../../.agents/skills/prisma-compute
│       ├── prisma-database-setup -> ../../.agents/skills/prisma-database-setup
│       ├── prisma-driver-adapter-implementation -> ../../.agents/skills/prisma-driver-adapter-implementation
│       ├── prisma-mongodb-upgrade -> ../../.agents/skills/prisma-mongodb-upgrade
│       ├── prisma-postgres -> ../../.agents/skills/prisma-postgres
│       ├── prisma-postgres-setup -> ../../.agents/skills/prisma-postgres-setup
│       └── prisma-upgrade-v7 -> ../../.agents/skills/prisma-upgrade-v7
├── CLAUDE.md
├── commitlint.config.cjs
├── components.json
├── Docs
│   ├── api_docs.md
│   ├── app_flow.md
│   ├── architecture.md
│   ├── phase_scope.md
│   ├── prd.md
│   └── schema.md
├── .editorconfig
├── .env
├── eslint.config.mjs
├── folderstructure.md
├── .github
│   ├── dependabot.yml
│   └── workflows
│       ├── ci.yml
│       └── dependency-review.yml
├── .gitignore
├── .husky
│   ├── _
│   │   ├── applypatch-msg
│   │   ├── commit-msg
│   │   ├── .gitignore
│   │   ├── h
│   │   ├── husky.sh
│   │   ├── post-applypatch
│   │   ├── post-checkout
│   │   ├── post-commit
│   │   ├── post-merge
│   │   ├── post-rewrite
│   │   ├── pre-applypatch
│   │   ├── pre-auto-gc
│   │   ├── pre-commit
│   │   ├── pre-merge-commit
│   │   ├── prepare-commit-msg
│   │   ├── pre-push
│   │   └── pre-rebase
│   ├── commit-msg
│   └── pre-commit
├── .lintstagedrc.json
├── next.config.ts
├── next-env.d.ts
├── .nvmrc
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── .prettierignore
├── .prettierrc.json
├── prisma
│   ├── migrations
│   │   ├── 20260726112753_init_phase_0
│   │   │   └── migration.sql
│   │   ├── 20260726160840_identity_foundation
│   │   │   └── migration.sql
│   │   ├── 20260726165219_add_password_reset
│   │   │   └── migration.sql
│   │   ├── 20260726192805_rename_roles
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   └── seed.ts
├── prisma.config.ts
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── skills-lock.json
├── src
│   ├── app
│   │   ├── api
│   │   │   └── v1
│   │   │       ├── auth
│   │   │       │   ├── accept-invitation
│   │   │       │   │   └── route.ts
│   │   │       │   ├── change-password
│   │   │       │   │   └── route.ts
│   │   │       │   ├── forgot-password
│   │   │       │   │   └── route.ts
│   │   │       │   ├── invitations
│   │   │       │   │   ├── route.ts
│   │   │       │   │   └── [token]
│   │   │       │   │       └── route.ts
│   │   │       │   ├── login
│   │   │       │   │   └── route.ts
│   │   │       │   ├── logout
│   │   │       │   │   └── route.ts
│   │   │       │   ├── me
│   │   │       │   │   └── route.ts
│   │   │       │   ├── refresh
│   │   │       │   │   └── route.ts
│   │   │       │   ├── resend-invitation
│   │   │       │   │   └── route.ts
│   │   │       │   └── reset-password
│   │   │       │       └── route.ts
│   │   │       ├── health
│   │   │       │   └── route.ts
│   │   │       ├── platform
│   │   │       │   └── tenants
│   │   │       │       ├── [id]
│   │   │       │       │   ├── route.ts
│   │   │       │       │   └── status
│   │   │       │       │       └── route.ts
│   │   │       │       └── route.ts
│   │   │       ├── profile
│   │   │       │   └── route.ts
│   │   │       └── users
│   │   │           ├── [id]
│   │   │           │   ├── route.ts
│   │   │           │   └── status
│   │   │           │       └── route.ts
│   │   │           └── route.ts
│   │   ├── auth
│   │   │   ├── accept-invitation
│   │   │   │   └── page.tsx
│   │   │   ├── change-password
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password
│   │   │   │   └── page.tsx
│   │   │   └── session-expired
│   │   │       └── page.tsx
│   │   ├── error.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   └── (protected)
│   │       ├── account
│   │       │   └── change-password
│   │       │       └── page.tsx
│   │       ├── platform
│   │       │   └── tenants
│   │       │       ├── [id]
│   │       │       │   └── page.tsx
│   │       │       └── page.tsx
│   │       ├── profile
│   │       │   └── page.tsx
│   │       └── users
│   │           ├── [id]
│   │           │   └── page.tsx
│   │           └── page.tsx
│   ├── components
│   │   ├── auth
│   │   │   ├── ai-widget.tsx
│   │   │   ├── analytics-card.tsx
│   │   │   ├── auth-button.tsx
│   │   │   ├── auth-card.tsx
│   │   │   ├── auth-input.tsx
│   │   │   ├── centered-auth-layout.tsx
│   │   │   ├── change-password-form.tsx
│   │   │   ├── cloud-icon.tsx
│   │   │   ├── composition-bridge.tsx
│   │   │   ├── forgot-password-form.tsx
│   │   │   ├── hero-illustration.tsx
│   │   │   ├── login-form.tsx
│   │   │   ├── metric-card.tsx
│   │   │   ├── notification-card.tsx
│   │   │   ├── oauth-button.tsx
│   │   │   ├── password-field.tsx
│   │   │   ├── quick-action-card.tsx
│   │   │   ├── require-permission.tsx
│   │   │   ├── reset-password-form.tsx
│   │   │   ├── status-badge.tsx
│   │   │   ├── support-ticket-card.tsx
│   │   │   ├── team-card.tsx
│   │   │   ├── use-simulation.tsx
│   │   │   └── workflow-card.tsx
│   │   ├── tenants
│   │   │   ├── create-tenant-dialog.tsx
│   │   │   ├── tenant-details.tsx
│   │   │   └── tenant-list.tsx
│   │   ├── ui
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── background-curves.tsx
│   │   │   ├── background-glow.tsx
│   │   │   ├── background-gradient.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── floating-particles.tsx
│   │   │   ├── index.ts
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── status-badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── textarea.tsx
│   │   └── users
│   │       ├── create-user-dialog.tsx
│   │       ├── user-details.tsx
│   │       └── user-list.tsx
│   ├── config
│   │   ├── app.ts
│   │   ├── auth.ts
│   │   ├── database.ts
│   │   ├── env.ts
│   │   ├── index.ts
│   │   ├── mail.ts
│   │   └── storage.ts
│   ├── constants
│   │   ├── app-info.ts
│   │   ├── error-codes.ts
│   │   ├── http-status.ts
│   │   ├── index.ts
│   │   ├── messages.ts
│   │   └── routes.ts
│   ├── contexts
│   │   └── auth-context.tsx
│   ├── emails
│   │   ├── invitation.tsx
│   │   ├── password-changed.tsx
│   │   ├── password-reset.tsx
│   │   └── welcome.tsx
│   ├── hooks
│   │   ├── use-auth.ts
│   │   ├── use-can.ts
│   │   └── use-role.ts
│   ├── lib
│   │   ├── api-response.ts
│   │   ├── auth
│   │   │   ├── auth-context.ts
│   │   │   ├── authorization.service.ts
│   │   │   ├── authorization.types.ts
│   │   │   ├── constants.ts
│   │   │   ├── cookies.ts
│   │   │   ├── index.ts
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   ├── permission-matrix.ts
│   │   │   ├── permissions.ts
│   │   │   ├── roles.ts
│   │   │   └── token-types.ts
│   │   ├── db.ts
│   │   ├── errors
│   │   │   ├── app-error.ts
│   │   │   ├── auth-errors.ts
│   │   │   ├── conflict-error.ts
│   │   │   ├── database-error.ts
│   │   │   ├── email-error.ts
│   │   │   ├── forbidden-error.ts
│   │   │   ├── global-handler.ts
│   │   │   ├── not-found-error.ts
│   │   │   ├── tenant-inactive-error.ts
│   │   │   ├── tenant-not-found-error.ts
│   │   │   ├── tenant-required-error.ts
│   │   │   └── validation-error.ts
│   │   ├── logger
│   │   │   ├── index.ts
│   │   │   ├── logger.ts
│   │   │   ├── serializers.ts
│   │   │   └── types.ts
│   │   ├── prisma.ts
│   │   ├── request-context.ts
│   │   ├── response.ts
│   │   ├── storage
│   │   │   ├── index.ts
│   │   │   ├── local-storage.ts
│   │   │   ├── storage.ts
│   │   │   └── types.ts
│   │   ├── tenant
│   │   │   ├── index.ts
│   │   │   ├── tenant-context.ts
│   │   │   ├── tenant-resolver.ts
│   │   │   └── tenant.schema.ts
│   │   ├── time
│   │   │   ├── clock.ts
│   │   │   ├── index.ts
│   │   │   └── __tests__
│   │   │       └── clock.test.ts
│   │   ├── user
│   │   │   └── user.schema.ts
│   │   └── utils.ts
│   ├── middleware
│   │   ├── authenticate.ts
│   │   └── tenant.ts
│   ├── middleware.ts
│   ├── providers
│   │   └── theme-provider.tsx
│   ├── repositories
│   │   ├── auth
│   │   │   └── auth.repository.ts
│   │   ├── tenant
│   │   │   └── tenant.repository.ts
│   │   └── user
│   │       └── user.repository.ts
│   ├── services
│   │   ├── api
│   │   │   ├── api-client.ts
│   │   │   ├── auth-api.ts
│   │   │   ├── profile-api.ts
│   │   │   ├── tenant-api.ts
│   │   │   └── user-api.ts
│   │   ├── audit
│   │   │   └── audit.service.ts
│   │   ├── auth
│   │   │   ├── auth.service.ts
│   │   │   └── session.service.ts
│   │   ├── base
│   │   │   └── transaction.ts
│   │   ├── email
│   │   │   ├── email.provider.ts
│   │   │   ├── email.service.ts
│   │   │   └── resend.provider.ts
│   │   ├── tenant
│   │   │   └── tenant.service.ts
│   │   └── user
│   │       └── user.service.ts
│   ├── test
│   │   └── setup.ts
│   ├── tests
│   │   ├── api
│   │   │   └── auth-routes.test.ts
│   │   ├── auth
│   │   │   ├── authorization.service.test.ts
│   │   │   ├── jwt.test.ts
│   │   │   ├── middleware.test.ts
│   │   │   ├── password.test.ts
│   │   │   └── session.test.ts
│   │   └── tenant
│   │       ├── tenant-list.test.tsx
│   │       └── tenant.service.test.ts
│   ├── types
│   │   └── api.ts
│   └── validations
│       ├── auth.ts
│       ├── common
│       │   └── index.ts
│       └── password.ts
├── tsconfig.json
├── tsconfig.tsbuildinfo
├── vitest.config.ts
└── .windsurf
    └── skills
        ├── prisma-cli -> ../../.agents/skills/prisma-cli
        ├── prisma-client-api -> ../../.agents/skills/prisma-client-api
        ├── prisma-compute -> ../../.agents/skills/prisma-compute
        ├── prisma-database-setup -> ../../.agents/skills/prisma-database-setup
        ├── prisma-driver-adapter-implementation -> ../../.agents/skills/prisma-driver-adapter-implementation
        ├── prisma-mongodb-upgrade -> ../../.agents/skills/prisma-mongodb-upgrade
        ├── prisma-postgres -> ../../.agents/skills/prisma-postgres
        ├── prisma-postgres-setup -> ../../.agents/skills/prisma-postgres-setup
        └── prisma-upgrade-v7 -> ../../.agents/skills/prisma-upgrade-v7

136 directories, 324 files
```
