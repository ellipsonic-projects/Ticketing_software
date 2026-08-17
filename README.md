# Multi-Tenant Ticketing System.......

An enterprise-style support ticketing platform for managing multiple tenants, clients, projects, engineers, SLAs, and ticket workflows from one application.

## Highlights

- Multi-tenant data model backed by PostgreSQL and Prisma
- Role-based access for platform admins, tenant admins, engineers, and clients
- Ticket creation, assignment, status and priority tracking
- Client and project management
- Ticket comments, attachments, activity history, notifications, and audit logs
- SLA policies with response and resolution targets
- JWT access/refresh-token authentication, invitations, and password reset flows
- REST API under `/api/v1`
- Responsive Next.js dashboard UI with reusable components

## Tech stack

- Next.js 16 App Router
- React 19 and TypeScript
- Prisma 6 with PostgreSQL/Neon
- Tailwind CSS 4 and reusable UI components
- Vitest for testing
- AWS S3-compatible storage and SMTP/Resend email integrations (optional)

## Requirements

- Node.js 22 (the required version is recorded in `.nvmrc`)
- npm
- PostgreSQL database; Neon is supported and recommended for hosted development

## Getting started

Clone the repository and install dependencies:

```bash
git clone https://github.com/ellipsonic-projects/Ticketing_software.git
cd Ticketing_software
npm install
```

Create a local `.env` file in the project root. At minimum, configure:

```dotenv
NODE_ENV=development
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
JWT_ACCESS_SECRET="replace-with-a-long-random-secret"
JWT_REFRESH_SECRET="replace-with-another-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Optional integrations can be enabled with `MAIL_PROVIDER` and `SMTP_*` settings, and `STORAGE_PROVIDER` plus the relevant AWS S3 settings. Keep `.env` out of version control.

Apply migrations and generate Prisma Client:

```bash
npx prisma migrate dev
npx prisma generate
```

To load the demo tenant, users, projects, SLA policy, and tickets:

```bash
npx prisma db seed
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo accounts

The seed script creates these local development accounts:

| Role           | Email                   | Password        |
| -------------- | ----------------------- | --------------- |
| Platform admin | `platform@elipdesk.com` | `Admin@1234`    |
| Tenant admin   | `admin@elipdesk.com`    | `Admin@1234`    |
| Engineer       | `john.doe@elipdesk.com` | `Engineer@1234` |
| Client portal  | `priya@acme.com`        | `Client@1234`   |

These credentials are for development only. Change or remove them before deploying to a shared or production environment.

## Useful commands

| Command                     | Purpose                                      |
| --------------------------- | -------------------------------------------- |
| `npm run dev`               | Start the development server                 |
| `npm run build`             | Create a production build                    |
| `npm run start`             | Start the production server                  |
| `npm run type-check`        | Run strict TypeScript checks                 |
| `npm run lint`              | Run ESLint                                   |
| `npm run test`              | Run the test suite once                      |
| `npm run test:watch`        | Run tests in watch mode                      |
| `npm run test:coverage`     | Generate test coverage                       |
| `npm run format`            | Format the project with Prettier             |
| `npm run ci`                | Run type-checking, linting, tests, and build |
| `npx prisma studio`         | Browse the database locally                  |
| `npx prisma migrate dev`    | Create and apply a development migration     |
| `npx prisma migrate deploy` | Apply committed migrations in deployment     |
| `npx prisma db seed`        | Seed the development database                |

## Project layout

```text
src/
|-- app/            Next.js pages, protected routes, and REST API routes
|-- components/     Domain-specific and reusable UI components
|-- config/         Validated application and integration configuration
|-- hooks/          Client-side data and authentication hooks
|-- lib/            Authentication, tenancy, validation, storage, logging, and utilities
|-- repositories/   Prisma data-access abstractions
|-- services/       Application services and API clients
|-- test/           Shared test setup
`-- tests/          Unit, API, and component tests

prisma/
|-- migrations/     Database migrations
|-- schema.prisma   Database schema
`-- seed.ts         Development seed data
```

Additional product and implementation documentation is available in [`Docs/`](./Docs), including the architecture, API documentation, application flow, schema, and phased scope.

## Deployment

The application can be deployed to Vercel or another Node.js host. Configure all required environment variables in the hosting provider, run migrations with `npx prisma migrate deploy`, and use:

```bash
npm run build
npm run start
```

See [`vercel_deployment_guide.md`](./vercel_deployment_guide.md) for Vercel-specific instructions.

## Contributing

Run `npm run ci` before opening a pull request. Husky hooks run lint-staged checks on commit, and commit messages follow Conventional Commits, such as `feat(tickets): add bulk assignment` or `fix(auth): handle expired refresh token`.
