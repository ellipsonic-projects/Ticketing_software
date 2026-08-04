# Release Notes — Elipdesk Ticketing System

> **Project:** Multi-Tenant Support Ticketing System
> **Repository:** `poojarishreyas/Ticketing_System`
> **Stack:** Next.js 15+, Prisma ORM, PostgreSQL, AWS S3, SMTP, Vercel

---

## v1.0.0 — Initial Production Release

**Release Date:** August 4, 2026
**Branch:** `main`
**Commit:** `3147fcd`

This release marks the first production-ready version of the Elipdesk multi-tenant support ticketing system. It includes a complete platform foundation, four distinct role-based portals, real-time notifications, SLA tracking, file attachments via AWS S3, email via SMTP, and a fully deployed production environment on Vercel.

---

## ✨ Features

### 🏗️ Platform Foundation (Phase 0)
- Multi-tenant architecture with full tenant isolation at the database level.
- Prisma ORM with PostgreSQL as the primary data store.
- JWT-based authentication with access & refresh token support.
- Invitation-based onboarding for Tenant Admins, Engineers, and Clients.
- Global error handling middleware and standardised API response format.
- Zod-powered request validation across all API routes.
- Tenant resolution middleware that identifies the active tenant from subdomain or JWT.

### 👑 Platform Admin Portal
- Unified platform-level dashboard with KPIs and tenant overview.
- Tenant management: create, view, and manage tenants across the platform.
- Platform-wide analytics and health monitoring via `/api/v1/health`.

### 🛠️ Tenant Admin Portal
- Ticket management dashboard with tabbed filtering (All, My Tickets, Unassigned, Overdue, Due Today, Resolved, Closed).
- Full ticket table with priority and status badges, SLA status column, and engineer assignment.
- Assign Engineer side panel — assign or reassign engineers directly from the ticket list.
- Project management — create and manage projects linked to clients.
- Client management — invite and manage client accounts.
- SLA configuration page — define response and resolution SLAs per priority tier.
- CSV export for ticket data.
- Engineer invitation flow via email (SMTP).

### 👷 Engineer Portal
- Personalised dashboard with KPIs, SLA donut chart, upcoming deadlines widget, and recent activity feed.
- Ticket list with filters scoped to the logged-in engineer.
- Full ticket detail view with conversation thread, status controls, and attachment support.
- Role-specific sidebar navigation.

### 🙋 Client Portal
- Client-facing dashboard with summary statistics (open, in-progress, resolved tickets).
- Ticket list page with search, status and priority filters, and pagination.
- Slide-out side panel for viewing full ticket details without leaving the list.
- Create new ticket flow with project selection and file attachment support.
- My Tickets hero stats widget.

### 🔔 Notification System
- Full-stack in-app notification system.
- Real-time notification bell in the header for all roles.
- Notifications triggered on ticket assignment, status changes, and comments.

### 👤 User Profile
- Shared profile page available across all four roles (Platform Admin, Tenant Admin, Engineer, Client).
- Profile dropdown in the header with logout functionality.

### 📎 File Attachments (AWS S3)
- Pre-signed URL upload flow — files go directly from the browser to S3.
- Attachment metadata stored in the database linked to the ticket.
- Configurable bucket and region via environment variables.

### 📧 Email (SMTP)
- Invitation emails sent via SMTP when new users are added to the platform.
- Configurable SMTP credentials via environment variables.

---


---

## 🎨 UI / UX Improvements

- Premium SaaS-grade design system applied across all portals.
- Glassmorphism, gradient cards, and micro-animations throughout dashboards.
- Sticky sidebars locked to viewport height across all roles.
- Engineer dashboard cards standardised to a uniform 420px row height.
- Ticket detail and create-ticket forms condensed to fit within a single viewport.
- Softer borders and refined colour palette across all pages.
- Search bar removed from headers (search lives in-context per page).
- Profile page expanded to full width for a more spacious layout.

---

## 🏗️ Infrastructure & DevOps

- **Hosting:** Vercel (Production)
- **Database:** Prisma Postgres (`eu-north-1`)
- **Object Storage:** AWS S3 bucket `ticketingengine` (`eu-north-1`)
- **Email:** SMTP (configured via `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`)
- **CI/CD:** Automatic deployments from `main` branch on Vercel
- **Code Quality:** `lint-staged` pre-commit hooks running ESLint + Prettier on every commit

---

## ⚙️ Environment Variables Required

```env
# Database
DATABASE_URL=

# Auth
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

# AWS S3
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=

# SMTP
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# App
NEXT_PUBLIC_APP_URL=
```

---

## 🔑 Default Roles & Access

| Role | Access |
|------|--------|
| **Platform Admin** | Full platform management, all tenants |
| **Tenant Admin** | Full control within their tenant (tickets, projects, engineers, clients, SLAs) |
| **Engineer** | View and work on assigned tickets within their tenant |
| **Client** | Submit and track their own tickets |

---

## 📌 Known Limitations (v1.0.0)

- AWS S3 IAM user (`ticketing-app`) requires `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject` permissions to be manually added in the AWS Console before file uploads will function.
- The `fetch` call for S3 pre-signed URLs may time out in restricted network environments (e.g., behind certain proxies). Use `curl` or a browser client instead.
- Notification delivery is in-app only; email notifications are not yet supported.
- The platform admin dashboard does not yet have pagination on the tenant list.

---

## 🚀 What's Next (Planned for v1.1.0)

- [ ] Email notifications on ticket status changes and new comments.
- [ ] Audit log viewer in the Tenant Admin portal.
- [ ] Bulk ticket operations (bulk assign, bulk close).
- [ ] Mobile-responsive layout pass for all portals.
- [ ] Dark mode support.
- [ ] Webhook support for external integrations.

---

*Generated on August 4, 2026 · Elipdesk Engineering*
