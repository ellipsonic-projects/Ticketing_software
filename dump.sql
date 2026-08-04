--
-- PostgreSQL database dump
--

\restrict ghlLX3YbXUG74SIS48AjwDicV6J8xkY9qYUaSHZyIS2N9LBDYQ6Dgz31U4UWcvj

-- Dumped from database version 18.4 (df16b3c)
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."_TicketToTicketTag" DROP CONSTRAINT IF EXISTS "_TicketToTicketTag_B_fkey";
ALTER TABLE IF EXISTS ONLY public."_TicketToTicketTag" DROP CONSTRAINT IF EXISTS "_TicketToTicketTag_A_fkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_clientId_fkey";
ALTER TABLE IF EXISTS ONLY public."Ticket" DROP CONSTRAINT IF EXISTS "Ticket_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public."Ticket" DROP CONSTRAINT IF EXISTS "Ticket_reportedById_fkey";
ALTER TABLE IF EXISTS ONLY public."Ticket" DROP CONSTRAINT IF EXISTS "Ticket_projectId_fkey";
ALTER TABLE IF EXISTS ONLY public."Ticket" DROP CONSTRAINT IF EXISTS "Ticket_clientId_fkey";
ALTER TABLE IF EXISTS ONLY public."Ticket" DROP CONSTRAINT IF EXISTS "Ticket_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public."Ticket" DROP CONSTRAINT IF EXISTS "Ticket_assignedToId_fkey";
ALTER TABLE IF EXISTS ONLY public."TicketTag" DROP CONSTRAINT IF EXISTS "TicketTag_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public."TicketSLA" DROP CONSTRAINT IF EXISTS "TicketSLA_ticketId_fkey";
ALTER TABLE IF EXISTS ONLY public."TicketHistory" DROP CONSTRAINT IF EXISTS "TicketHistory_ticketId_fkey";
ALTER TABLE IF EXISTS ONLY public."TicketHistory" DROP CONSTRAINT IF EXISTS "TicketHistory_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public."TicketHistory" DROP CONSTRAINT IF EXISTS "TicketHistory_changedById_fkey";
ALTER TABLE IF EXISTS ONLY public."TicketComment" DROP CONSTRAINT IF EXISTS "TicketComment_ticketId_fkey";
ALTER TABLE IF EXISTS ONLY public."TicketComment" DROP CONSTRAINT IF EXISTS "TicketComment_authorId_fkey";
ALTER TABLE IF EXISTS ONLY public."TicketCategory" DROP CONSTRAINT IF EXISTS "TicketCategory_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public."TicketAttachment" DROP CONSTRAINT IF EXISTS "TicketAttachment_uploaderId_fkey";
ALTER TABLE IF EXISTS ONLY public."TicketAttachment" DROP CONSTRAINT IF EXISTS "TicketAttachment_ticketId_fkey";
ALTER TABLE IF EXISTS ONLY public."Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."SLATier" DROP CONSTRAINT IF EXISTS "SLATier_policyId_fkey";
ALTER TABLE IF EXISTS ONLY public."SLAPolicy" DROP CONSTRAINT IF EXISTS "SLAPolicy_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public."Project" DROP CONSTRAINT IF EXISTS "Project_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public."Project" DROP CONSTRAINT IF EXISTS "Project_clientId_fkey";
ALTER TABLE IF EXISTS ONLY public."PasswordResetToken" DROP CONSTRAINT IF EXISTS "PasswordResetToken_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Notification" DROP CONSTRAINT IF EXISTS "Notification_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Notification" DROP CONSTRAINT IF EXISTS "Notification_ticketId_fkey";
ALTER TABLE IF EXISTS ONLY public."Notification" DROP CONSTRAINT IF EXISTS "Notification_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public."Holiday" DROP CONSTRAINT IF EXISTS "Holiday_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public."Holiday" DROP CONSTRAINT IF EXISTS "Holiday_projectId_fkey";
ALTER TABLE IF EXISTS ONLY public."Client" DROP CONSTRAINT IF EXISTS "Client_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public."BusinessHours" DROP CONSTRAINT IF EXISTS "BusinessHours_tenantId_fkey";
ALTER TABLE IF EXISTS ONLY public."BusinessHours" DROP CONSTRAINT IF EXISTS "BusinessHours_projectId_fkey";
DROP INDEX IF EXISTS public."_TicketToTicketTag_B_index";
DROP INDEX IF EXISTS public."User_tenantId_idx";
DROP INDEX IF EXISTS public."User_invitationTokenHash_key";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."User_deletedAt_idx";
DROP INDEX IF EXISTS public."User_clientId_idx";
DROP INDEX IF EXISTS public."Ticket_tenantId_number_key";
DROP INDEX IF EXISTS public."Ticket_tenantId_idx";
DROP INDEX IF EXISTS public."Ticket_status_idx";
DROP INDEX IF EXISTS public."Ticket_resolvedAt_idx";
DROP INDEX IF EXISTS public."Ticket_projectId_idx";
DROP INDEX IF EXISTS public."Ticket_closedAt_idx";
DROP INDEX IF EXISTS public."Ticket_clientId_idx";
DROP INDEX IF EXISTS public."Ticket_assignedToId_idx";
DROP INDEX IF EXISTS public."TicketTag_tenantId_name_key";
DROP INDEX IF EXISTS public."TicketTag_tenantId_idx";
DROP INDEX IF EXISTS public."TicketSLA_ticketId_key";
DROP INDEX IF EXISTS public."TicketHistory_ticketId_idx";
DROP INDEX IF EXISTS public."TicketHistory_tenantId_idx";
DROP INDEX IF EXISTS public."TicketHistory_createdAt_idx";
DROP INDEX IF EXISTS public."TicketComment_ticketId_idx";
DROP INDEX IF EXISTS public."TicketComment_createdAt_idx";
DROP INDEX IF EXISTS public."TicketCategory_tenantId_name_key";
DROP INDEX IF EXISTS public."TicketCategory_tenantId_idx";
DROP INDEX IF EXISTS public."TicketAttachment_ticketId_idx";
DROP INDEX IF EXISTS public."Tenant_status_idx";
DROP INDEX IF EXISTS public."Tenant_slug_key";
DROP INDEX IF EXISTS public."Tenant_name_idx";
DROP INDEX IF EXISTS public."Tenant_domain_key";
DROP INDEX IF EXISTS public."Tenant_deletedAt_idx";
DROP INDEX IF EXISTS public."Session_userId_idx";
DROP INDEX IF EXISTS public."Session_tenantId_idx";
DROP INDEX IF EXISTS public."SLATier_policyId_priority_key";
DROP INDEX IF EXISTS public."SLAPolicy_tenantId_key";
DROP INDEX IF EXISTS public."Project_tenantId_idx";
DROP INDEX IF EXISTS public."Project_tenantId_clientId_name_key";
DROP INDEX IF EXISTS public."Project_status_idx";
DROP INDEX IF EXISTS public."Project_clientId_idx";
DROP INDEX IF EXISTS public."PasswordResetToken_userId_idx";
DROP INDEX IF EXISTS public."PasswordResetToken_userId_expiresAt_idx";
DROP INDEX IF EXISTS public."PasswordResetToken_tokenHash_key";
DROP INDEX IF EXISTS public."PasswordResetToken_expiresAt_idx";
DROP INDEX IF EXISTS public."Notification_userId_idx";
DROP INDEX IF EXISTS public."Notification_isRead_idx";
DROP INDEX IF EXISTS public."Notification_createdAt_idx";
DROP INDEX IF EXISTS public."Holiday_tenantId_idx";
DROP INDEX IF EXISTS public."Holiday_projectId_holidayDate_key";
DROP INDEX IF EXISTS public."Client_tenantId_name_key";
DROP INDEX IF EXISTS public."Client_tenantId_idx";
DROP INDEX IF EXISTS public."Client_status_idx";
DROP INDEX IF EXISTS public."Client_name_idx";
DROP INDEX IF EXISTS public."BusinessHours_tenantId_idx";
DROP INDEX IF EXISTS public."BusinessHours_projectId_dayOfWeek_key";
DROP INDEX IF EXISTS public."AuditLog_entity_entityId_idx";
DROP INDEX IF EXISTS public."AuditLog_createdAt_idx";
DROP INDEX IF EXISTS public."AuditLog_action_idx";
ALTER TABLE IF EXISTS ONLY public.playing_with_neon DROP CONSTRAINT IF EXISTS playing_with_neon_pkey;
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."_TicketToTicketTag" DROP CONSTRAINT IF EXISTS "_TicketToTicketTag_AB_pkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Ticket" DROP CONSTRAINT IF EXISTS "Ticket_pkey";
ALTER TABLE IF EXISTS ONLY public."TicketTag" DROP CONSTRAINT IF EXISTS "TicketTag_pkey";
ALTER TABLE IF EXISTS ONLY public."TicketSLA" DROP CONSTRAINT IF EXISTS "TicketSLA_pkey";
ALTER TABLE IF EXISTS ONLY public."TicketHistory" DROP CONSTRAINT IF EXISTS "TicketHistory_pkey";
ALTER TABLE IF EXISTS ONLY public."TicketComment" DROP CONSTRAINT IF EXISTS "TicketComment_pkey";
ALTER TABLE IF EXISTS ONLY public."TicketCategory" DROP CONSTRAINT IF EXISTS "TicketCategory_pkey";
ALTER TABLE IF EXISTS ONLY public."TicketAttachment" DROP CONSTRAINT IF EXISTS "TicketAttachment_pkey";
ALTER TABLE IF EXISTS ONLY public."Tenant" DROP CONSTRAINT IF EXISTS "Tenant_pkey";
ALTER TABLE IF EXISTS ONLY public."Session" DROP CONSTRAINT IF EXISTS "Session_pkey";
ALTER TABLE IF EXISTS ONLY public."SLATier" DROP CONSTRAINT IF EXISTS "SLATier_pkey";
ALTER TABLE IF EXISTS ONLY public."SLAPolicy" DROP CONSTRAINT IF EXISTS "SLAPolicy_pkey";
ALTER TABLE IF EXISTS ONLY public."Project" DROP CONSTRAINT IF EXISTS "Project_pkey";
ALTER TABLE IF EXISTS ONLY public."PasswordResetToken" DROP CONSTRAINT IF EXISTS "PasswordResetToken_pkey";
ALTER TABLE IF EXISTS ONLY public."Notification" DROP CONSTRAINT IF EXISTS "Notification_pkey";
ALTER TABLE IF EXISTS ONLY public."Holiday" DROP CONSTRAINT IF EXISTS "Holiday_pkey";
ALTER TABLE IF EXISTS ONLY public."Client" DROP CONSTRAINT IF EXISTS "Client_pkey";
ALTER TABLE IF EXISTS ONLY public."BusinessHours" DROP CONSTRAINT IF EXISTS "BusinessHours_pkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_pkey";
ALTER TABLE IF EXISTS public.playing_with_neon ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.playing_with_neon_id_seq;
DROP TABLE IF EXISTS public.playing_with_neon;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."_TicketToTicketTag";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."TicketTag";
DROP TABLE IF EXISTS public."TicketSLA";
DROP TABLE IF EXISTS public."TicketHistory";
DROP TABLE IF EXISTS public."TicketComment";
DROP TABLE IF EXISTS public."TicketCategory";
DROP TABLE IF EXISTS public."TicketAttachment";
DROP TABLE IF EXISTS public."Ticket";
DROP TABLE IF EXISTS public."Tenant";
DROP TABLE IF EXISTS public."Session";
DROP TABLE IF EXISTS public."SLATier";
DROP TABLE IF EXISTS public."SLAPolicy";
DROP TABLE IF EXISTS public."Project";
DROP TABLE IF EXISTS public."PasswordResetToken";
DROP TABLE IF EXISTS public."Notification";
DROP TABLE IF EXISTS public."Holiday";
DROP TABLE IF EXISTS public."Client";
DROP TABLE IF EXISTS public."BusinessHours";
DROP TABLE IF EXISTS public."AuditLog";
DROP TYPE IF EXISTS public."UserStatus";
DROP TYPE IF EXISTS public."TicketStatus";
DROP TYPE IF EXISTS public."TicketPriority";
DROP TYPE IF EXISTS public."TicketHistoryAction";
DROP TYPE IF EXISTS public."TenantStatus";
DROP TYPE IF EXISTS public."SupportStatus";
DROP TYPE IF EXISTS public."Role";
DROP TYPE IF EXISTS public."ProjectStatus";
DROP TYPE IF EXISTS public."ClientStatus";
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: ClientStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ClientStatus" AS ENUM (
    'PENDING_ACTIVATION',
    'ACTIVE',
    'INACTIVE'
);


--
-- Name: ProjectStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ProjectStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'PLATFORM_ADMIN',
    'TENANT_ADMIN',
    'ENGINEER',
    'CLIENT'
);


--
-- Name: SupportStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SupportStatus" AS ENUM (
    'ENABLED',
    'PAUSED'
);


--
-- Name: TenantStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TenantStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'PENDING_ACTIVATION'
);


--
-- Name: TicketHistoryAction; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TicketHistoryAction" AS ENUM (
    'CREATED',
    'STATUS_CHANGED',
    'PRIORITY_CHANGED',
    'ASSIGNED',
    'REASSIGNED',
    'UNASSIGNED',
    'COMMENT_ADDED',
    'ATTACHMENT_ADDED',
    'RESOLVED',
    'CLOSED',
    'REOPENED'
);


--
-- Name: TicketPriority; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TicketPriority" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
);


--
-- Name: TicketStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TicketStatus" AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'RESOLVED',
    'CLOSED'
);


--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'INVITED'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    entity text NOT NULL,
    "entityId" text NOT NULL,
    action text NOT NULL,
    "actorId" text,
    before jsonb,
    after jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: BusinessHours; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BusinessHours" (
    id text NOT NULL,
    "projectId" text NOT NULL,
    "tenantId" text NOT NULL,
    "dayOfWeek" integer NOT NULL,
    "isOpen" boolean DEFAULT true NOT NULL,
    "startTime" time(0) without time zone,
    "endTime" time(0) without time zone,
    timezone text
);


--
-- Name: Client; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Client" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    code text,
    email text,
    phone text,
    industry text,
    website text,
    "contactName" text,
    address text,
    notes text,
    status public."ClientStatus" DEFAULT 'ACTIVE'::public."ClientStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdById" text,
    "updatedById" text,
    "deletedAt" timestamp(3) without time zone
);


--
-- Name: Holiday; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Holiday" (
    id text NOT NULL,
    "projectId" text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "holidayDate" date NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text NOT NULL,
    "ticketId" text,
    title text NOT NULL,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: PasswordResetToken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PasswordResetToken" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "tokenHash" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Project" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "clientId" text NOT NULL,
    name text NOT NULL,
    code text,
    description text,
    color text,
    status public."ProjectStatus" DEFAULT 'ACTIVE'::public."ProjectStatus" NOT NULL,
    "supportStatus" public."SupportStatus" DEFAULT 'ENABLED'::public."SupportStatus" NOT NULL,
    "defaultPriority" public."TicketPriority" DEFAULT 'MEDIUM'::public."TicketPriority" NOT NULL,
    "supportEmail" text,
    "supportPhone" text,
    "supportNotes" text,
    "supportStartDate" timestamp(3) without time zone,
    "supportEndDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "archivedAt" timestamp(3) without time zone,
    "createdById" text,
    "updatedById" text
);


--
-- Name: SLAPolicy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SLAPolicy" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "businessHoursEnabled" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: SLATier; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SLATier" (
    id text NOT NULL,
    "policyId" text NOT NULL,
    priority public."TicketPriority" NOT NULL,
    "responseTimeMinutes" integer NOT NULL,
    "resolutionTimeMinutes" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "tenantId" text,
    "refreshTokenHash" text NOT NULL,
    "userAgent" text,
    "ipAddress" text,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "revokedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Tenant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tenant" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    status public."TenantStatus" DEFAULT 'ACTIVE'::public."TenantStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" text,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "updatedBy" text,
    "contactEmail" text,
    "contactPhone" text,
    currency text DEFAULT 'USD'::text NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    domain text,
    timezone text DEFAULT 'UTC'::text NOT NULL
);


--
-- Name: Ticket; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Ticket" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "projectId" text NOT NULL,
    "clientId" text NOT NULL,
    number integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    status public."TicketStatus" DEFAULT 'OPEN'::public."TicketStatus" NOT NULL,
    priority public."TicketPriority" DEFAULT 'MEDIUM'::public."TicketPriority" NOT NULL,
    "categoryId" text,
    "assignedToId" text,
    "reportedById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "resolvedAt" timestamp(3) without time zone,
    "closedAt" timestamp(3) without time zone
);


--
-- Name: TicketAttachment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TicketAttachment" (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    "uploaderId" text NOT NULL,
    filename text NOT NULL,
    size integer NOT NULL,
    "mimeType" text NOT NULL,
    url text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: TicketCategory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TicketCategory" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    color text
);


--
-- Name: TicketComment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TicketComment" (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    "authorId" text NOT NULL,
    body text NOT NULL,
    "isInternal" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: TicketHistory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TicketHistory" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "ticketId" text NOT NULL,
    action public."TicketHistoryAction" NOT NULL,
    "oldValue" text,
    "newValue" text,
    "changedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: TicketSLA; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TicketSLA" (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    "firstResponseTimeMins" integer NOT NULL,
    "resolutionTimeMins" integer NOT NULL,
    "businessHoursEnabled" boolean NOT NULL,
    "firstResponseBreachAt" timestamp(3) without time zone,
    "resolutionBreachAt" timestamp(3) without time zone,
    "firstRespondedAt" timestamp(3) without time zone,
    "resolvedAt" timestamp(3) without time zone
);


--
-- Name: TicketTag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TicketTag" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    color text
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    role public."Role" DEFAULT 'ENGINEER'::public."Role" NOT NULL,
    "tenantId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" text,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "updatedBy" text,
    "activatedAt" timestamp(3) without time zone,
    "avatarUrl" text,
    "clientId" text,
    "deletedAt" timestamp(3) without time zone,
    "firstName" text NOT NULL,
    "invitationExpiresAt" timestamp(3) without time zone,
    "invitationTokenHash" text,
    "invitedAt" timestamp(3) without time zone,
    "lastName" text NOT NULL,
    "mustChangePassword" boolean DEFAULT false NOT NULL
);


--
-- Name: _TicketToTicketTag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_TicketToTicketTag" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: playing_with_neon; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.playing_with_neon (
    id integer NOT NULL,
    name text NOT NULL,
    value real
);


--
-- Name: playing_with_neon_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.playing_with_neon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: playing_with_neon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.playing_with_neon_id_seq OWNED BY public.playing_with_neon.id;


--
-- Name: playing_with_neon id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.playing_with_neon ALTER COLUMN id SET DEFAULT nextval('public.playing_with_neon_id_seq'::regclass);


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AuditLog" (id, entity, "entityId", action, "actorId", before, after, "createdAt") FROM stdin;
cms8rcmwz000oij951nj4zmje	Project	cms8r938k000mijcj02p1hem5	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-07-31 09:46:24.131
cms8rqw7a0004ijn7rtugt222	Ticket	cms8rqvnu0001ijn7klrj03mh	TICKET_CREATED	cms8r92zm000eijcj48pzmyhn	null	{"id": "cms8rqvnu0001ijn7klrj03mh", "title": "Test Ticket 1785491848033", "number": 25, "status": "OPEN", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "MEDIUM", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-07-31T09:57:28.650Z", "projectId": "cms8r938j000iijcjv4rbtr4o", "updatedAt": "2026-07-31T09:57:28.650Z", "categoryId": null, "resolvedAt": null, "description": "This is a test description with more than 10 chars", "assignedToId": null, "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-07-31 09:57:29.35
cms8rxy1t0000ijcq27m86q9c	SLAPolicy	cms8rbgh9000oijntd5hipmrt	SLA_UPDATED	cms8r925a0004ijcjjy1w8w4t	{"id": "cms8rbgha000sijnt1mjjlvvt", "policyId": "cms8rbgh9000oijntd5hipmrt", "priority": "URGENT", "createdAt": "2026-07-31T09:45:29.134Z", "updatedAt": "2026-07-31T09:45:29.134Z", "responseTimeMinutes": 30, "resolutionTimeMinutes": 480}	{"id": "cms8rbgha000sijnt1mjjlvvt", "policyId": "cms8rbgh9000oijntd5hipmrt", "priority": "URGENT", "createdAt": "2026-07-31T09:45:29.134Z", "updatedAt": "2026-07-31T10:02:58.241Z", "responseTimeMinutes": 30, "resolutionTimeMinutes": 480}	2026-07-31 10:02:58.337
cms8tjqum0003ijcq5w7tteiv	Ticket	cms8rbpt1005uijntsiak8yf1	TICKET_ASSIGNED	cms8r925a0004ijcjjy1w8w4t	{"assignedToId": null}	{"assignedToId": "cms8r91xj0002ijcjijcbf0gt"}	2026-07-31 10:47:55.055
cms8tqiev0006ijcqboyum01g	Project	cms8r938k000mijcj02p1hem5	PROJECT_VIEWED	cms8r92zm000eijcj48pzmyhn	null	null	2026-07-31 10:53:10.712
cms8tuct30007ijcqg172ein1	Ticket	cms8rqvnu0001ijn7klrj03mh	TICKET_UPDATED	cms8r925a0004ijcjjy1w8w4t	{"status": "OPEN"}	{"id": "cms8rqvnu0001ijn7klrj03mh", "title": "Test Ticket 1785491848033", "number": 25, "status": "OPEN", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "MEDIUM", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-07-31T09:57:28.650Z", "projectId": "cms8r938j000iijcjv4rbtr4o", "updatedAt": "2026-07-31T10:56:09.971Z", "categoryId": null, "resolvedAt": null, "description": "This is a test description with more than 10 chars", "assignedToId": null, "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-07-31 10:56:10.072
cms8tuf830008ijcq69040lkk	Ticket	cms8rqvnu0001ijn7klrj03mh	TICKET_UNASSIGNED	cms8r925a0004ijcjjy1w8w4t	{"assignedToId": null}	{"assignedToId": null}	2026-07-31 10:56:13.203
cms8ucrp3000dijcqgw9uzhnx	Ticket	cms8ucrdi000aijcqi6g05cef	TICKET_CREATED	cms8r92zm000eijcj48pzmyhn	null	{"id": "cms8ucrdi000aijcqi6g05cef", "title": "sdfghgfdsdfgn", "number": 26, "status": "OPEN", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "MEDIUM", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-07-31T11:10:28.758Z", "projectId": "cms8r938j000iijcjv4rbtr4o", "updatedAt": "2026-07-31T11:10:28.758Z", "categoryId": null, "resolvedAt": null, "description": "dfghddvccvbn", "assignedToId": null, "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-07-31 11:10:29.175
cms8ue43w000iijcqc5j2fgpr	Ticket	cms8ue3to000fijcq3cftl3mh	TICKET_CREATED	cms8r92zm000eijcj48pzmyhn	null	{"id": "cms8ue3to000fijcq3cftl3mh", "title": "nbvchgfdfghgf", "number": 27, "status": "OPEN", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "MEDIUM", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-07-31T11:11:31.548Z", "projectId": "cms8r938j000jijcj79u0p9pb", "updatedAt": "2026-07-31T11:11:31.548Z", "categoryId": null, "resolvedAt": null, "description": "jhgfghgfddfgfdsdfg", "assignedToId": null, "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-07-31 11:11:31.916
cms8ufo6u000jijcqnp21iel2	Ticket	cms8ue3to000fijcq3cftl3mh	TICKET_ASSIGNED	cms8r925a0004ijcjjy1w8w4t	{"assignedToId": null}	{"assignedToId": "cms8r91xj0002ijcjijcbf0gt"}	2026-07-31 11:12:44.598
cms8ujcjw000oijcql7jp5uot	Ticket	cms8ujc77000lijcqg14fgay6	TICKET_CREATED	cms8r92zm000eijcj48pzmyhn	null	{"id": "cms8ujc77000lijcqg14fgay6", "title": "dfghjhgfddfghjhgf", "number": 28, "status": "OPEN", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "MEDIUM", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-07-31T11:15:35.683Z", "projectId": "cms8r938j000iijcjv4rbtr4o", "updatedAt": "2026-07-31T11:15:35.683Z", "categoryId": null, "resolvedAt": null, "description": "gfdfghjhgfdsdfghhgfdfgh", "assignedToId": null, "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-07-31 11:15:36.14
cms96aw1w0000ijwpj5nxo846	Ticket	cms8ucrdi000aijcqi6g05cef	TICKET_ASSIGNED	cms8r925a0004ijcjjy1w8w4t	{"assignedToId": null}	{"assignedToId": "cms8r927b000aijcjt7sutffd"}	2026-07-31 16:44:56.9
cms96bp9g0001ijwplrldq6ub	Project	cms8r938k000mijcj02p1hem5	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-07-31 16:45:34.756
cmsa89t7t0002ijpjpfo0bk06	Project	cmsa89t4d0001ijpjoxjy6hxe	PROJECT_CREATED	cms8r925a0004ijcjjy1w8w4t	null	{"id": "cmsa89t4d0001ijpjoxjy6hxe", "code": "cx", "name": "xcvbvc", "color": null, "status": "ACTIVE", "clientId": "cms8r92j9000cijcjl6i2t3xt", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-08-01T10:27:51.853Z", "updatedAt": "2026-08-01T10:27:51.853Z", "archivedAt": null, "createdById": "cms8r925a0004ijcjjy1w8w4t", "description": "xzxcx", "updatedById": "cms8r925a0004ijcjjy1w8w4t", "supportEmail": null, "supportNotes": null, "supportPhone": null, "supportStatus": "ENABLED", "supportEndDate": null, "defaultPriority": "MEDIUM", "supportStartDate": null}	2026-08-01 10:27:51.977
cmsalz5wn0000ijdw7pwkrjiz	Ticket	cms8rqvnu0001ijn7klrj03mh	TICKET_UPDATED	cms8r925a0004ijcjjy1w8w4t	{"status": "IN_PROGRESS"}	{"id": "cms8rqvnu0001ijn7klrj03mh", "title": "Test Ticket 1785491848033", "number": 25, "status": "IN_PROGRESS", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "MEDIUM", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-07-31T09:57:28.650Z", "projectId": "cms8r938j000iijcjv4rbtr4o", "updatedAt": "2026-08-01T16:51:29.449Z", "categoryId": null, "resolvedAt": null, "description": "This is a test description with more than 10 chars", "assignedToId": null, "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-08-01 16:51:29.831
cmsalz8530001ijdw9adhf50r	Ticket	cms8rqvnu0001ijn7klrj03mh	TICKET_UPDATED	cms8r925a0004ijcjjy1w8w4t	{"status": "RESOLVED"}	{"id": "cms8rqvnu0001ijn7klrj03mh", "title": "Test Ticket 1785491848033", "number": 25, "status": "RESOLVED", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "MEDIUM", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-07-31T09:57:28.650Z", "projectId": "cms8r938j000iijcjv4rbtr4o", "updatedAt": "2026-08-01T16:51:32.433Z", "categoryId": null, "resolvedAt": "2026-08-01T16:51:32.429Z", "description": "This is a test description with more than 10 chars", "assignedToId": null, "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-08-01 16:51:32.728
cmsbq8iki0008iju68bg1wi2e	Client	cmsbq8i5o0005iju6jloyfdet	CLIENT_ONBOARDED	cms8r925a0004ijcjjy1w8w4t	null	{"id": "cmsbq8i5o0005iju6jloyfdet", "code": null, "name": "fnmndbdmjhgf", "email": null, "notes": null, "phone": null, "status": "ACTIVE", "address": null, "website": null, "industry": null, "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-08-02T11:38:30.252Z", "deletedAt": null, "updatedAt": "2026-08-02T11:38:30.252Z", "contactName": null, "createdById": "cms8r925a0004ijcjjy1w8w4t", "updatedById": "cms8r925a0004ijcjjy1w8w4t"}	2026-08-02 11:38:30.787
cmsalza680002ijdwxrq56ml1	Ticket	cms8rqvnu0001ijn7klrj03mh	TICKET_UPDATED	cms8r925a0004ijcjjy1w8w4t	{"status": "CLOSED"}	{"id": "cms8rqvnu0001ijn7klrj03mh", "title": "Test Ticket 1785491848033", "number": 25, "status": "CLOSED", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": "2026-08-01T16:51:35.153Z", "priority": "MEDIUM", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-07-31T09:57:28.650Z", "projectId": "cms8r938j000iijcjv4rbtr4o", "updatedAt": "2026-08-01T16:51:35.156Z", "categoryId": null, "resolvedAt": "2026-08-01T16:51:32.429Z", "description": "This is a test description with more than 10 chars", "assignedToId": null, "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-08-01 16:51:35.36
cmsalzc020003ijdwduvq3m6g	Ticket	cms8rqvnu0001ijn7klrj03mh	TICKET_UPDATED	cms8r925a0004ijcjjy1w8w4t	{"status": "CLOSED"}	{"id": "cms8rqvnu0001ijn7klrj03mh", "title": "Test Ticket 1785491848033", "number": 25, "status": "CLOSED", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": "2026-08-01T16:51:35.153Z", "priority": "MEDIUM", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-07-31T09:57:28.650Z", "projectId": "cms8r938j000iijcjv4rbtr4o", "updatedAt": "2026-08-01T16:51:37.550Z", "categoryId": null, "resolvedAt": "2026-08-01T16:51:32.429Z", "description": "This is a test description with more than 10 chars", "assignedToId": null, "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-08-01 16:51:37.731
cmsam0hci0006ijdwacw7wk8f	Ticket	cms8rbhlq0012ijnt2eru7kf4	TICKET_COMMENT_ADDED	cms8r925a0004ijcjjy1w8w4t	null	{"commentId": "cmsam0gmz0005ijdwr0oeifus"}	2026-08-01 16:52:31.315
cmsam0yg30007ijdws1ybg6g6	Ticket	cms8rbhlq0012ijnt2eru7kf4	TICKET_UPDATED	cms8r925a0004ijcjjy1w8w4t	{"status": "RESOLVED"}	{"id": "cms8rbhlq0012ijnt2eru7kf4", "title": "Export to CSV fails for large datasets", "number": 2, "status": "RESOLVED", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "URGENT", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-07-31T08:46:05.607Z", "projectId": "cms8r938k000lijcjnqxqie25", "updatedAt": "2026-08-01T16:52:53.197Z", "categoryId": null, "resolvedAt": "2026-08-01T16:52:53.194Z", "description": "Detailed description for: Export to CSV fails for large datasets. This is a production issue that needs attention.", "assignedToId": "cms8r925t0006ijcj6sny475l", "reportedById": "cms8r925a0004ijcjjy1w8w4t"}	2026-08-01 16:52:53.475
cmsam17dl0008ijdwndpksxkd	Ticket	cms8rbhlq0012ijnt2eru7kf4	TICKET_UPDATED	cms8r925a0004ijcjjy1w8w4t	{"status": "OPEN"}	{"id": "cms8rbhlq0012ijnt2eru7kf4", "title": "Export to CSV fails for large datasets", "number": 2, "status": "OPEN", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "URGENT", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-07-31T08:46:05.607Z", "projectId": "cms8r938k000lijcjnqxqie25", "updatedAt": "2026-08-01T16:53:04.967Z", "categoryId": null, "resolvedAt": "2026-08-01T16:52:53.194Z", "description": "Detailed description for: Export to CSV fails for large datasets. This is a production issue that needs attention.", "assignedToId": "cms8r925t0006ijcj6sny475l", "reportedById": "cms8r925a0004ijcjjy1w8w4t"}	2026-08-01 16:53:05.049
cmsamagrt0009ijdw3qp5v253	Ticket	cms8rbhlq0012ijnt2eru7kf4	TICKET_UPDATED	cms8r925a0004ijcjjy1w8w4t	{"status": "IN_PROGRESS"}	{"id": "cms8rbhlq0012ijnt2eru7kf4", "title": "Export to CSV fails for large datasets", "number": 2, "status": "IN_PROGRESS", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "URGENT", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-07-31T08:46:05.607Z", "projectId": "cms8r938k000lijcjnqxqie25", "updatedAt": "2026-08-01T17:00:16.817Z", "categoryId": null, "resolvedAt": "2026-08-01T16:52:53.194Z", "description": "Detailed description for: Export to CSV fails for large datasets. This is a production issue that needs attention.", "assignedToId": "cms8r925t0006ijcj6sny475l", "reportedById": "cms8r925a0004ijcjjy1w8w4t"}	2026-08-01 17:00:17.129
cmsane65z000cijdw2nami4i7	Ticket	cms8rbhlq0012ijnt2eru7kf4	TICKET_COMMENT_ADDED	cms8r925a0004ijcjjy1w8w4t	null	{"commentId": "cmsane5l8000bijdw9h8gzik4"}	2026-08-01 17:31:09.624
cmsao8n67000dijdwxafs7bfa	Ticket	cms8rbhlq0012ijnt2eru7kf4	TICKET_UPDATED	cms8r925a0004ijcjjy1w8w4t	{"status": "RESOLVED"}	{"id": "cms8rbhlq0012ijnt2eru7kf4", "title": "Export to CSV fails for large datasets", "number": 2, "status": "RESOLVED", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "URGENT", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-07-31T08:46:05.607Z", "projectId": "cms8r938k000lijcjnqxqie25", "updatedAt": "2026-08-01T17:54:51.066Z", "categoryId": null, "resolvedAt": "2026-08-01T17:54:51.063Z", "description": "Detailed description for: Export to CSV fails for large datasets. This is a production issue that needs attention.", "assignedToId": "cms8r925t0006ijcj6sny475l", "reportedById": "cms8r925a0004ijcjjy1w8w4t"}	2026-08-01 17:54:51.344
cmsboi1j70004ijrd08fp77pe	Client	cmsboi0ut0001ijrdt9v7gcpg	CLIENT_ONBOARDED	cms8r925a0004ijcjjy1w8w4t	null	{"id": "cmsboi0ut0001ijrdt9v7gcpg", "code": "martit", "name": "microsoft", "email": "shreyaspoojari6@gmail.com", "notes": null, "phone": null, "status": "PENDING_ACTIVATION", "address": "3rd cross,Gayatrinagar\\nBengaluru", "website": null, "industry": "d", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-08-02T10:49:55.157Z", "deletedAt": null, "updatedAt": "2026-08-02T10:49:55.157Z", "contactName": "Shreyas Ananda Poojary", "createdById": "cms8r925a0004ijcjjy1w8w4t", "updatedById": "cms8r925a0004ijcjjy1w8w4t"}	2026-08-02 10:49:56.036
cmsboi1rh0005ijrdjw2vz9os	Project	cmsboi1bw0003ijrd2mgocoi2	PROJECT_CREATED	cms8r925a0004ijcjjy1w8w4t	null	{"id": "cmsboi1bw0003ijrd2mgocoi2", "code": "WEB", "name": "website redesign", "color": null, "status": "ACTIVE", "clientId": "cmsboi0ut0001ijrdt9v7gcpg", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-08-02T10:49:55.772Z", "updatedAt": "2026-08-02T10:49:55.772Z", "archivedAt": null, "createdById": "cms8r925a0004ijcjjy1w8w4t", "description": null, "updatedById": "cms8r925a0004ijcjjy1w8w4t", "supportEmail": null, "supportNotes": null, "supportPhone": null, "supportStatus": "ENABLED", "supportEndDate": null, "defaultPriority": "MEDIUM", "supportStartDate": null}	2026-08-02 10:49:56.333
cmsbp2snn000cijrd6ggno3k9	Client	cmsbp2s4p0009ijrdfmg82xdy	CLIENT_ONBOARDED	cms8r925a0004ijcjjy1w8w4t	null	{"id": "cmsbp2s4p0009ijrdfmg82xdy", "code": "martit", "name": "martit", "email": "s6361915763@gmail.com", "notes": null, "phone": null, "status": "PENDING_ACTIVATION", "address": "3rd cross,Gayatrinagar\\nBengaluru", "website": null, "industry": null, "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-08-02T11:06:03.625Z", "deletedAt": null, "updatedAt": "2026-08-02T11:06:03.625Z", "contactName": "Shreyas Ananda Poojary", "createdById": "cms8r925a0004ijcjjy1w8w4t", "updatedById": "cms8r925a0004ijcjjy1w8w4t"}	2026-08-02 11:06:04.308
cmsbp2stp000dijrdgfe1m3oq	Project	cmsbp2sg1000bijrde2x0qizw	PROJECT_CREATED	cms8r925a0004ijcjjy1w8w4t	null	{"id": "cmsbp2sg1000bijrde2x0qizw", "code": null, "name": "jfghjhgfghjhgfghjg", "color": null, "status": "ACTIVE", "clientId": "cmsbp2s4p0009ijrdfmg82xdy", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-08-02T11:06:04.034Z", "updatedAt": "2026-08-02T11:06:04.034Z", "archivedAt": null, "createdById": "cms8r925a0004ijcjjy1w8w4t", "description": "mjhgfghjklkjhgfdfghjkjhgfgh", "updatedById": "cms8r925a0004ijcjjy1w8w4t", "supportEmail": null, "supportNotes": null, "supportPhone": null, "supportStatus": "ENABLED", "supportEndDate": null, "defaultPriority": "MEDIUM", "supportStartDate": null}	2026-08-02 11:06:04.525
cmsbq8ip10009iju6rdnf6q23	Project	cmsbq8if60007iju6hvenr2dn	PROJECT_CREATED	cms8r925a0004ijcjjy1w8w4t	null	{"id": "cmsbq8if60007iju6hvenr2dn", "code": null, "name": "dfghmnbvcxcvb", "color": null, "status": "ACTIVE", "clientId": "cmsbq8i5o0005iju6jloyfdet", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-08-02T11:38:30.594Z", "updatedAt": "2026-08-02T11:38:30.594Z", "archivedAt": null, "createdById": "cms8r925a0004ijcjjy1w8w4t", "description": "gfdsdfgmnbvcxcvbnmnbvc", "updatedById": "cms8r925a0004ijcjjy1w8w4t", "supportEmail": null, "supportNotes": null, "supportPhone": null, "supportStatus": "ENABLED", "supportEndDate": null, "defaultPriority": "MEDIUM", "supportStartDate": null}	2026-08-02 11:38:30.949
cmsbqagi8000eiju66p61k512	Client	cmsbqag1x000biju6a1yq0zh9	CLIENT_ONBOARDED	cms8r925a0004ijcjjy1w8w4t	null	{"id": "cmsbqag1x000biju6a1yq0zh9", "code": "cscscscd", "name": "xanxjcnsjcnsj", "email": "1by23is202@bmsit.in", "notes": null, "phone": null, "status": "PENDING_ACTIVATION", "address": "cxccxccc", "website": null, "industry": "cxcxcxcx", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-08-02T11:40:00.837Z", "deletedAt": null, "updatedAt": "2026-08-02T11:40:00.837Z", "contactName": "cdccdc", "createdById": "cms8r925a0004ijcjjy1w8w4t", "updatedById": "cms8r925a0004ijcjjy1w8w4t"}	2026-08-02 11:40:01.425
cmsbqagom000fiju6rjg8rqr3	Project	cmsbqagbd000diju63xghbbcl	PROJECT_CREATED	cms8r925a0004ijcjjy1w8w4t	null	{"id": "cmsbqagbd000diju63xghbbcl", "code": null, "name": "ccccccccc", "color": null, "status": "ACTIVE", "clientId": "cmsbqag1x000biju6a1yq0zh9", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-08-02T11:40:01.177Z", "updatedAt": "2026-08-02T11:40:01.177Z", "archivedAt": null, "createdById": "cms8r925a0004ijcjjy1w8w4t", "description": "ccccccc", "updatedById": "cms8r925a0004ijcjjy1w8w4t", "supportEmail": null, "supportNotes": null, "supportPhone": null, "supportStatus": "ENABLED", "supportEndDate": null, "defaultPriority": "MEDIUM", "supportStartDate": null}	2026-08-02 11:40:01.654
cmsczd4vs0004kz04k8y404d2	Ticket	cmsczd3by0001kz048dx0c47r	TICKET_CREATED	cms8r92zm000eijcj48pzmyhn	null	{"id": "cmsczd3by0001kz048dx0c47r", "title": "fix login issue in client dashboard", "number": 29, "status": "OPEN", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "MEDIUM", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-08-03T08:41:47.038Z", "projectId": "cms8r938k000mijcj02p1hem5", "updatedAt": "2026-08-03T08:41:47.038Z", "categoryId": null, "resolvedAt": null, "description": "fghjhgfdfghjhgfdjkjhgffghjkjhgfhjkjhgfd", "assignedToId": null, "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-08-03 08:41:49.048
cmsd2812j0004js048096fjz4	Ticket	cmsd27ynb0001js045q95n0hg	TICKET_CREATED	cms8r92zm000eijcj48pzmyhn	null	{"id": "cmsd27ynb0001js045q95n0hg", "title": "dfghj,.,mnbvcxzxcvbn", "number": 30, "status": "OPEN", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "MEDIUM", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-08-03T10:01:46.535Z", "projectId": "cms8r938j000iijcjv4rbtr4o", "updatedAt": "2026-08-03T10:01:46.535Z", "categoryId": null, "resolvedAt": null, "description": "vbnmnbvcxzxcvbnmnbvc", "assignedToId": null, "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-08-03 10:01:49.675
cmsd4cmi10006ij6ahovsy8g4	Ticket	cmsd4cm7a0003ij6axkixsfno	TICKET_CREATED	cms8r92zm000eijcj48pzmyhn	null	{"id": "cmsd4cm7a0003ij6axkixsfno", "title": "sbnm,mnbvcxz", "number": 31, "status": "OPEN", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "MEDIUM", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-08-03T11:01:22.918Z", "projectId": "cms8r938k000lijcjnqxqie25", "updatedAt": "2026-08-03T11:01:22.918Z", "categoryId": null, "resolvedAt": null, "description": "sdfm,mnbvc", "assignedToId": null, "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-08-03 11:01:23.306
cmsd4iesb000bij6a4peemqtv	Ticket	cmsd4ieh50008ij6aesp4pj95	TICKET_CREATED	cms8r92zm000eijcj48pzmyhn	null	{"id": "cmsd4ieh50008ij6aesp4pj95", "title": "jhgfdfghjkjhgfd", "number": 32, "status": "OPEN", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "MEDIUM", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-08-03T11:05:52.841Z", "projectId": "cms8r938j000iijcjv4rbtr4o", "updatedAt": "2026-08-03T11:05:52.841Z", "categoryId": null, "resolvedAt": null, "description": "kjhgfdsdfghjk,.,mnbvc", "assignedToId": null, "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-08-03 11:05:53.243
cmsd7nzen0004jw04pecon838	Ticket	cmsd7nx2g0001jw04k7pvfpaf	TICKET_CREATED	cms8r92zm000eijcj48pzmyhn	null	{"id": "cmsd7nx2g0001jw04k7pvfpaf", "title": "jhgfdfghjkjh", "number": 33, "status": "OPEN", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "MEDIUM", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-08-03T12:34:09.065Z", "projectId": "cms8r938j000iijcjv4rbtr4o", "updatedAt": "2026-08-03T12:34:09.065Z", "categoryId": null, "resolvedAt": null, "description": "mjhgfdfghjhgf", "assignedToId": null, "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-08-03 12:34:12.096
cmsd7z05o0002i504k39erhof	Project	cmsbqagbd000diju63xghbbcl	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-03 12:42:46.285
cmse953dk0002l404twrd3crw	USER	cmsboi1wh0007ijrd99lc9xzy	PASSWORD_RESET_REQUESTED	cmsboi1wh0007ijrd99lc9xzy	null	null	2026-08-04 06:03:16.185
cmse95lhy0005l404qg51bm6w	USER	cmsbqags9000hiju6ggzv4kda	PASSWORD_RESET_REQUESTED	cmsbqags9000hiju6ggzv4kda	null	null	2026-08-04 06:03:39.67
cmse9i03p0002l804ih63s1hs	USER	cmsboi1wh0007ijrd99lc9xzy	PASSWORD_RESET_REQUESTED	cmsboi1wh0007ijrd99lc9xzy	null	null	2026-08-04 06:13:18.47
cmse9mcee0000l4042zcy29zs	Project	cms8r938k000mijcj02p1hem5	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 06:16:41.031
cmse9qiql000fl404kk6ki6y6	Tenant	cmse9qikk000el404q6bqcmpm	Created	cms8r925z0008ijcjup5f0y2u	null	{"id": "cmse9qikk000el404q6bqcmpm", "name": "shreyas", "slug": "shreyas", "domain": null, "status": "PENDING_ACTIVATION", "currency": "USD", "timezone": "UTC", "createdAt": "2026-08-04T06:19:55.652Z", "createdBy": "cms8r925z0008ijcjup5f0y2u", "deletedAt": null, "updatedAt": "2026-08-04T06:19:55.652Z", "updatedBy": "cms8r925z0008ijcjup5f0y2u", "contactEmail": "shreyaspoojari6@gmail.com", "contactPhone": null}	2026-08-04 06:19:55.869
cmse9qj8o000il404lhwou85s	User	cmse9qiwm000hl404gsngawxi	Created	cms8r925z0008ijcjup5f0y2u	null	{"id": "cmse9qiwm000hl404gsngawxi", "role": "TENANT_ADMIN", "email": "anibhai619@gmail.com", "status": "ACTIVE", "clientId": null, "lastName": "Ananda Poojary", "password": "9b96057ea03452b2a02a92bb4a3f70e5", "tenantId": "cmse9qikk000el404q6bqcmpm", "avatarUrl": null, "createdAt": "2026-08-04T06:19:56.086Z", "createdBy": "cms8r925z0008ijcjup5f0y2u", "deletedAt": null, "firstName": "Shreyas", "invitedAt": null, "updatedAt": "2026-08-04T06:19:56.086Z", "updatedBy": "cms8r925z0008ijcjup5f0y2u", "activatedAt": null, "mustChangePassword": false, "invitationExpiresAt": null, "invitationTokenHash": null}	2026-08-04 06:19:56.521
cmse9qkez000pl404yi1mb1ix	SLAPolicy	cmse9qjky000kl404hqlsjkee	SLA_CREATED	cms8r925z0008ijcjup5f0y2u	null	{"id": "cmse9qjky000kl404hqlsjkee", "tiers": [{"id": "cmse9qjky000ll404svf23upq", "policyId": "cmse9qjky000kl404hqlsjkee", "priority": "LOW", "createdAt": "2026-08-04T06:19:56.963Z", "updatedAt": "2026-08-04T06:19:56.963Z", "responseTimeMinutes": 480, "resolutionTimeMinutes": 5760}, {"id": "cmse9qjky000ml4045mrubufs", "policyId": "cmse9qjky000kl404hqlsjkee", "priority": "MEDIUM", "createdAt": "2026-08-04T06:19:56.963Z", "updatedAt": "2026-08-04T06:19:56.963Z", "responseTimeMinutes": 240, "resolutionTimeMinutes": 2880}, {"id": "cmse9qjky000nl4042ngapds8", "policyId": "cmse9qjky000kl404hqlsjkee", "priority": "HIGH", "createdAt": "2026-08-04T06:19:56.963Z", "updatedAt": "2026-08-04T06:19:56.963Z", "responseTimeMinutes": 120, "resolutionTimeMinutes": 1440}, {"id": "cmse9qjky000ol4041dp0k8ax", "policyId": "cmse9qjky000kl404hqlsjkee", "priority": "URGENT", "createdAt": "2026-08-04T06:19:56.963Z", "updatedAt": "2026-08-04T06:19:56.963Z", "responseTimeMinutes": 30, "resolutionTimeMinutes": 480}], "tenantId": "cmse9qikk000el404q6bqcmpm", "createdAt": "2026-08-04T06:19:56.963Z", "updatedAt": "2026-08-04T06:19:56.963Z", "businessHoursEnabled": true}	2026-08-04 06:19:58.043
cmse9s0om0007l80455nm3rjl	Project	cmse9s0by0006l804d01zq499	PROJECT_CREATED	cms8r925a0004ijcjjy1w8w4t	null	{"id": "cmse9s0by0006l804d01zq499", "code": "001", "name": "Ellipsonic", "color": null, "status": "ACTIVE", "clientId": "cms8r92j9000cijcjl6i2t3xt", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-08-04T06:21:05.326Z", "updatedAt": "2026-08-04T06:21:05.326Z", "archivedAt": null, "createdById": "cms8r925a0004ijcjjy1w8w4t", "description": null, "updatedById": "cms8r925a0004ijcjjy1w8w4t", "supportEmail": null, "supportNotes": null, "supportPhone": null, "supportStatus": "ENABLED", "supportEndDate": null, "defaultPriority": "MEDIUM", "supportStartDate": null}	2026-08-04 06:21:05.782
cmse9u0om0008l804midlq1vf	SLAPolicy	cms8rbgh9000oijntd5hipmrt	SLA_UPDATED	cms8r925a0004ijcjjy1w8w4t	{"id": "cms8rbgha000pijnt59vpfwab", "policyId": "cms8rbgh9000oijntd5hipmrt", "priority": "LOW", "createdAt": "2026-07-31T09:45:29.134Z", "updatedAt": "2026-07-31T09:45:29.134Z", "responseTimeMinutes": 480, "resolutionTimeMinutes": 5760}	{"id": "cms8rbgha000pijnt59vpfwab", "policyId": "cms8rbgh9000oijntd5hipmrt", "priority": "LOW", "createdAt": "2026-07-31T09:45:29.134Z", "updatedAt": "2026-08-04T06:22:38.680Z", "responseTimeMinutes": 480, "resolutionTimeMinutes": 5700}	2026-08-04 06:22:39.095
cmse9uoqp000al804jl5jo1x3	Tenant	cmse9uoe30009l8043q8lats1	Created	cms8r925z0008ijcjup5f0y2u	null	{"id": "cmse9uoe30009l8043q8lats1", "name": "zoho", "slug": "zoho", "domain": null, "status": "PENDING_ACTIVATION", "currency": "USD", "timezone": "UTC", "createdAt": "2026-08-04T06:23:09.819Z", "createdBy": "cms8r925z0008ijcjup5f0y2u", "deletedAt": null, "updatedAt": "2026-08-04T06:23:09.819Z", "updatedBy": "cms8r925z0008ijcjup5f0y2u", "contactEmail": "admin@zoho.com", "contactPhone": null}	2026-08-04 06:23:10.273
cmse9upma000dl804ul68m25q	User	cmse9uox1000cl804kqmf8shd	Created	cms8r925z0008ijcjup5f0y2u	null	{"id": "cmse9uox1000cl804kqmf8shd", "role": "TENANT_ADMIN", "email": "shreyas9512005@gmail.com", "status": "ACTIVE", "clientId": null, "lastName": "D", "password": "57a6c39a3583789cd51b69bbe28fe856", "tenantId": "cmse9uoe30009l8043q8lats1", "avatarUrl": null, "createdAt": "2026-08-04T06:23:10.501Z", "createdBy": "cms8r925z0008ijcjup5f0y2u", "deletedAt": null, "firstName": "jane", "invitedAt": null, "updatedAt": "2026-08-04T06:23:10.501Z", "updatedBy": "cms8r925z0008ijcjup5f0y2u", "activatedAt": null, "mustChangePassword": false, "invitationExpiresAt": null, "invitationTokenHash": null}	2026-08-04 06:23:11.41
cmse9urjd000kl8041q82kr5r	SLAPolicy	cmse9uq4z000fl804nvizj9s2	SLA_CREATED	cms8r925z0008ijcjup5f0y2u	null	{"id": "cmse9uq4z000fl804nvizj9s2", "tiers": [{"id": "cmse9uq4z000gl804zo4sav5d", "policyId": "cmse9uq4z000fl804nvizj9s2", "priority": "LOW", "createdAt": "2026-08-04T06:23:12.084Z", "updatedAt": "2026-08-04T06:23:12.084Z", "responseTimeMinutes": 480, "resolutionTimeMinutes": 5760}, {"id": "cmse9uq4z000hl804c7xx8ncu", "policyId": "cmse9uq4z000fl804nvizj9s2", "priority": "MEDIUM", "createdAt": "2026-08-04T06:23:12.084Z", "updatedAt": "2026-08-04T06:23:12.084Z", "responseTimeMinutes": 240, "resolutionTimeMinutes": 2880}, {"id": "cmse9uq4z000il804tjsrv3ns", "policyId": "cmse9uq4z000fl804nvizj9s2", "priority": "HIGH", "createdAt": "2026-08-04T06:23:12.084Z", "updatedAt": "2026-08-04T06:23:12.084Z", "responseTimeMinutes": 120, "resolutionTimeMinutes": 1440}, {"id": "cmse9uq50000jl8040ng5n7ce", "policyId": "cmse9uq4z000fl804nvizj9s2", "priority": "URGENT", "createdAt": "2026-08-04T06:23:12.084Z", "updatedAt": "2026-08-04T06:23:12.084Z", "responseTimeMinutes": 30, "resolutionTimeMinutes": 480}], "tenantId": "cmse9uoe30009l8043q8lats1", "createdAt": "2026-08-04T06:23:12.084Z", "updatedAt": "2026-08-04T06:23:12.084Z", "businessHoursEnabled": true}	2026-08-04 06:23:13.897
cmsea1lwb0000i904vh5kv9ag	Ticket	cms8ue3to000fijcq3cftl3mh	TICKET_UPDATED	cms8r91xj0002ijcjijcbf0gt	{"status": "OPEN"}	{"id": "cms8ue3to000fijcq3cftl3mh", "title": "nbvchgfdfghgf", "number": 27, "status": "OPEN", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "MEDIUM", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-07-31T11:11:31.548Z", "projectId": "cms8r938j000jijcj79u0p9pb", "updatedAt": "2026-08-04T06:28:32.746Z", "categoryId": null, "resolvedAt": null, "description": "jhgfghgfddfgfdsdfg", "assignedToId": "cms8r91xj0002ijcjijcbf0gt", "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-08-04 06:28:33.179
cmsea1r9g000ll804gn4jqzyw	Ticket	cms8ue3to000fijcq3cftl3mh	TICKET_UPDATED	cms8r91xj0002ijcjijcbf0gt	{"priority": "HIGH"}	{"id": "cms8ue3to000fijcq3cftl3mh", "title": "nbvchgfdfghgf", "number": 27, "status": "OPEN", "clientId": "cms8r92j9000cijcjl6i2t3xt", "closedAt": null, "priority": "HIGH", "tenantId": "cms8r91bn0000ijcjsr0zc6lu", "createdAt": "2026-07-31T11:11:31.548Z", "projectId": "cms8r938j000jijcj79u0p9pb", "updatedAt": "2026-08-04T06:28:39.686Z", "categoryId": null, "resolvedAt": null, "description": "jhgfghgfddfgfdsdfg", "assignedToId": "cms8r91xj0002ijcjijcbf0gt", "reportedById": "cms8r92zm000eijcj48pzmyhn"}	2026-08-04 06:28:40.133
cmsebl50n0004ijuzc1iimx2l	Project	cmsbqagbd000diju63xghbbcl	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 07:11:44.04
cmsebtyty0005ijuz4wlxlzj0	Project	cmse9s0by0006l804d01zq499	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 07:18:35.927
cmsebvyvn0006ijuzdn6yggtc	Project	cmsbqagbd000diju63xghbbcl	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 07:20:09.299
cmsec1h760007ijuzko89cnh5	Project	cmsbqagbd000diju63xghbbcl	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 07:24:26.323
cmsec5yno0008ijuz94981thr	Project	cmsbqagbd000diju63xghbbcl	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 07:27:55.573
cmsecom0s0009ijuzpx0faujt	Project	cmsbp2sg1000bijrde2x0qizw	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 07:42:25.66
cmsecoopu000aijuzhwrnar8n	Project	cmsboi1bw0003ijrd2mgocoi2	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 07:42:29.154
cmsecopkr000bijuzr8oqmcbr	Project	cmsa89t4d0001ijpjoxjy6hxe	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 07:42:30.267
cmsecorkp000cijuzti59w8s2	Project	cmse9s0by0006l804d01zq499	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 07:42:32.858
cmsed5v1z000dijuzl5lere9l	Project	cmsbqagbd000diju63xghbbcl	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 07:55:50.519
cmsed5vpw000eijuzb44frrwv	Project	cmse9s0by0006l804d01zq499	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 07:55:51.38
cmsee2ndb000fijuz9ijese5l	Project	cmse9s0by0006l804d01zq499	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 08:21:20.208
cmsee3fuf000gijuzhy6c6kwb	Project	cmsbqagbd000diju63xghbbcl	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 08:21:57.112
cmsee3hng000hijuzh2am3mqx	Project	cmsbq8if60007iju6hvenr2dn	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 08:21:59.453
cmsee3kov000iijuzocvje2px	Project	cmsbp2sg1000bijrde2x0qizw	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 08:22:03.392
cmsee3m40000jijuze81rb34f	Project	cmsboi1bw0003ijrd2mgocoi2	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 08:22:05.233
cmsee3o4s000kijuznfompgdm	Project	cmsa89t4d0001ijpjoxjy6hxe	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 08:22:07.853
cmseejxs1000lijuzthuzcscw	Project	cmse9s0by0006l804d01zq499	PROJECT_VIEWED	cms8r925a0004ijcjjy1w8w4t	null	null	2026-08-04 08:34:46.85
\.


--
-- Data for Name: BusinessHours; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BusinessHours" (id, "projectId", "tenantId", "dayOfWeek", "isOpen", "startTime", "endTime", timezone) FROM stdin;
\.


--
-- Data for Name: Client; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Client" (id, "tenantId", name, code, email, phone, industry, website, "contactName", address, notes, status, "createdAt", "updatedAt", "createdById", "updatedById", "deletedAt") FROM stdin;
cms8r92j9000cijcjl6i2t3xt	cms8r91bn0000ijcjsr0zc6lu	Acme Corporation	ACME	contact@acme.com	+91-9876543210	\N	\N	Priya Sharma	\N	\N	ACTIVE	2026-07-31 09:43:37.749	2026-07-31 09:43:37.749	\N	\N	\N
cmsboi0ut0001ijrdt9v7gcpg	cms8r91bn0000ijcjsr0zc6lu	microsoft	martit	shreyaspoojari6@gmail.com	\N	d	\N	Shreyas Ananda Poojary	3rd cross,Gayatrinagar\nBengaluru	\N	PENDING_ACTIVATION	2026-08-02 10:49:55.157	2026-08-02 10:49:55.157	cms8r925a0004ijcjjy1w8w4t	cms8r925a0004ijcjjy1w8w4t	\N
cmsbp2s4p0009ijrdfmg82xdy	cms8r91bn0000ijcjsr0zc6lu	martit	martit	s6361915763@gmail.com	\N	\N	\N	Shreyas Ananda Poojary	3rd cross,Gayatrinagar\nBengaluru	\N	PENDING_ACTIVATION	2026-08-02 11:06:03.625	2026-08-02 11:06:03.625	cms8r925a0004ijcjjy1w8w4t	cms8r925a0004ijcjjy1w8w4t	\N
cmsbq8i5o0005iju6jloyfdet	cms8r91bn0000ijcjsr0zc6lu	fnmndbdmjhgf	\N	\N	\N	\N	\N	\N	\N	\N	ACTIVE	2026-08-02 11:38:30.252	2026-08-02 11:38:30.252	cms8r925a0004ijcjjy1w8w4t	cms8r925a0004ijcjjy1w8w4t	\N
cmsbqag1x000biju6a1yq0zh9	cms8r91bn0000ijcjsr0zc6lu	xanxjcnsjcnsj	cscscscd	1by23is202@bmsit.in	\N	cxcxcxcx	\N	cdccdc	cxccxccc	\N	PENDING_ACTIVATION	2026-08-02 11:40:00.837	2026-08-02 11:40:00.837	cms8r925a0004ijcjjy1w8w4t	cms8r925a0004ijcjjy1w8w4t	\N
\.


--
-- Data for Name: Holiday; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Holiday" (id, "projectId", "tenantId", name, "holidayDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Notification" (id, "tenantId", "userId", "ticketId", title, message, "isRead", "readAt", "createdAt") FROM stdin;
cms8rbrlr006uijntx5iwl27t	cms8r91bn0000ijcjsr0zc6lu	cms8r92zm000eijcj48pzmyhn	\N	Ticket #2 updated	CSV export ticket is now In Progress.	t	2026-08-03 08:44:20.118	2026-07-31 09:45:43.551
cms8rbrnc006wijntsqk588co	cms8r91bn0000ijcjsr0zc6lu	cms8r92zm000eijcj48pzmyhn	\N	New comment on Ticket #8	Sarah Wilson left a comment on your contact form ticket.	t	2026-08-03 08:44:20.118	2026-07-31 09:45:43.551
cms8rbrnh006yijntnd2nw5gk	cms8r91bn0000ijcjsr0zc6lu	cms8r92zm000eijcj48pzmyhn	\N	SLA Warning on Ticket #13	OAuth token refresh ticket is approaching SLA breach.	t	2026-08-03 08:44:20.118	2026-07-31 09:45:43.551
\.


--
-- Data for Name: PasswordResetToken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PasswordResetToken" (id, "userId", "tokenHash", "expiresAt", "createdAt") FROM stdin;
cmse952gg0001l404uux4y1b1	cmsboi1wh0007ijrd99lc9xzy	0af49a22fae0b708aa20130ba412a88f8c39f9e9fa478c7b46de49378618a3b5	2026-08-04 06:18:14.992	2026-08-04 06:03:14.992
cmse95ks20004l4043jovn2ph	cmsbqags9000hiju6ggzv4kda	aac6ccf7bc0fd8a1c9a0fbfddba6798e78741430e92566e0921f942a88811e19	2026-08-04 06:18:38.738	2026-08-04 06:03:38.739
cmse9hz670001l804jjsczm07	cmsboi1wh0007ijrd99lc9xzy	194fd91b4d4cc225a3dcbadd40f48a678f3c55cf14dd6c24221012362058e95c	2026-08-04 06:28:17.263	2026-08-04 06:13:17.264
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Project" (id, "tenantId", "clientId", name, code, description, color, status, "supportStatus", "defaultPriority", "supportEmail", "supportPhone", "supportNotes", "supportStartDate", "supportEndDate", "createdAt", "updatedAt", "archivedAt", "createdById", "updatedById") FROM stdin;
cms8r938j000jijcj79u0p9pb	cms8r91bn0000ijcjsr0zc6lu	cms8r92j9000cijcjl6i2t3xt	Website Redesign	WEB	\N	#8b5cf6	ACTIVE	ENABLED	MEDIUM	\N	\N	\N	\N	\N	2026-07-31 09:43:38.66	2026-07-31 09:43:38.66	\N	\N	\N
cms8r938j000iijcjv4rbtr4o	cms8r91bn0000ijcjsr0zc6lu	cms8r92j9000cijcjl6i2t3xt	API Integration	API	\N	#10b981	ACTIVE	ENABLED	MEDIUM	\N	\N	\N	\N	\N	2026-07-31 09:43:38.66	2026-07-31 09:43:38.66	\N	\N	\N
cms8r938k000mijcj02p1hem5	cms8r91bn0000ijcjsr0zc6lu	cms8r92j9000cijcjl6i2t3xt	Mobile App	MOB	\N	#f59e0b	ACTIVE	ENABLED	MEDIUM	\N	\N	\N	\N	\N	2026-07-31 09:43:38.66	2026-07-31 09:43:38.66	\N	\N	\N
cms8r938k000lijcjnqxqie25	cms8r91bn0000ijcjsr0zc6lu	cms8r92j9000cijcjl6i2t3xt	CRM Portal	CRM	\N	#6366f1	ACTIVE	ENABLED	MEDIUM	\N	\N	\N	\N	\N	2026-07-31 09:43:38.66	2026-07-31 09:43:38.66	\N	\N	\N
cmsa89t4d0001ijpjoxjy6hxe	cms8r91bn0000ijcjsr0zc6lu	cms8r92j9000cijcjl6i2t3xt	xcvbvc	cx	xzxcx	\N	ACTIVE	ENABLED	MEDIUM	\N	\N	\N	\N	\N	2026-08-01 10:27:51.853	2026-08-01 10:27:51.853	\N	cms8r925a0004ijcjjy1w8w4t	cms8r925a0004ijcjjy1w8w4t
cmsboi1bw0003ijrd2mgocoi2	cms8r91bn0000ijcjsr0zc6lu	cmsboi0ut0001ijrdt9v7gcpg	website redesign	WEB	\N	\N	ACTIVE	ENABLED	MEDIUM	\N	\N	\N	\N	\N	2026-08-02 10:49:55.772	2026-08-02 10:49:55.772	\N	cms8r925a0004ijcjjy1w8w4t	cms8r925a0004ijcjjy1w8w4t
cmsbp2sg1000bijrde2x0qizw	cms8r91bn0000ijcjsr0zc6lu	cmsbp2s4p0009ijrdfmg82xdy	jfghjhgfghjhgfghjg	\N	mjhgfghjklkjhgfdfghjkjhgfgh	\N	ACTIVE	ENABLED	MEDIUM	\N	\N	\N	\N	\N	2026-08-02 11:06:04.034	2026-08-02 11:06:04.034	\N	cms8r925a0004ijcjjy1w8w4t	cms8r925a0004ijcjjy1w8w4t
cmsbq8if60007iju6hvenr2dn	cms8r91bn0000ijcjsr0zc6lu	cmsbq8i5o0005iju6jloyfdet	dfghmnbvcxcvb	\N	gfdsdfgmnbvcxcvbnmnbvc	\N	ACTIVE	ENABLED	MEDIUM	\N	\N	\N	\N	\N	2026-08-02 11:38:30.594	2026-08-02 11:38:30.594	\N	cms8r925a0004ijcjjy1w8w4t	cms8r925a0004ijcjjy1w8w4t
cmsbqagbd000diju63xghbbcl	cms8r91bn0000ijcjsr0zc6lu	cmsbqag1x000biju6a1yq0zh9	ccccccccc	\N	ccccccc	\N	ACTIVE	ENABLED	MEDIUM	\N	\N	\N	\N	\N	2026-08-02 11:40:01.177	2026-08-02 11:40:01.177	\N	cms8r925a0004ijcjjy1w8w4t	cms8r925a0004ijcjjy1w8w4t
cmse9s0by0006l804d01zq499	cms8r91bn0000ijcjsr0zc6lu	cms8r92j9000cijcjl6i2t3xt	Ellipsonic	001	\N	\N	ACTIVE	ENABLED	MEDIUM	\N	\N	\N	\N	\N	2026-08-04 06:21:05.326	2026-08-04 06:21:05.326	\N	cms8r925a0004ijcjjy1w8w4t	cms8r925a0004ijcjjy1w8w4t
\.


--
-- Data for Name: SLAPolicy; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SLAPolicy" (id, "tenantId", "businessHoursEnabled", "createdAt", "updatedAt") FROM stdin;
cms8rbgh9000oijntd5hipmrt	cms8r91bn0000ijcjsr0zc6lu	t	2026-07-31 09:45:29.134	2026-07-31 09:45:29.134
cmse9qjky000kl404hqlsjkee	cmse9qikk000el404q6bqcmpm	t	2026-08-04 06:19:56.963	2026-08-04 06:19:56.963
cmse9uq4z000fl804nvizj9s2	cmse9uoe30009l8043q8lats1	t	2026-08-04 06:23:12.084	2026-08-04 06:23:12.084
\.


--
-- Data for Name: SLATier; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SLATier" (id, "policyId", priority, "responseTimeMinutes", "resolutionTimeMinutes", "createdAt", "updatedAt") FROM stdin;
cms8rbgha000qijntz51a52uk	cms8rbgh9000oijntd5hipmrt	MEDIUM	240	2880	2026-07-31 09:45:29.134	2026-07-31 09:45:29.134
cms8rbgha000rijntwt2mcqn8	cms8rbgh9000oijntd5hipmrt	HIGH	120	1440	2026-07-31 09:45:29.134	2026-07-31 09:45:29.134
cms8rbgha000sijnt1mjjlvvt	cms8rbgh9000oijntd5hipmrt	URGENT	30	480	2026-07-31 09:45:29.134	2026-07-31 10:02:58.241
cmse9qjky000ll404svf23upq	cmse9qjky000kl404hqlsjkee	LOW	480	5760	2026-08-04 06:19:56.963	2026-08-04 06:19:56.963
cmse9qjky000ml4045mrubufs	cmse9qjky000kl404hqlsjkee	MEDIUM	240	2880	2026-08-04 06:19:56.963	2026-08-04 06:19:56.963
cmse9qjky000nl4042ngapds8	cmse9qjky000kl404hqlsjkee	HIGH	120	1440	2026-08-04 06:19:56.963	2026-08-04 06:19:56.963
cmse9qjky000ol4041dp0k8ax	cmse9qjky000kl404hqlsjkee	URGENT	30	480	2026-08-04 06:19:56.963	2026-08-04 06:19:56.963
cms8rbgha000pijnt59vpfwab	cms8rbgh9000oijntd5hipmrt	LOW	480	5700	2026-07-31 09:45:29.134	2026-08-04 06:22:38.68
cmse9uq4z000gl804zo4sav5d	cmse9uq4z000fl804nvizj9s2	LOW	480	5760	2026-08-04 06:23:12.084	2026-08-04 06:23:12.084
cmse9uq4z000hl804c7xx8ncu	cmse9uq4z000fl804nvizj9s2	MEDIUM	240	2880	2026-08-04 06:23:12.084	2026-08-04 06:23:12.084
cmse9uq4z000il804tjsrv3ns	cmse9uq4z000fl804nvizj9s2	HIGH	120	1440	2026-08-04 06:23:12.084	2026-08-04 06:23:12.084
cmse9uq50000jl8040ng5n7ce	cmse9uq4z000fl804nvizj9s2	URGENT	30	480	2026-08-04 06:23:12.084	2026-08-04 06:23:12.084
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Session" (id, "userId", "tenantId", "refreshTokenHash", "userAgent", "ipAddress", "expiresAt", "revokedAt", "createdAt", "updatedAt") FROM stdin;
cmsa4ax2a0001ijohavdnhp65	cms8r925a0004ijcjjy1w8w4t	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$lOUlS4t3RK4IIR81+1wYlQ$6TJqwJ2loaSruBvfu/+k/43s7RGq2JxW3ezaVOFf3xM	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-08-09 11:05:17.03	\N	2026-08-01 08:36:45.154	2026-08-02 11:05:19.036
cms8t4krn0002ijcqfxoancux	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$QgRKu05fo7fB7nuVhJaVMg$Yed5LvtEBB/cJzhXB9MbCL67Nww68x9NviEHXreab3w	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-08-07 11:38:21.234	\N	2026-07-31 10:36:07.331	2026-07-31 11:38:22.37
cmscz9yix0001jp04efnvqhmf	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$N34bakBotB/yPENTJfHy7A$fvqQLpAAg52JyH/t2ueDAjNSU6r55KQVcDrwYax97Vo	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	106.51.46.252	2026-08-10 08:43:09.654	\N	2026-08-03 08:39:20.841	2026-08-03 08:43:11.041
cms8rwiaj000qij95g7inrmul	cms8r925a0004ijcjjy1w8w4t	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$rw0J0WBTnqzYGFBSCWPpjw$zc+q11TfiI2XG2vDK3pFafeq51LyJMAmeuAtzXFF6Uw	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-08-07 16:46:24.678	\N	2026-07-31 10:01:51.259	2026-07-31 16:46:26.297
cmsbq1kgy0001iju6690z4ipz	cms8r925a0004ijcjjy1w8w4t	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$eA68PBczY0NLIXlKgCW1og$LgfoewYiN/nnSDy1U8/yV5dwFtf/nj3VN6C+WIZpg68	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-08-09 11:57:42.804	\N	2026-08-02 11:33:06.658	2026-08-02 11:57:44.484
cmsa8cw7a0004ijpj9bmpg68a	cms8r927b000aijcjt7sutffd	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$inBjU3MLBbBMeKnVdfsUWA$W+zOsRH+Y9vINW5sfvmWrVTnXsz9bnEJP+rIq6x4YHE	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-08-08 10:46:25.293	\N	2026-08-01 10:30:15.814	2026-08-01 10:46:26.491
cmsct3a7c0001ijvk9plx2mre	cms8r925z0008ijcjup5f0y2u	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$uzruOAN58mfZWMp2H3NrSg$3T9uJqf+dw5bp7/NRBHaPUivIibjfJPs6GQzYLFjX8I	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-08-10 10:51:32.838	2026-08-03 10:51:56.132	2026-08-03 05:46:11.688	2026-08-03 10:51:56.138
cmscqri9o0001jw04jt3cbigp	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$O2g9NQCygnwB+fRWHTtzVg$Wef6NYhrGa1pnDTEzODXb1rd4tktt9SgrgNyVRi9W4w	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	152.57.130.210	2026-08-10 04:41:22.368	\N	2026-08-03 04:41:01.657	2026-08-03 04:41:23.452
cms8tobmt0005ijcqypmg5dbq	cms8r925z0008ijcjup5f0y2u	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$Qy/5D5c355C0Qdi6fZUz1A$eyqQEuTaup6seET4PFZxRvj/6/eeLLL8qq3UXxGcy3A	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-08-07 10:51:28.611	\N	2026-07-31 10:51:28.613	2026-07-31 10:51:28.613
cms96ffai0003ijwpj9e1uu2w	cms8r91xj0002ijcjijcbf0gt	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$wg5oVtm00owBRVEc8GOUAg$U4NjyY9wJjC/aF2G8K+lsWyefsTWK0NZr7mcHa8bOJg	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-08-07 17:57:39.255	\N	2026-07-31 16:48:28.458	2026-07-31 17:57:46.206
cms8rcdrh000nij95psh6zp9p	cms8r925a0004ijcjjy1w8w4t	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$j5PqNOn8DzSOoqF7oxc1GQ$2DYkAHJChTPzF94c29LbLYSmuqMX7BuslAi/s+EOIyQ	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-08-07 11:04:59.724	\N	2026-07-31 09:46:12.269	2026-07-31 11:05:01.454
cmscqu1vv0001k004tjz41tq2	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$FudN2OcEMIkUy44Fjwh6KQ$pqqWZs0dSLW+GOJWGkbAjR93fKuZfu/fMiQDFaQHRcs	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	152.57.130.210	2026-08-10 04:43:33.388	\N	2026-08-03 04:43:01.771	2026-08-03 04:43:35.124
cmscs9efl0001la04ui9lkgsp	cms8r91xj0002ijcjijcbf0gt	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$ZPOEk48X0uuROpTsNDclpA$XBY27tJpuzGScs3GiPR8M2dGyEgzLMIerX3/qsOcZqs	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	106.51.46.252	2026-08-10 05:22:57.488	\N	2026-08-03 05:22:57.489	2026-08-03 05:22:57.489
cmscz8qg40001le04ejzutv9y	cms8r925z0008ijcjup5f0y2u	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$4y6ACzQeCsKNPTIASjyUeg$HOK05rGHFP1l9tlYPQ7cHRq5yqfIA7rlE96DGwebz74	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	106.51.46.252	2026-08-10 08:38:23.716	\N	2026-08-03 08:38:23.717	2026-08-03 08:38:23.717
cmscsnlsh0001jm04lac3qqsi	cms8r925z0008ijcjup5f0y2u	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$KgOn0FqNbcjfHIn4qGswLg$3jxPxU6FP6kmE8UfzO+rlfEKgTWft3YacBmq6sgJg1Q	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	106.51.46.252	2026-08-10 08:01:07.424	\N	2026-08-03 05:34:00.21	2026-08-03 08:01:08.475
cmscxzzlj0001ju048c5limgi	cms8r925z0008ijcjup5f0y2u	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$Aa3Ln0SrQgQJZVDkD6hjag$RGjC6dSmzGk+zVz0A+fgdt4g66XucBNCLCxlOU7GMiY	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	106.51.46.252	2026-08-10 08:08:26.379	\N	2026-08-03 08:03:36.056	2026-08-03 08:08:27.488
cmscybopy0001jl04obx4ek9n	cms8r925a0004ijcjjy1w8w4t	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$4feQQYmX9FHmdcQW9x+lLg$cs9ERjhGZdhskBMGxx7+GMnBc6ZcPP2l7MFYwQZ5gKo	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	106.51.46.252	2026-08-10 10:11:36.21	2026-08-03 10:11:54.79	2026-08-03 08:12:41.83	2026-08-03 10:11:54.791
cmsczfgut0006kz04873agt3a	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$+/qjiJ22HlyAeiUZsN1P4w$ye5dCvNARGY/41qHJHnMtDm43CtTVtjJowrB7tqtS/8	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	106.51.46.252	2026-08-10 10:26:39.9	\N	2026-08-03 08:43:37.877	2026-08-03 10:26:41.18
cmsd3adcm0001ju04795qsyry	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$tQD/2NsXkNnAOeKv70DpnA$MoPIfJWcDRnE0n/BK2BsBhZvVzIyDHIu/i7rQEoLSrY	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 10:42:36.118	\N	2026-08-03 10:31:38.518	2026-08-03 10:42:37.408
cmsd3orxb0003jv04tek5vtpo	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$8/1VPq5wfUqer/R1uUHezg$fWfczval7v4MkPV3PGAlugCJHWHedkwqeN9bJqLfxvQ	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 11:15:24.278	2026-08-03 11:16:11.045	2026-08-03 10:42:50.591	2026-08-03 11:16:11.046
cmscuwigr0001k104ejifgy9x	cms8r91xj0002ijcjijcbf0gt	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$HmOKPcU9JVN1r+mfr0/h0Q$eoBJXDaMQT2tY+1X53usp6OUe1jKrp1Z4IUJBjW3aiQ	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	157.50.174.229	2026-08-11 06:13:45.37	\N	2026-08-03 06:36:55.035	2026-08-04 06:13:47.186
cmsd3l4680001jv04q692rqs4	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$Tk+u6HSC4FDfoUktG9BdXw$wPw7hFEMV0gRGAGVFuMOF8MQG85WdNGpNQh4sKN89aA	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 11:26:18.66	2026-08-03 11:26:27.2	2026-08-03 10:39:59.841	2026-08-03 11:26:27.201
cmsd591iu0003l404me9p2teg	cms8r91xj0002ijcjijcbf0gt	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$YxdYg/er9hmHUypLZ+hBaw$zmYyWfK0yG8z5GC+LMDtMp0IbDM+v0vSsduMLBjf77U	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 11:29:07.094	2026-08-03 11:29:18.293	2026-08-03 11:26:35.767	2026-08-03 11:29:18.295
cmsd6zr710001ijlmiyrt6e3u	cms8r91xj0002ijcjijcbf0gt	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$KbeDrGYW3XIMnUx+P+g5ZA$kOMKeqwwCB6ZgGjqu0NuOsiaCnjBJiqzc/iSwmycv3Q	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-08-10 12:17:21.413	2026-08-03 12:25:45.314	2026-08-03 12:15:21.699	2026-08-03 12:25:45.321
cmsd4wlqi0001kw043rrfbfg1	cms8r91xj0002ijcjijcbf0gt	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$esYNa8UPRSy6XlGfgU8tyg$dfVSN7+CDYIocLhcrNXoK9lgfHphB2NzE1iOvn9rDaQ	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 11:16:55.433	2026-08-03 11:18:11.645	2026-08-03 11:16:55.435	2026-08-03 11:18:11.646
cmsd4ynq70001kz04xacteq0u	cms8r925a0004ijcjjy1w8w4t	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$ro5XjeQ53y9mX0pFSjs3DA$xYNzqKZAmrpbFduFh55v93w+ZkF4qIxuYK9PqggiQe4	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 11:20:01.557	2026-08-03 11:20:14.084	2026-08-03 11:18:31.327	2026-08-03 11:20:14.085
cmsd61ojt0001l704vhpewhqs	cms8r91xj0002ijcjijcbf0gt	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$V91Pzs8kSg04MGpx3oTAnQ$dGiIW+VTGAPcp11l9KlzPpMI24FTn2re8vpKW0aThI8	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:16:08.319	\N	2026-08-03 11:48:51.977	2026-08-03 12:16:09.627
cmsd510bx0003kz04xdvuayf6	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$PE46x0mL0qVmeXIlAXMuNg$zJycIcWyqoPv57k1l1uN6EtsU0PXFlnxDXrd0OFxa2M	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 11:21:16.775	2026-08-03 11:21:33.632	2026-08-03 11:20:20.974	2026-08-03 11:21:33.633
cmsd5404m0003kw04vwyxcfuf	cms8r91xj0002ijcjijcbf0gt	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$eAF7K5WQTXnPA+0wd2ifHQ$jxV/VnpbJt7snLFFFdc4L6646Sw2IC+U5BnVuQbfjt4	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 11:22:55.172	2026-08-03 11:23:03.86	2026-08-03 11:22:40.679	2026-08-03 11:23:03.861
cmsd5cpap0001l204wyjsm4w2	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$8qoOlheyDratu19JDokD7A$jz64kTUnfvgaFMqTMLzVQ3OTuZULlLUncNAJOvdeCgA	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 11:30:08.935	\N	2026-08-03 11:29:26.546	2026-08-03 11:30:10.031
cmsd5ex120005l404c6gewo9n	cms8r91xj0002ijcjijcbf0gt	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$dG2+yWCTlwSowZPyef0GFQ$f61zcnajlmiDXnsdUlrz8w996gLzotG7jrXp5auDXs0	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 11:48:05.783	\N	2026-08-03 11:31:09.878	2026-08-03 11:48:06.912
cmsd54t9t0001l4049exfjf0w	cms8r91xj0002ijcjijcbf0gt	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$CEbl7ekEIOiyS2LUtQ5xTQ$BnP7UFFTM2bkqK+6kHqTBscPcSPjwc1VN73uZPtiiws	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 11:28:00.584	\N	2026-08-03 11:23:18.449	2026-08-03 11:28:01.89
cmsd6r36l0001l704172q4p8l	cms8r91xj0002ijcjijcbf0gt	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$8IFprbTZCX6Y+hjfNKcFzQ$g67yt2zzpxLvUJXeaNNMVmQZIyAUdcENnjxL9sTt5RQ	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	106.51.46.252	2026-08-10 15:10:34.281	\N	2026-08-03 12:08:37.342	2026-08-03 15:10:37.818
cmsd42mu20001ij6ak2czitq5	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$vrcEMPNc0wVwqwTo4xLMrQ$yCB6hljO5wcdSP7EXr20J1ySQGR6CgMxdDiQF4uNsa8	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-08-10 11:52:45.221	2026-08-03 11:52:53.432	2026-08-03 10:53:37.178	2026-08-03 11:52:53.436
cmsd75vkj0003l704lcq5nvjr	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$b8lhISrc+vEk/VWIETOSeQ$hQ8Ix1GBM+Js00+oMSUQF/9JDRYpEE5fbVmoSPRx9b0	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:23:03.494	2026-08-03 12:23:49.737	2026-08-03 12:20:07.315	2026-08-03 12:23:49.738
cmsd6845q0001jr0434ab43xe	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$xd2bkkS1NQeqsUBXqCm7Pg$6/gGMhr668qM6vGwEBLkL3E66jHrzU48vqssMWTLmOU	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	106.51.46.252	2026-08-10 11:53:54.286	2026-08-03 12:07:53.407	2026-08-03 11:53:52.142	2026-08-03 12:07:53.408
cmsd7c20i0001kz0475ekzq1z	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$zfw3IuNu3PJ0OBXDsBq2DA$acQRb/Q33HmlA/st8CvYiJH76KmcD8Cjh3Tjj1rA7vE	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:24:55.601	\N	2026-08-03 12:24:55.602	2026-08-03 12:24:55.602
cmsd7c8kl0003kz048dcmcd7u	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$ykr8QPuynhR9B+dEXFGuHA$12Hnrr2rmyriG/vsUE6tJu2az+X21+M198QUG9ECIc0	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:25:04.101	\N	2026-08-03 12:25:04.102	2026-08-03 12:25:04.102
cmsd7cb8h0005kz04vl910gje	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$gbnKxZ4VYS0FF+6LOEdEyQ$epOwBt0OisCfXOL8ONVsR/Fsq/4Qb39KQ2q1F+8RfuQ	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:25:07.552	\N	2026-08-03 12:25:07.553	2026-08-03 12:25:07.553
cmsd7chgg0007kz04n7uhtvu2	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$gjP9vYwD8yGU6mr4lgbZdQ$vAX/bcf0gCp7EEiiqQW+3jhs9SUgK5xrwPb+rrAYnK4	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:25:15.616	\N	2026-08-03 12:25:15.617	2026-08-03 12:25:15.617
cmsd7ckde0009kz04dovqv1hu	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$shwnXynw+oGX9gaNUdQVeA$Bhr+vRoXh6jK2h32G2jpGo9DviJlXhDFEx4Cxm6CaKs	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:25:19.394	\N	2026-08-03 12:25:19.395	2026-08-03 12:25:19.395
cmsd7csab000bkz04lfblwanq	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$dmXArwizjpOYD/mntbbKWQ$P71u+EPC148uSDgY9qdwubWh3x9cU1XbcNKZ0+L9Hj8	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:25:29.65	\N	2026-08-03 12:25:29.651	2026-08-03 12:25:29.651
cmsd7cyn4000dkz04xe4vnq8u	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$u7iTUR8BozHs8ajLav0S8w$x9M3waZILfkCo35Bq4visogBsy3Yidm937ZJa7Pq92E	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:25:37.887	\N	2026-08-03 12:25:37.888	2026-08-03 12:25:37.888
cmsd7dpxw000fkz046phs4vfo	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$DrIa8EF1CTb16carOvaA6g$OWl6J3OlljsxCeTg67DNwcI3Bcb4AZKdtvRE9OGUEbU	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:26:13.267	\N	2026-08-03 12:26:13.268	2026-08-03 12:26:13.268
cmsd7ei5t000hkz044ixf4ap4	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$CNhqOesxiEJZ74E3T7+W9Q$YHQqN2WrnNeNENXur0st4iIPB7VjxQ3Ug7ACLLVQ984	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:26:49.841	\N	2026-08-03 12:26:49.842	2026-08-03 12:26:49.842
cmsd7emvs000jkz04ezl960vy	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$hy3zNqQyGCnupYxoKeHtAg$wqDEtokcoiyEyZ+2ajmBwCCwkJ/FZJz7NeEepG1RUZk	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:27:23.964	\N	2026-08-03 12:26:55.96	2026-08-03 12:27:25.066
cmsd7x9700001i504eq89xml8	cms8r925a0004ijcjjy1w8w4t	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$GjIZvsmrE0NODZ1mvOjijg$U/kUdqkvQl9Pcimz+8GoX3yhYOpzMjSIz1A1KLnR3QQ	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	106.51.46.252	2026-08-10 12:41:26.289	\N	2026-08-03 12:41:24.685	2026-08-03 12:41:28.056
cmsd7fhkq0001jr04zpsv8tga	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$GCm0lAReBMtwjIaAPnvQlQ$XLn4+qv1nsjnvCVKzTo0DAGWoi4XyCLobAVv2VRUXX4	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:34:21.678	\N	2026-08-03 12:27:35.738	2026-08-03 12:34:22.777
cmsd7tbc70006jw042d7errta	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$FpOH3ueMIaSdCO/4ziwt+w$c8xJiOmtJoYF5LYmVXDdCC3BeRAG8EV2YKKuSViIne4	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:51:24.076	\N	2026-08-03 12:38:20.839	2026-08-03 12:51:25.146
cmsd7q1n50001l704u2tpo5l9	cms8r925a0004ijcjjy1w8w4t	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$REQ3HB7qnPkpAPrOyOBtbg$zRacui3acTSDRbK37KOI/6V0/BUq/uLdHhJM6DltAX0	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	106.51.46.252	2026-08-10 12:39:27.123	2026-08-03 12:39:39.258	2026-08-03 12:35:48.305	2026-08-03 12:39:39.259
cmsd7vlai0001jx04d6kri1rk	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$2s1G/H7aWAqAEqk6aAtJOQ$ryptmR5mjpT09cmM0MoNSLeE+P20A6DQRvFf51QUgks	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	106.51.46.252	2026-08-10 12:40:27.357	\N	2026-08-03 12:40:07.05	2026-08-03 12:40:28.431
cmsd8agyz0001js04btbp1ufw	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$XPXh2YEjnrr99W+ygCADMw$LMEEsZE3s3LMHszLz67SM8KdbQwnwGSxKa1psEgGtIA	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:51:55.087	\N	2026-08-03 12:51:41.291	2026-08-03 12:51:56.209
cmsd8bade0001l204h1s5602q	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$JV5WD+hiIGvcXLhdfI/yUQ$4YNMsvr8AgN3smam1el/Sdh6JtUn+gyUWI5JW3amU8A	Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0	106.51.46.252	2026-08-10 12:52:28.632	\N	2026-08-03 12:52:19.394	2026-08-03 12:52:30.375
cmsddbj040001jv04q6hwuau1	cms8r925a0004ijcjjy1w8w4t	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$sWJOk2qDXFdTcvWXgXYEBA$BfRQPEoauz2BQFkvW2LIrSEHMSJOp4O7aFOVn6np/NU	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	152.57.100.191	2026-08-11 06:01:08.901	2026-08-04 06:01:37.601	2026-08-03 15:12:28.66	2026-08-04 06:01:37.602
cmse9fg5a0007l404mdos0wt2	cms8r925z0008ijcjup5f0y2u	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$hzQoJc+sA4OwivtaoGpRNw$lVLQLwTzcOmXqsNQh2XiAwXhejEf5dcdS5uDmLS7sVg	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	106.51.46.252	2026-08-11 06:11:19.293	2026-08-04 06:12:59.101	2026-08-04 06:11:19.294	2026-08-04 06:12:59.102
cmsdk9wf70001ju04gimdb556	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$QlQNTsrZI2y+4Gt9xGkhag$1x0mkXzeJNPUQkwDDd69oCKxQXBhHrop+2VfUb0fgyo	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	152.57.101.206	2026-08-11 02:41:03.999	\N	2026-08-03 18:27:10.051	2026-08-04 02:41:07.467
cmse9wcf2000rl4049ydvraug	cms8r925z0008ijcjup5f0y2u	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$hobAs+PyR8v4j8TpUhnFjg$ksD9oxujdZtoT6Cj70qVv6OTEFCn1EkkX0VrXazIfy4	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	106.51.46.252	2026-08-11 06:24:27.613	2026-08-04 06:25:44.14	2026-08-04 06:24:27.614	2026-08-04 06:25:44.141
cmse9iaqq0004l804okufbp5b	cms8r925a0004ijcjjy1w8w4t	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$tTB/w7ORdCKqzWwm9M6WDQ$T51ok863aicM1Ks5Oxjb7MKO2AszEQTXyU4F3pJZHKg	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	106.51.46.252	2026-08-11 06:13:34.121	2026-08-04 06:23:18.282	2026-08-04 06:13:32.259	2026-08-04 06:23:18.283
cmse9z2yr000tl404texwu53i	cms8r91xj0002ijcjijcbf0gt	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$8CqgOav8Jp8/6gqgHCgFWg$wKDHvfYp6haIMcWzxDxoZTh0MkjQsuN6clW+cBnfNG8	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	106.51.46.252	2026-08-11 06:26:35.33	2026-08-04 06:28:43.705	2026-08-04 06:26:35.331	2026-08-04 06:28:43.706
cmsea2e5a000vl404sh90wasp	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$MuNVlUMHwyxUMPyV912DZQ$fTfSHsowwhr6GyTwq3N5gDKmkAuU2ArMz9DtK5LWlE0	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	106.51.46.252	2026-08-11 06:29:09.79	2026-08-04 06:33:13.796	2026-08-04 06:29:09.791	2026-08-04 06:33:13.797
cmse9mn430002l404bqb0ryx2	cms8r925z0008ijcjup5f0y2u	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$PgftbOym0F7Zs8Eg4uc+PA$auv7qnkBwMeg7lo/Pmeeaxerl6x37OqcGjUGV3V79P4	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	106.51.46.252	2026-08-11 09:31:59.193	\N	2026-08-04 06:16:54.915	2026-08-04 09:32:02.273
cmsd7fnag0003ijlmpcwj4qul	cms8r92zm000eijcj48pzmyhn	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$Bh7+RKd4bYZXm2vYTcjRmg$sn0TX1AqutygMn4WB/m2fVVHp5e0MVKTv+bNXhLt1n8	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-08-11 06:28:47.685	2026-08-04 06:29:16.415	2026-08-03 12:27:43.144	2026-08-04 06:29:16.424
cmsea358m0001ijuz387wb30d	cms8r925z0008ijcjup5f0y2u	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$Zb8Gef2/AVes0TYxH/oaQQ$9vJCyqK1Lyk86A0DGHkwt9nk+CsbFonX4HuZ4+VDMIc	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-08-11 06:56:21.495	2026-08-04 06:57:09.443	2026-08-04 06:29:44.902	2026-08-04 06:57:09.452
cmsea7y4r0002i904n73zkd81	cms8r925z0008ijcjup5f0y2u	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$svXveAgyUjtMxGTF1cgeLA$TzUJqtSpXbrEK8IKXJZP5grrUEGrmVwRGtwO7GpD28w	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	106.51.46.252	2026-08-11 06:33:28.745	2026-08-04 06:33:50.846	2026-08-04 06:33:28.746	2026-08-04 06:33:50.847
cmsea8zfx0004i904xekhvdut	cms8r925a0004ijcjjy1w8w4t	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$dYcDANcOzFfnTzXuB9bCMw$yfIw+TbHLSR+jA0PYG9Q5zf9q3itstIoq6g3HIpAkKA	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	106.51.46.252	2026-08-11 06:34:39.377	2026-08-04 06:36:15.876	2026-08-04 06:34:17.326	2026-08-04 06:36:15.876
cmseb3hzi0003ijuzsa10nqge	cms8r925a0004ijcjjy1w8w4t	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$I+j1bOhbo5rD2LZTrwJfdQ$+CBRtm4Zj0wo8OvjExEWeqAbRbRgfRXgCywbsdSZ/rc	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-08-11 09:21:05.68	\N	2026-08-04 06:58:01.038	2026-08-04 09:21:07.105
cmsegeazp0001ijd1ftyrlcp6	cms8r925a0004ijcjjy1w8w4t	cms8r91bn0000ijcjsr0zc6lu	$argon2id$v=19$m=65536,p=1,t=3$UXmslHm9a7HjSk1kZqSapQ$vvn91L/G8ypLDvTvz7vB8+9tiuDiOTFIGvNmfc0A0fM	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-08-11 09:26:23.267	\N	2026-08-04 09:26:23.269	2026-08-04 09:26:23.269
\.


--
-- Data for Name: Tenant; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Tenant" (id, name, slug, status, "createdAt", "createdBy", "updatedAt", "updatedBy", "contactEmail", "contactPhone", currency, "deletedAt", domain, timezone) FROM stdin;
cms8r91bn0000ijcjsr0zc6lu	Elipsonics Tech	elipsonics	ACTIVE	2026-07-31 09:43:36.179	\N	2026-07-31 09:43:36.179	\N	\N	\N	INR	\N	\N	Asia/Kolkata
cmse9qikk000el404q6bqcmpm	shreyas	shreyas	PENDING_ACTIVATION	2026-08-04 06:19:55.652	cms8r925z0008ijcjup5f0y2u	2026-08-04 06:19:55.652	cms8r925z0008ijcjup5f0y2u	shreyaspoojari6@gmail.com	\N	USD	\N	\N	UTC
cmse9uoe30009l8043q8lats1	zoho	zoho	PENDING_ACTIVATION	2026-08-04 06:23:09.819	cms8r925z0008ijcjup5f0y2u	2026-08-04 06:23:09.819	cms8r925z0008ijcjup5f0y2u	admin@zoho.com	\N	USD	\N	\N	UTC
\.


--
-- Data for Name: Ticket; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Ticket" (id, "tenantId", "projectId", "clientId", number, title, description, status, priority, "categoryId", "assignedToId", "reportedById", "createdAt", "updatedAt", "resolvedAt", "closedAt") FROM stdin;
cms8rbgtl000uijntbne17g0e	cms8r91bn0000ijcjsr0zc6lu	cms8r938k000lijcjnqxqie25	cms8r92j9000cijcjl6i2t3xt	1	Login button unresponsive on mobile	Detailed description for: Login button unresponsive on mobile. This is a production issue that needs attention.	OPEN	HIGH	\N	cms8r91xj0002ijcjijcbf0gt	cms8r925a0004ijcjjy1w8w4t	2026-07-31 04:32:39.498	2026-07-31 10:08:12.238	\N	\N
cms8rbi2q001cijntv1lbvyez	cms8r91bn0000ijcjsr0zc6lu	cms8r938k000lijcjnqxqie25	cms8r92j9000cijcjl6i2t3xt	3	Dashboard shows incorrect revenue figures	Detailed description for: Dashboard shows incorrect revenue figures. This is a production issue that needs attention.	RESOLVED	HIGH	\N	cms8r91xj0002ijcjijcbf0gt	cms8r925a0004ijcjjy1w8w4t	2026-07-29 06:44:34.697	2026-07-29 07:44:59.211	2026-07-29 07:44:59.211	\N
cms8rbiif001mijntzqdjbg6u	cms8r91bn0000ijcjsr0zc6lu	cms8r938k000lijcjnqxqie25	cms8r92j9000cijcjl6i2t3xt	4	Search results not paginated correctly	Detailed description for: Search results not paginated correctly. This is a production issue that needs attention.	CLOSED	MEDIUM	\N	cms8r927b000aijcjt7sutffd	cms8r925a0004ijcjjy1w8w4t	2026-07-26 07:27:01.344	2026-07-26 11:43:20.094	2026-07-26 11:43:20.094	2026-07-26 11:43:20.094
cms8rbiy9001wijntq7tc2eaw	cms8r91bn0000ijcjsr0zc6lu	cms8r938k000lijcjnqxqie25	cms8r92j9000cijcjl6i2t3xt	5	Email notifications not delivered	Detailed description for: Email notifications not delivered. This is a production issue that needs attention.	OPEN	MEDIUM	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-31 05:16:14.454	2026-07-31 07:36:13.394	\N	\N
cms8rbjbj0022ijnt9g1dy37r	cms8r91bn0000ijcjsr0zc6lu	cms8r938k000lijcjnqxqie25	cms8r92j9000cijcjl6i2t3xt	6	Custom fields not saving on user profile	Detailed description for: Custom fields not saving on user profile. This is a production issue that needs attention.	IN_PROGRESS	LOW	\N	cms8r925t0006ijcj6sny475l	cms8r925a0004ijcjjy1w8w4t	2026-07-30 17:24:18.999	2026-07-30 18:32:30.939	\N	\N
cms8rbjrk002cijnt9v8vg1mn	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000jijcj79u0p9pb	cms8r92j9000cijcjl6i2t3xt	7	Hero banner image broken on Safari	Detailed description for: Hero banner image broken on Safari. This is a production issue that needs attention.	OPEN	HIGH	\N	cms8r927b000aijcjt7sutffd	cms8r925a0004ijcjjy1w8w4t	2026-07-30 20:18:33.855	2026-07-31 02:05:28.875	\N	\N
cms8rbk6a002kijntvvfzs5y0	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000jijcj79u0p9pb	cms8r92j9000cijcjl6i2t3xt	8	Contact form submissions not forwarded	Detailed description for: Contact form submissions not forwarded. This is a production issue that needs attention.	IN_PROGRESS	URGENT	\N	cms8r91xj0002ijcjijcbf0gt	cms8r925a0004ijcjjy1w8w4t	2026-07-31 01:17:49.301	2026-07-31 01:18:13.98	\N	\N
cms8rbkma002uijntglo47kdb	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000jijcj79u0p9pb	cms8r92j9000cijcjl6i2t3xt	9	Footer links pointing to 404	Detailed description for: Footer links pointing to 404. This is a production issue that needs attention.	RESOLVED	LOW	\N	cms8r925t0006ijcj6sny475l	cms8r925a0004ijcjjy1w8w4t	2026-07-29 14:34:44.069	2026-07-29 14:37:03.464	2026-07-29 14:37:03.464	\N
cms8rbl230034ijntu937w6tk	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000jijcj79u0p9pb	cms8r92j9000cijcjl6i2t3xt	10	SEO meta tags missing on blog posts	Detailed description for: SEO meta tags missing on blog posts. This is a production issue that needs attention.	OPEN	MEDIUM	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-30 16:24:01.817	2026-07-30 22:16:35.828	\N	\N
cms8rblfh003aijntnodm6nsb	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000jijcj79u0p9pb	cms8r92j9000cijcjl6i2t3xt	11	Responsive layout broken on tablet	Detailed description for: Responsive layout broken on tablet. This is a production issue that needs attention.	CLOSED	HIGH	\N	cms8r927b000aijcjt7sutffd	cms8r925a0004ijcjjy1w8w4t	2026-07-25 07:17:53.563	2026-07-25 08:07:45.342	2026-07-25 08:07:45.342	2026-07-25 08:07:45.342
cms8rblyc003kijntc1s76g6j	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000jijcj79u0p9pb	cms8r92j9000cijcjl6i2t3xt	12	Page load time exceeds 3 seconds	Detailed description for: Page load time exceeds 3 seconds. This is a production issue that needs attention.	IN_PROGRESS	MEDIUM	\N	cms8r91xj0002ijcjijcbf0gt	cms8r925a0004ijcjjy1w8w4t	2026-07-30 11:28:01.122	2026-07-30 16:17:19.45	\N	\N
cms8rbme3003uijntq4gujfra	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000iijcjv4rbtr4o	cms8r92j9000cijcjl6i2t3xt	13	OAuth token refresh failing silently	Detailed description for: OAuth token refresh failing silently. This is a production issue that needs attention.	OPEN	URGENT	\N	cms8r925t0006ijcj6sny475l	cms8r925a0004ijcjjy1w8w4t	2026-07-30 22:29:23.24	2026-07-30 23:41:16.436	\N	\N
cms8rbmt10042ijntb4uuefid	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000iijcjv4rbtr4o	cms8r92j9000cijcjl6i2t3xt	14	Rate limiting not applied correctly	Detailed description for: Rate limiting not applied correctly. This is a production issue that needs attention.	IN_PROGRESS	HIGH	\N	cms8r927b000aijcjt7sutffd	cms8r925a0004ijcjjy1w8w4t	2026-07-30 23:11:32.884	2026-07-30 23:36:35.309	\N	\N
cms8rbn8w004cijntpl68xz7i	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000iijcjv4rbtr4o	cms8r92j9000cijcjl6i2t3xt	15	Webhook payload schema mismatch	Detailed description for: Webhook payload schema mismatch. This is a production issue that needs attention.	RESOLVED	HIGH	\N	cms8r91xj0002ijcjijcbf0gt	cms8r925a0004ijcjjy1w8w4t	2026-07-27 14:10:47.149	2026-07-27 17:35:09.084	2026-07-27 17:35:09.084	\N
cms8rbnoz004mijntgvvoezc0	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000iijcjv4rbtr4o	cms8r92j9000cijcjl6i2t3xt	16	API response time degraded on batch calls	Detailed description for: API response time degraded on batch calls. This is a production issue that needs attention.	OPEN	MEDIUM	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-30 10:22:56.411	2026-07-30 11:55:03.918	\N	\N
cms8rbo2e004sijntacdeoxxg	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000iijcjv4rbtr4o	cms8r92j9000cijcjl6i2t3xt	17	CORS headers missing for third-party origins	Detailed description for: CORS headers missing for third-party origins. This is a production issue that needs attention.	CLOSED	LOW	\N	cms8r925t0006ijcj6sny475l	cms8r925a0004ijcjjy1w8w4t	2026-07-27 08:25:30.048	2026-07-27 11:25:58.031	2026-07-27 11:25:58.031	2026-07-27 11:25:58.031
cms8rboin0052ijnt7ne1ktqi	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000iijcjv4rbtr4o	cms8r92j9000cijcjl6i2t3xt	18	Endpoint documentation outdated	Detailed description for: Endpoint documentation outdated. This is a production issue that needs attention.	CLOSED	LOW	\N	cms8r927b000aijcjt7sutffd	cms8r925a0004ijcjjy1w8w4t	2026-07-24 06:42:05.035	2026-07-24 12:35:24.262	2026-07-24 12:35:24.262	2026-07-24 12:35:24.262
cms8rboyg005cijntjmlxtcy3	cms8r91bn0000ijcjsr0zc6lu	cms8r938k000mijcj02p1hem5	cms8r92j9000cijcjl6i2t3xt	19	Push notifications not received on Android 14	Detailed description for: Push notifications not received on Android 14. This is a production issue that needs attention.	OPEN	URGENT	\N	cms8r91xj0002ijcjijcbf0gt	cms8r925a0004ijcjjy1w8w4t	2026-07-30 14:31:06.813	2026-07-30 15:54:41.522	\N	\N
cms8rbpd6005kijntrv6jej0c	cms8r91bn0000ijcjsr0zc6lu	cms8r938k000mijcj02p1hem5	cms8r92j9000cijcjl6i2t3xt	20	App crashes on profile screen	Detailed description for: App crashes on profile screen. This is a production issue that needs attention.	IN_PROGRESS	HIGH	\N	cms8r925t0006ijcj6sny475l	cms8r925a0004ijcjjy1w8w4t	2026-07-30 10:53:14.271	2026-07-30 11:30:18.262	\N	\N
cms8rbhlq0012ijnt2eru7kf4	cms8r91bn0000ijcjsr0zc6lu	cms8r938k000lijcjnqxqie25	cms8r92j9000cijcjl6i2t3xt	2	Export to CSV fails for large datasets	Detailed description for: Export to CSV fails for large datasets. This is a production issue that needs attention.	RESOLVED	URGENT	\N	cms8r925t0006ijcj6sny475l	cms8r925a0004ijcjjy1w8w4t	2026-07-31 08:46:05.607	2026-08-01 17:54:51.066	2026-08-01 17:54:51.063	\N
cms8rbq6b0060ijntt9dlgq50	cms8r91bn0000ijcjsr0zc6lu	cms8r938k000mijcj02p1hem5	cms8r92j9000cijcjl6i2t3xt	22	Camera permission dialog not shown	Detailed description for: Camera permission dialog not shown. This is a production issue that needs attention.	RESOLVED	MEDIUM	\N	cms8r927b000aijcjt7sutffd	cms8r925a0004ijcjjy1w8w4t	2026-07-29 07:28:01.895	2026-07-29 10:13:11.115	2026-07-29 10:13:11.115	\N
cms8rbqon006aijnti8akjfxw	cms8r91bn0000ijcjsr0zc6lu	cms8r938k000mijcj02p1hem5	cms8r92j9000cijcjl6i2t3xt	23	Dark mode colors incorrect	Detailed description for: Dark mode colors incorrect. This is a production issue that needs attention.	CLOSED	LOW	\N	cms8r91xj0002ijcjijcbf0gt	cms8r925a0004ijcjjy1w8w4t	2026-07-26 06:27:40.989	2026-07-26 12:17:02.536	2026-07-26 12:17:02.536	2026-07-26 12:17:02.536
cms8rbr5u006kijnt77p2l0up	cms8r91bn0000ijcjsr0zc6lu	cms8r938k000mijcj02p1hem5	cms8r92j9000cijcjl6i2t3xt	24	Biometric login failing on iPhone 15	Detailed description for: Biometric login failing on iPhone 15. This is a production issue that needs attention.	IN_PROGRESS	URGENT	\N	cms8r925t0006ijcj6sny475l	cms8r925a0004ijcjjy1w8w4t	2026-07-31 07:57:08.797	2026-07-31 13:00:14.439	\N	\N
cms8rbpt1005uijntsiak8yf1	cms8r91bn0000ijcjsr0zc6lu	cms8r938k000mijcj02p1hem5	cms8r92j9000cijcjl6i2t3xt	21	Offline mode data not syncing on reconnect	Detailed description for: Offline mode data not syncing on reconnect. This is a production issue that needs attention.	OPEN	HIGH	\N	cms8r91xj0002ijcjijcbf0gt	cms8r925a0004ijcjjy1w8w4t	2026-07-30 12:51:55.521	2026-07-31 10:47:54.788	\N	\N
cms8ujc77000lijcqg14fgay6	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000iijcjv4rbtr4o	cms8r92j9000cijcjl6i2t3xt	28	dfghjhgfddfghjhgf	gfdfghjhgfdsdfghhgfdfgh	OPEN	MEDIUM	\N	\N	cms8r92zm000eijcj48pzmyhn	2026-07-31 11:15:35.683	2026-07-31 11:15:35.683	\N	\N
cms8ucrdi000aijcqi6g05cef	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000iijcjv4rbtr4o	cms8r92j9000cijcjl6i2t3xt	26	sdfghgfdsdfgn	dfghddvccvbn	OPEN	MEDIUM	\N	cms8r927b000aijcjt7sutffd	cms8r92zm000eijcj48pzmyhn	2026-07-31 11:10:28.758	2026-07-31 16:44:56.384	\N	\N
cms8rqvnu0001ijn7klrj03mh	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000iijcjv4rbtr4o	cms8r92j9000cijcjl6i2t3xt	25	Test Ticket 1785491848033	This is a test description with more than 10 chars	CLOSED	MEDIUM	\N	\N	cms8r92zm000eijcj48pzmyhn	2026-07-31 09:57:28.65	2026-08-01 16:51:37.55	2026-08-01 16:51:32.429	2026-08-01 16:51:35.153
cmsczd3by0001kz048dx0c47r	cms8r91bn0000ijcjsr0zc6lu	cms8r938k000mijcj02p1hem5	cms8r92j9000cijcjl6i2t3xt	29	fix login issue in client dashboard	fghjhgfdfghjhgfdjkjhgffghjkjhgfhjkjhgfd	OPEN	MEDIUM	\N	\N	cms8r92zm000eijcj48pzmyhn	2026-08-03 08:41:47.038	2026-08-03 08:41:47.038	\N	\N
cmsd27ynb0001js045q95n0hg	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000iijcjv4rbtr4o	cms8r92j9000cijcjl6i2t3xt	30	dfghj,.,mnbvcxzxcvbn	vbnmnbvcxzxcvbnmnbvc	OPEN	MEDIUM	\N	\N	cms8r92zm000eijcj48pzmyhn	2026-08-03 10:01:46.535	2026-08-03 10:01:46.535	\N	\N
cmsd4cm7a0003ij6axkixsfno	cms8r91bn0000ijcjsr0zc6lu	cms8r938k000lijcjnqxqie25	cms8r92j9000cijcjl6i2t3xt	31	sbnm,mnbvcxz	sdfm,mnbvc	OPEN	MEDIUM	\N	\N	cms8r92zm000eijcj48pzmyhn	2026-08-03 11:01:22.918	2026-08-03 11:01:22.918	\N	\N
cmsd4ieh50008ij6aesp4pj95	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000iijcjv4rbtr4o	cms8r92j9000cijcjl6i2t3xt	32	jhgfdfghjkjhgfd	kjhgfdsdfghjk,.,mnbvc	OPEN	MEDIUM	\N	\N	cms8r92zm000eijcj48pzmyhn	2026-08-03 11:05:52.841	2026-08-03 11:05:52.841	\N	\N
cmsd7nx2g0001jw04k7pvfpaf	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000iijcjv4rbtr4o	cms8r92j9000cijcjl6i2t3xt	33	jhgfdfghjkjh	mjhgfdfghjhgf	OPEN	MEDIUM	\N	\N	cms8r92zm000eijcj48pzmyhn	2026-08-03 12:34:09.065	2026-08-03 12:34:09.065	\N	\N
cms8ue3to000fijcq3cftl3mh	cms8r91bn0000ijcjsr0zc6lu	cms8r938j000jijcj79u0p9pb	cms8r92j9000cijcjl6i2t3xt	27	nbvchgfdfghgf	jhgfghgfddfgfdsdfg	OPEN	HIGH	\N	cms8r91xj0002ijcjijcbf0gt	cms8r92zm000eijcj48pzmyhn	2026-07-31 11:11:31.548	2026-08-04 06:28:39.686	\N	\N
\.


--
-- Data for Name: TicketAttachment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TicketAttachment" (id, "ticketId", "uploaderId", filename, size, "mimeType", url, "createdAt") FROM stdin;
\.


--
-- Data for Name: TicketCategory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TicketCategory" (id, "tenantId", name, color) FROM stdin;
\.


--
-- Data for Name: TicketComment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TicketComment" (id, "ticketId", "authorId", body, "isInternal", "createdAt", "updatedAt") FROM stdin;
cmsam0gmz0005ijdwr0oeifus	cms8rbhlq0012ijnt2eru7kf4	cms8r925a0004ijcjjy1w8w4t	hi	f	2026-08-01 16:52:30.395	2026-08-01 16:52:30.395
cmsane5l8000bijdw9h8gzik4	cms8rbhlq0012ijnt2eru7kf4	cms8r925a0004ijcjjy1w8w4t	hi	f	2026-08-01 17:31:08.877	2026-08-01 17:31:08.877
\.


--
-- Data for Name: TicketHistory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TicketHistory" (id, "tenantId", "ticketId", action, "oldValue", "newValue", "changedById", "createdAt") FROM stdin;
cms8rbhdm000yijntv28mg7pj	cms8r91bn0000ijcjsr0zc6lu	cms8rbgtl000uijntbne17g0e	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-31 04:32:39.498
cms8rbhj80010ijnt2d37jwne	cms8r91bn0000ijcjsr0zc6lu	cms8rbgtl000uijntbne17g0e	ASSIGNED	\N	John Doe	cms8r925a0004ijcjjy1w8w4t	2026-07-31 04:42:39.498
cms8rbhxs0016ijnt7kqfno0u	cms8r91bn0000ijcjsr0zc6lu	cms8rbhlq0012ijnt2eru7kf4	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-31 08:46:05.607
cms8rbhz10018ijnt1iu8aavd	cms8r91bn0000ijcjsr0zc6lu	cms8rbhlq0012ijnt2eru7kf4	ASSIGNED	\N	Sarah Wilson	cms8r925a0004ijcjjy1w8w4t	2026-07-31 08:56:05.607
cms8rbi0a001aijntp1mreat1	cms8r91bn0000ijcjsr0zc6lu	cms8rbhlq0012ijnt2eru7kf4	STATUS_CHANGED	OPEN	IN_PROGRESS	cms8r925t0006ijcj6sny475l	2026-07-31 13:46:47.02
cms8rbien001gijnt3x5haoel	cms8r91bn0000ijcjsr0zc6lu	cms8rbi2q001cijntv1lbvyez	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-29 06:44:34.697
cms8rbifx001iijntni66hcoa	cms8r91bn0000ijcjsr0zc6lu	cms8rbi2q001cijntv1lbvyez	ASSIGNED	\N	John Doe	cms8r925a0004ijcjjy1w8w4t	2026-07-29 06:54:34.697
cms8rbih6001kijnthzt9q9xm	cms8r91bn0000ijcjsr0zc6lu	cms8rbi2q001cijntv1lbvyez	STATUS_CHANGED	OPEN	RESOLVED	cms8r91xj0002ijcjijcbf0gt	2026-07-29 07:44:59.211
cms8rbiug001qijnt35bkbrix	cms8r91bn0000ijcjsr0zc6lu	cms8rbiif001mijntzqdjbg6u	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-26 07:27:01.344
cms8rbivo001sijntm1j61fu8	cms8r91bn0000ijcjsr0zc6lu	cms8rbiif001mijntzqdjbg6u	ASSIGNED	\N	Michael Lee	cms8r925a0004ijcjjy1w8w4t	2026-07-26 07:37:01.344
cms8rbiwz001uijntjdtclwon	cms8r91bn0000ijcjsr0zc6lu	cms8rbiif001mijntzqdjbg6u	STATUS_CHANGED	OPEN	CLOSED	cms8r927b000aijcjt7sutffd	2026-07-26 11:43:20.094
cms8rbja80020ijntj61tan2m	cms8r91bn0000ijcjsr0zc6lu	cms8rbiy9001wijntq7tc2eaw	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-31 05:16:14.454
cms8rbjnm0026ijntzybxa3sg	cms8r91bn0000ijcjsr0zc6lu	cms8rbjbj0022ijnt9g1dy37r	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-30 17:24:18.999
cms8rbjow0028ijnt26mwkkto	cms8r91bn0000ijcjsr0zc6lu	cms8rbjbj0022ijnt9g1dy37r	ASSIGNED	\N	Sarah Wilson	cms8r925a0004ijcjjy1w8w4t	2026-07-30 17:34:18.999
cms8rbjq8002aijntwycf9oe9	cms8r91bn0000ijcjsr0zc6lu	cms8rbjbj0022ijnt9g1dy37r	STATUS_CHANGED	OPEN	IN_PROGRESS	cms8r925t0006ijcj6sny475l	2026-07-30 18:32:30.939
cms8rbk3p002gijntep4rrruv	cms8r91bn0000ijcjsr0zc6lu	cms8rbjrk002cijnt9v8vg1mn	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-30 20:18:33.855
cms8rbk4z002iijnt2heyqh0p	cms8r91bn0000ijcjsr0zc6lu	cms8rbjrk002cijnt9v8vg1mn	ASSIGNED	\N	Michael Lee	cms8r925a0004ijcjjy1w8w4t	2026-07-30 20:28:33.855
cms8rbkid002oijntoqfna80o	cms8r91bn0000ijcjsr0zc6lu	cms8rbk6a002kijntvvfzs5y0	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-31 01:17:49.301
cms8rbkjo002qijntcstzcv39	cms8r91bn0000ijcjsr0zc6lu	cms8rbk6a002kijntvvfzs5y0	ASSIGNED	\N	John Doe	cms8r925a0004ijcjjy1w8w4t	2026-07-31 01:27:49.301
cms8rbkkz002sijntqjdlbruu	cms8r91bn0000ijcjsr0zc6lu	cms8rbk6a002kijntvvfzs5y0	STATUS_CHANGED	OPEN	IN_PROGRESS	cms8r91xj0002ijcjijcbf0gt	2026-07-31 01:18:13.98
cms8rbky7002yijntd2z02ymm	cms8r91bn0000ijcjsr0zc6lu	cms8rbkma002uijntglo47kdb	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-29 14:34:44.069
cms8rbkzh0030ijnt22k2ojzc	cms8r91bn0000ijcjsr0zc6lu	cms8rbkma002uijntglo47kdb	ASSIGNED	\N	Sarah Wilson	cms8r925a0004ijcjjy1w8w4t	2026-07-29 14:44:44.069
cms8rbl0r0032ijntofv4hlzd	cms8r91bn0000ijcjsr0zc6lu	cms8rbkma002uijntglo47kdb	STATUS_CHANGED	OPEN	RESOLVED	cms8r925t0006ijcj6sny475l	2026-07-29 14:37:03.464
cms8rble60038ijntq5gwzhki	cms8r91bn0000ijcjsr0zc6lu	cms8rbl230034ijntu937w6tk	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-30 16:24:01.817
cms8rblrf003eijnth91s7sxg	cms8r91bn0000ijcjsr0zc6lu	cms8rblfh003aijntnodm6nsb	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-25 07:17:53.563
cms8rblst003gijnti4adb293	cms8r91bn0000ijcjsr0zc6lu	cms8rblfh003aijntnodm6nsb	ASSIGNED	\N	Michael Lee	cms8r925a0004ijcjjy1w8w4t	2026-07-25 07:27:53.563
cms8rblx1003iijntig1yd3fc	cms8r91bn0000ijcjsr0zc6lu	cms8rblfh003aijntnodm6nsb	STATUS_CHANGED	OPEN	CLOSED	cms8r927b000aijcjt7sutffd	2026-07-25 08:07:45.342
cms8rbmac003oijntusvc28a9	cms8r91bn0000ijcjsr0zc6lu	cms8rblyc003kijntc1s76g6j	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-30 11:28:01.122
cms8rbmbk003qijntisrsft1j	cms8r91bn0000ijcjsr0zc6lu	cms8rblyc003kijntc1s76g6j	ASSIGNED	\N	John Doe	cms8r925a0004ijcjjy1w8w4t	2026-07-30 11:38:01.122
cms8rbmct003sijntqeqkahvl	cms8r91bn0000ijcjsr0zc6lu	cms8rblyc003kijntc1s76g6j	STATUS_CHANGED	OPEN	IN_PROGRESS	cms8r91xj0002ijcjijcbf0gt	2026-07-30 16:17:19.45
cms8rbmqh003yijnts6q9szug	cms8r91bn0000ijcjsr0zc6lu	cms8rbme3003uijntq4gujfra	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-30 22:29:23.24
cms8rbmrr0040ijntxbqjvq09	cms8r91bn0000ijcjsr0zc6lu	cms8rbme3003uijntq4gujfra	ASSIGNED	\N	Sarah Wilson	cms8r925a0004ijcjjy1w8w4t	2026-07-30 22:39:23.24
cms8rbn510046ijntgh8macad	cms8r91bn0000ijcjsr0zc6lu	cms8rbmt10042ijntb4uuefid	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-30 23:11:32.884
cms8rbn6d0048ijnt964jptm3	cms8r91bn0000ijcjsr0zc6lu	cms8rbmt10042ijntb4uuefid	ASSIGNED	\N	Michael Lee	cms8r925a0004ijcjjy1w8w4t	2026-07-30 23:21:32.884
cms8rbn7m004aijnt16u4apdr	cms8r91bn0000ijcjsr0zc6lu	cms8rbmt10042ijntb4uuefid	STATUS_CHANGED	OPEN	IN_PROGRESS	cms8r927b000aijcjt7sutffd	2026-07-30 23:36:35.309
cms8rbnkv004gijnt7yp8wv94	cms8r91bn0000ijcjsr0zc6lu	cms8rbn8w004cijntpl68xz7i	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-27 14:10:47.149
cms8rbnm5004iijntx7fgmyzv	cms8r91bn0000ijcjsr0zc6lu	cms8rbn8w004cijntpl68xz7i	ASSIGNED	\N	John Doe	cms8r925a0004ijcjjy1w8w4t	2026-07-27 14:20:47.149
cms8rbnnf004kijntyuioq3hi	cms8r91bn0000ijcjsr0zc6lu	cms8rbn8w004cijntpl68xz7i	STATUS_CHANGED	OPEN	RESOLVED	cms8r91xj0002ijcjijcbf0gt	2026-07-27 17:35:09.084
cms8rbo13004qijntgtaad3et	cms8r91bn0000ijcjsr0zc6lu	cms8rbnoz004mijntgvvoezc0	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-30 10:22:56.411
cms8rboeq004wijnt1os74rrt	cms8r91bn0000ijcjsr0zc6lu	cms8rbo2e004sijntacdeoxxg	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-27 08:25:30.048
cms8rbog1004yijntqm02duvu	cms8r91bn0000ijcjsr0zc6lu	cms8rbo2e004sijntacdeoxxg	ASSIGNED	\N	Sarah Wilson	cms8r925a0004ijcjjy1w8w4t	2026-07-27 08:35:30.048
cms8rbohc0050ijnttm2oum85	cms8r91bn0000ijcjsr0zc6lu	cms8rbo2e004sijntacdeoxxg	STATUS_CHANGED	OPEN	CLOSED	cms8r925t0006ijcj6sny475l	2026-07-27 11:25:58.031
cms8rboun0056ijntonplx904	cms8r91bn0000ijcjsr0zc6lu	cms8rboin0052ijnt7ne1ktqi	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-24 06:42:05.035
cms8rbovx0058ijntxdvjh0h0	cms8r91bn0000ijcjsr0zc6lu	cms8rboin0052ijnt7ne1ktqi	ASSIGNED	\N	Michael Lee	cms8r925a0004ijcjjy1w8w4t	2026-07-24 06:52:05.035
cms8rbox6005aijntsea15e14	cms8r91bn0000ijcjsr0zc6lu	cms8rboin0052ijnt7ne1ktqi	STATUS_CHANGED	OPEN	CLOSED	cms8r927b000aijcjt7sutffd	2026-07-24 12:35:24.262
cms8rbpan005gijnt9bv4mcue	cms8r91bn0000ijcjsr0zc6lu	cms8rboyg005cijntjmlxtcy3	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-30 14:31:06.813
cms8rbpbw005iijntyjxuutcc	cms8r91bn0000ijcjsr0zc6lu	cms8rboyg005cijntjmlxtcy3	ASSIGNED	\N	John Doe	cms8r925a0004ijcjjy1w8w4t	2026-07-30 14:41:06.813
cms8rbpp8005oijnt1acg8ja8	cms8r91bn0000ijcjsr0zc6lu	cms8rbpd6005kijntrv6jej0c	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-30 10:53:14.271
cms8rbpqh005qijnttdz6073s	cms8r91bn0000ijcjsr0zc6lu	cms8rbpd6005kijntrv6jej0c	ASSIGNED	\N	Sarah Wilson	cms8r925a0004ijcjjy1w8w4t	2026-07-30 11:03:14.271
cms8rbprs005sijntaqp5t7e7	cms8r91bn0000ijcjsr0zc6lu	cms8rbpd6005kijntrv6jej0c	STATUS_CHANGED	OPEN	IN_PROGRESS	cms8r925t0006ijcj6sny475l	2026-07-30 11:30:18.262
cms8rbq50005yijnt19uk3wsq	cms8r91bn0000ijcjsr0zc6lu	cms8rbpt1005uijntsiak8yf1	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-30 12:51:55.521
cms8rbqks0064ijntbq46cnak	cms8r91bn0000ijcjsr0zc6lu	cms8rbq6b0060ijntt9dlgq50	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-29 07:28:01.895
cms8rbqm20066ijntkgtkft33	cms8r91bn0000ijcjsr0zc6lu	cms8rbq6b0060ijntt9dlgq50	ASSIGNED	\N	Michael Lee	cms8r925a0004ijcjjy1w8w4t	2026-07-29 07:38:01.895
cms8rbqnc0068ijntwrgdvwxz	cms8r91bn0000ijcjsr0zc6lu	cms8rbq6b0060ijntt9dlgq50	STATUS_CHANGED	OPEN	RESOLVED	cms8r927b000aijcjt7sutffd	2026-07-29 10:13:11.115
cms8rbr1z006eijntu1oyin08	cms8r91bn0000ijcjsr0zc6lu	cms8rbqon006aijnti8akjfxw	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-26 06:27:40.989
cms8rbr38006gijntpmy6qgpx	cms8r91bn0000ijcjsr0zc6lu	cms8rbqon006aijnti8akjfxw	ASSIGNED	\N	John Doe	cms8r925a0004ijcjjy1w8w4t	2026-07-26 06:37:40.989
cms8rbr4j006iijnt5cwnugmj	cms8r91bn0000ijcjsr0zc6lu	cms8rbqon006aijnti8akjfxw	STATUS_CHANGED	OPEN	CLOSED	cms8r91xj0002ijcjijcbf0gt	2026-07-26 12:17:02.536
cms8rbrhx006oijnt5jc23bco	cms8r91bn0000ijcjsr0zc6lu	cms8rbr5u006kijnt77p2l0up	CREATED	\N	\N	cms8r925a0004ijcjjy1w8w4t	2026-07-31 07:57:08.797
cms8rbrj7006qijnt70z9kyxm	cms8r91bn0000ijcjsr0zc6lu	cms8rbr5u006kijnt77p2l0up	ASSIGNED	\N	Sarah Wilson	cms8r925a0004ijcjjy1w8w4t	2026-07-31 08:07:08.797
cms8rbrkg006sijnt0wp07ocs	cms8r91bn0000ijcjsr0zc6lu	cms8rbr5u006kijnt77p2l0up	STATUS_CHANGED	OPEN	IN_PROGRESS	cms8r925t0006ijcj6sny475l	2026-07-31 13:00:14.439
\.


--
-- Data for Name: TicketSLA; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TicketSLA" (id, "ticketId", "firstResponseTimeMins", "resolutionTimeMins", "businessHoursEnabled", "firstResponseBreachAt", "resolutionBreachAt", "firstRespondedAt", "resolvedAt") FROM stdin;
cms8rbh3s000wijntsv8q1tsj	cms8rbgtl000uijntbne17g0e	120	1440	t	2026-07-31 06:32:39.498	2026-08-01 04:32:39.498	2026-07-31 05:44:39.498	\N
cms8rbhru0014ijntc80e8pgc	cms8rbhlq0012ijnt2eru7kf4	30	480	t	2026-07-31 09:16:05.607	2026-07-31 16:46:05.607	2026-07-31 09:04:05.607	\N
cms8rbi8p001eijnt0h3ktqh5	cms8rbi2q001cijntv1lbvyez	120	1440	t	2026-07-29 08:44:34.697	2026-07-30 06:44:34.697	2026-07-29 07:56:34.697	2026-07-29 07:44:59.211
cms8rbiog001oijntdytusrtx	cms8rbiif001mijntzqdjbg6u	240	2880	t	2026-07-26 11:27:01.344	2026-07-28 07:27:01.344	2026-07-26 09:51:01.344	2026-07-26 11:43:20.094
cms8rbj48001yijntynyvmwc9	cms8rbiy9001wijntq7tc2eaw	240	2880	t	2026-07-31 09:16:14.454	2026-08-02 05:16:14.454	\N	\N
cms8rbjhn0024ijnt9sx5afpu	cms8rbjbj0022ijnt9g1dy37r	480	5760	t	2026-07-31 01:24:18.999	2026-08-03 17:24:18.999	2026-07-30 22:12:18.999	\N
cms8rbjxo002eijnto83fkkap	cms8rbjrk002cijnt9v8vg1mn	120	1440	t	2026-07-30 22:18:33.855	2026-07-31 20:18:33.855	2026-07-30 21:30:33.855	\N
cms8rbkcd002mijnt920r9pcc	cms8rbk6a002kijntvvfzs5y0	30	480	t	2026-07-31 01:47:49.301	2026-07-31 09:17:49.301	2026-07-31 01:35:49.301	\N
cms8rbksa002wijntrjqknaa7	cms8rbkma002uijntglo47kdb	480	5760	t	2026-07-29 22:34:44.069	2026-08-02 14:34:44.069	2026-07-29 19:22:44.069	2026-07-29 14:37:03.464
cms8rbl880036ijntreup8tpm	cms8rbl230034ijntu937w6tk	240	2880	t	2026-07-30 20:24:01.817	2026-08-01 16:24:01.817	\N	\N
cms8rbllh003cijntbzgx454z	cms8rblfh003aijntnodm6nsb	120	1440	t	2026-07-25 09:17:53.563	2026-07-26 07:17:53.563	2026-07-25 08:29:53.563	2026-07-25 08:07:45.342
cms8rbm4c003mijntckewi6te	cms8rblyc003kijntc1s76g6j	240	2880	t	2026-07-30 15:28:01.122	2026-08-01 11:28:01.122	2026-07-30 13:52:01.122	\N
cms8rbmkk003wijnt3hwxtakr	cms8rbme3003uijntq4gujfra	30	480	t	2026-07-30 22:59:23.24	2026-07-31 06:29:23.24	2026-07-30 22:47:23.24	\N
cms8rbmz30044ijntdshku0oy	cms8rbmt10042ijntb4uuefid	120	1440	t	2026-07-31 01:11:32.884	2026-07-31 23:11:32.884	2026-07-31 00:23:32.884	\N
cms8rbney004eijnt3nn34glf	cms8rbn8w004cijntpl68xz7i	120	1440	t	2026-07-27 16:10:47.149	2026-07-28 14:10:47.149	2026-07-27 15:22:47.149	2026-07-27 17:35:09.084
cms8rbnv3004oijntgx3nk3j6	cms8rbnoz004mijntgvvoezc0	240	2880	t	2026-07-30 14:22:56.411	2026-08-01 10:22:56.411	\N	\N
cms8rbo8o004uijnt3t4l7ort	cms8rbo2e004sijntacdeoxxg	480	5760	t	2026-07-27 16:25:30.048	2026-07-31 08:25:30.048	2026-07-27 13:13:30.048	2026-07-27 11:25:58.031
cms8rboom0054ijntlvthy7mt	cms8rboin0052ijnt7ne1ktqi	480	5760	t	2026-07-24 14:42:05.035	2026-07-28 06:42:05.035	2026-07-24 11:30:05.035	2026-07-24 12:35:24.262
cms8rbp4l005eijnt6dt1eoa3	cms8rboyg005cijntjmlxtcy3	30	480	t	2026-07-30 15:01:06.813	2026-07-30 22:31:06.813	2026-07-30 14:49:06.813	\N
cms8rbpj8005mijntsrjk3rt8	cms8rbpd6005kijntrv6jej0c	120	1440	t	2026-07-30 12:53:14.271	2026-07-31 10:53:14.271	2026-07-30 12:05:14.271	\N
cms8rbpz0005wijntbisvhihl	cms8rbpt1005uijntsiak8yf1	120	1440	t	2026-07-30 14:51:55.521	2026-07-31 12:51:55.521	\N	\N
cms8rbqch0062ijntoib7n7ms	cms8rbq6b0060ijntt9dlgq50	240	2880	t	2026-07-29 11:28:01.895	2026-07-31 07:28:01.895	2026-07-29 09:52:01.895	2026-07-29 10:13:11.115
cms8rbquo006cijntxmct4ke1	cms8rbqon006aijnti8akjfxw	480	5760	t	2026-07-26 14:27:40.989	2026-07-30 06:27:40.989	2026-07-26 11:15:40.989	2026-07-26 12:17:02.536
cms8rbrby006mijntgdchqa2v	cms8rbr5u006kijnt77p2l0up	30	480	t	2026-07-31 08:27:08.797	2026-07-31 15:57:08.797	2026-07-31 08:15:08.797	\N
cms8rqw4m0003ijn7skxu6ogz	cms8rqvnu0001ijn7klrj03mh	240	2880	t	\N	\N	\N	\N
cms8ucrmj000cijcqsdotps67	cms8ucrdi000aijcqi6g05cef	240	2880	t	\N	\N	\N	\N
cms8ue41d000hijcqhu98dj1p	cms8ue3to000fijcq3cftl3mh	240	2880	t	\N	\N	\N	\N
cms8ujcgf000nijcq3lpf48wu	cms8ujc77000lijcqg14fgay6	240	2880	t	\N	\N	\N	\N
cmsczd4je0003kz04krkh7y5x	cmsczd3by0001kz048dx0c47r	240	2880	t	\N	\N	\N	\N
cmsd280q50003js04qrfmd7v1	cmsd27ynb0001js045q95n0hg	240	2880	t	\N	\N	\N	\N
cmsd4cmfk0005ij6a27ph27hw	cmsd4cm7a0003ij6axkixsfno	240	2880	t	\N	\N	\N	\N
cmsd4iepq000aij6adk6yt8d6	cmsd4ieh50008ij6aesp4pj95	240	2880	t	\N	\N	\N	\N
cmsd7nz2w0003jw04l501n45g	cmsd7nx2g0001jw04k7pvfpaf	240	2880	t	\N	\N	\N	\N
\.


--
-- Data for Name: TicketTag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TicketTag" (id, "tenantId", name, color) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, password, status, role, "tenantId", "createdAt", "createdBy", "updatedAt", "updatedBy", "activatedAt", "avatarUrl", "clientId", "deletedAt", "firstName", "invitationExpiresAt", "invitationTokenHash", "invitedAt", "lastName", "mustChangePassword") FROM stdin;
cmsboi1wh0007ijrd99lc9xzy	shreyaspoojari6@gmail.com	66de55e2e779680e67574c6d84fc1c2f	INVITED	CLIENT	cms8r91bn0000ijcjsr0zc6lu	2026-08-02 10:49:56.514	cms8r925a0004ijcjjy1w8w4t	2026-08-02 10:49:56.845	cms8r925a0004ijcjjy1w8w4t	\N	\N	cmsboi0ut0001ijrdt9v7gcpg	\N	Shreyas	2026-08-03 10:49:56.508	b09e0497032900c63482ca015ff159b7ecc6f591ca8f108bc991534ca4a4f8ea	2026-08-02 10:49:56.843	Ananda Poojary	f
cmsbp2sx8000fijrdzficocmc	s6361915763@gmail.com	$argon2id$v=19$m=65536,p=1,t=3$/zmmvcRwEnX9OIdtpCdg5w$TqswG8fT+gGWDwLefMjLEF+3ClfYqHKZPB9Dau9Gy+k	ACTIVE	CLIENT	cms8r91bn0000ijcjsr0zc6lu	2026-08-02 11:06:04.652	cms8r925a0004ijcjjy1w8w4t	2026-08-02 11:21:18.66	cms8r925a0004ijcjjy1w8w4t	\N	\N	cmsbp2s4p0009ijrdfmg82xdy	\N	Shreyas	2026-08-03 11:06:04.648	\N	2026-08-02 11:06:05.021	Ananda Poojary	f
cmsbqags9000hiju6ggzv4kda	1by23is202@bmsit.in	36464e31159d4c2a49c4e3ec1a9e040a	INVITED	CLIENT	cms8r91bn0000ijcjsr0zc6lu	2026-08-02 11:40:01.786	cms8r925a0004ijcjjy1w8w4t	2026-08-02 11:40:01.984	cms8r925a0004ijcjjy1w8w4t	\N	\N	cmsbqag1x000biju6a1yq0zh9	\N	cdccdc	2026-08-03 11:40:01.781	3f36b81361f383dc0582459259a1905abafc9fcfd7faf85f0ea0249584c4d106	2026-08-02 11:40:01.982	User	f
cms8r925z0008ijcjup5f0y2u	platform@elipsonics.com	$argon2id$v=19$m=65536,p=4,t=3$ILWoGj106Ze5nFZvPErWCw$e3TpC0PKD8OTE9mvAXCXjcScPtom2EBfvGL8MVyQFvU	ACTIVE	PLATFORM_ADMIN	cms8r91bn0000ijcjsr0zc6lu	2026-07-31 09:43:36.967	\N	2026-08-03 05:33:19.758	\N	2026-07-31 09:43:36.96	\N	\N	\N	Platform	\N	\N	\N	Admin	f
cms8r925a0004ijcjjy1w8w4t	admin@elipsonics.com	$argon2id$v=19$m=65536,p=4,t=3$ILWoGj106Ze5nFZvPErWCw$e3TpC0PKD8OTE9mvAXCXjcScPtom2EBfvGL8MVyQFvU	ACTIVE	TENANT_ADMIN	cms8r91bn0000ijcjsr0zc6lu	2026-07-31 09:43:36.966	\N	2026-08-03 05:33:19.882	\N	2026-07-31 09:43:36.96	\N	\N	\N	Arun	\N	\N	\N	Sharma	f
cms8r91xj0002ijcjijcbf0gt	john.doe@elipsonics.com	$argon2id$v=19$m=65536,p=4,t=3$qCWhW70tqQuVz4anNNtaWQ$3MmY1BeTUNIigUZl5mljimN3i/Y8kWGWEuV0SNy6Eoc	ACTIVE	ENGINEER	cms8r91bn0000ijcjsr0zc6lu	2026-07-31 09:43:36.966	\N	2026-08-03 05:33:19.939	\N	2026-07-31 09:43:36.96	\N	\N	\N	John	\N	\N	\N	Doe	f
cms8r925t0006ijcj6sny475l	sarah.wilson@elipsonics.com	$argon2id$v=19$m=65536,p=4,t=3$qCWhW70tqQuVz4anNNtaWQ$3MmY1BeTUNIigUZl5mljimN3i/Y8kWGWEuV0SNy6Eoc	ACTIVE	ENGINEER	cms8r91bn0000ijcjsr0zc6lu	2026-07-31 09:43:36.967	\N	2026-08-03 05:33:20.003	\N	2026-07-31 09:43:36.961	\N	\N	\N	Sarah	\N	\N	\N	Wilson	f
cms8r927b000aijcjt7sutffd	michael.lee@elipsonics.com	$argon2id$v=19$m=65536,p=4,t=3$qCWhW70tqQuVz4anNNtaWQ$3MmY1BeTUNIigUZl5mljimN3i/Y8kWGWEuV0SNy6Eoc	ACTIVE	ENGINEER	cms8r91bn0000ijcjsr0zc6lu	2026-07-31 09:43:36.967	\N	2026-08-03 05:33:20.068	\N	2026-07-31 09:43:36.961	\N	\N	\N	Michael	\N	\N	\N	Lee	f
cms8r92zm000eijcj48pzmyhn	priya@acme.com	$argon2id$v=19$m=65536,p=4,t=3$M89JxEjNINNt3E6sCbGO5w$1fIK6fPmJQK3vUXkCFcDC2nfnsNl5gkA6fjNsJ5GZ44	ACTIVE	CLIENT	cms8r91bn0000ijcjsr0zc6lu	2026-07-31 09:43:38.337	\N	2026-08-03 05:33:20.13	\N	2026-07-31 09:43:38.336	\N	cms8r92j9000cijcjl6i2t3xt	\N	Priya	\N	\N	\N	Sharma	f
cmse9qiwm000hl404gsngawxi	anibhai619@gmail.com	9b96057ea03452b2a02a92bb4a3f70e5	INVITED	TENANT_ADMIN	cmse9qikk000el404q6bqcmpm	2026-08-04 06:19:56.086	cms8r925z0008ijcjup5f0y2u	2026-08-04 06:19:56.303	cms8r925z0008ijcjup5f0y2u	\N	\N	\N	\N	Shreyas	2026-08-05 06:19:56.085	f419f218f647fb10e96bc26509f8aa396e4c4ecdb324a7b5ae0e516b61540136	2026-08-04 06:19:56.302	Ananda Poojary	f
cmse9uox1000cl804kqmf8shd	shreyas9512005@gmail.com	57a6c39a3583789cd51b69bbe28fe856	INVITED	TENANT_ADMIN	cmse9uoe30009l8043q8lats1	2026-08-04 06:23:10.501	cms8r925z0008ijcjup5f0y2u	2026-08-04 06:23:10.956	cms8r925z0008ijcjup5f0y2u	\N	\N	\N	\N	jane	2026-08-05 06:23:10.5	e7fd54c0955776fee72810fb27430a2c94af8a9b31870e4659121b07ee46d641	2026-08-04 06:23:10.955	D	f
\.


--
-- Data for Name: _TicketToTicketTag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."_TicketToTicketTag" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f39b9cb9-36bb-403b-b9e0-88ae0a5daa6f	4d80c8d190108dafedef51bde5ba07b8effdfb1c47b11c4ca9cb70b474e72379	2026-07-31 09:28:27.474144+00	20260726112753_init_phase_0	\N	\N	2026-07-31 09:28:27.235028+00	1
6cb9990d-1b5f-47cb-9e45-7faa715fc528	66783a326825095e4f10d15070c20aff7c9414e71a8654d53f4462678c56fe5a	2026-07-31 09:28:27.78323+00	20260726160840_identity_foundation	\N	\N	2026-07-31 09:28:27.55824+00	1
b0d7fc95-aebd-4f1f-87ef-62f0b4052601	27a0426b122dd0ae4276c650f55aee1cd2680bbb45eb2929d4816a9e272fa8a9	2026-07-31 09:28:28.100988+00	20260726165219_add_password_reset	\N	\N	2026-07-31 09:28:27.868708+00	1
e0c95f38-2a0a-4586-9967-5ca1c4a0d0aa	e6e1cb9ac32895c3aa39834a99a00f292d47f8e21cbd601501effed2cdaab468	2026-07-31 09:28:28.390386+00	20260726192805_rename_roles	\N	\N	2026-07-31 09:28:28.182662+00	1
\.


--
-- Data for Name: playing_with_neon; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.playing_with_neon (id, name, value) FROM stdin;
1	c4ca4238a0	0.00040672597
2	c81e728d9d	0.105920985
3	eccbc87e4b	0.5850027
4	a87ff679a2	0.4058704
5	e4da3b7fbb	0.007605405
6	1679091c5a	0.605752
7	8f14e45fce	0.52478147
8	c9f0f895fb	0.5980575
9	45c48cce2e	0.73184633
10	d3d9446802	0.41673106
11	c4ca4238a0	0.98184377
12	c81e728d9d	0.3197003
13	eccbc87e4b	0.76448864
14	a87ff679a2	0.46822542
15	e4da3b7fbb	0.35644516
16	1679091c5a	0.39299417
17	8f14e45fce	0.11389814
18	c9f0f895fb	0.35011032
19	45c48cce2e	0.33278722
20	d3d9446802	0.82232255
21	c4ca4238a0	0.5184876
22	c81e728d9d	0.44326502
23	eccbc87e4b	0.93576187
24	a87ff679a2	0.20952247
25	e4da3b7fbb	0.8061166
26	1679091c5a	0.013157614
27	8f14e45fce	0.299878
28	c9f0f895fb	0.29885253
29	45c48cce2e	0.55037874
30	d3d9446802	0.5069561
31	c4ca4238a0	0.017137798
32	c81e728d9d	0.3307477
33	eccbc87e4b	0.46655798
34	a87ff679a2	0.016444644
35	e4da3b7fbb	0.8435092
36	1679091c5a	0.32517135
37	8f14e45fce	0.8533684
38	c9f0f895fb	0.49136803
39	45c48cce2e	0.9086751
40	d3d9446802	0.5818125
41	c4ca4238a0	0.8089551
42	c81e728d9d	0.9918521
43	eccbc87e4b	0.21880826
44	a87ff679a2	0.26380637
45	e4da3b7fbb	0.47903204
46	1679091c5a	0.1927449
47	8f14e45fce	0.6167669
48	c9f0f895fb	0.57406783
49	45c48cce2e	0.8572575
50	d3d9446802	0.4693609
51	c4ca4238a0	0.6545152
52	c81e728d9d	0.70589155
53	eccbc87e4b	0.5053192
54	a87ff679a2	0.33796707
55	e4da3b7fbb	0.41822064
56	1679091c5a	0.9438461
57	8f14e45fce	0.814002
58	c9f0f895fb	0.36549255
59	45c48cce2e	0.37164238
60	d3d9446802	0.4920467
61	c4ca4238a0	0.21478419
62	c81e728d9d	0.8911897
63	eccbc87e4b	0.5524836
64	a87ff679a2	0.35994542
65	e4da3b7fbb	0.7882437
66	1679091c5a	0.6401363
67	8f14e45fce	0.15478134
68	c9f0f895fb	0.2580675
69	45c48cce2e	0.29382315
70	d3d9446802	0.67689383
71	c4ca4238a0	0.18695179
72	c81e728d9d	0.39043948
73	eccbc87e4b	0.98371965
74	a87ff679a2	0.75283766
75	e4da3b7fbb	0.18940547
76	1679091c5a	0.9606427
77	8f14e45fce	0.2253511
78	c9f0f895fb	0.18659678
79	45c48cce2e	0.7432127
80	d3d9446802	0.7155946
\.


--
-- Name: playing_with_neon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.playing_with_neon_id_seq', 80, true);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: BusinessHours BusinessHours_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BusinessHours"
    ADD CONSTRAINT "BusinessHours_pkey" PRIMARY KEY (id);


--
-- Name: Client Client_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Client"
    ADD CONSTRAINT "Client_pkey" PRIMARY KEY (id);


--
-- Name: Holiday Holiday_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Holiday"
    ADD CONSTRAINT "Holiday_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: PasswordResetToken PasswordResetToken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: SLAPolicy SLAPolicy_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SLAPolicy"
    ADD CONSTRAINT "SLAPolicy_pkey" PRIMARY KEY (id);


--
-- Name: SLATier SLATier_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SLATier"
    ADD CONSTRAINT "SLATier_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: Tenant Tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tenant"
    ADD CONSTRAINT "Tenant_pkey" PRIMARY KEY (id);


--
-- Name: TicketAttachment TicketAttachment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketAttachment"
    ADD CONSTRAINT "TicketAttachment_pkey" PRIMARY KEY (id);


--
-- Name: TicketCategory TicketCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketCategory"
    ADD CONSTRAINT "TicketCategory_pkey" PRIMARY KEY (id);


--
-- Name: TicketComment TicketComment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketComment"
    ADD CONSTRAINT "TicketComment_pkey" PRIMARY KEY (id);


--
-- Name: TicketHistory TicketHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketHistory"
    ADD CONSTRAINT "TicketHistory_pkey" PRIMARY KEY (id);


--
-- Name: TicketSLA TicketSLA_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketSLA"
    ADD CONSTRAINT "TicketSLA_pkey" PRIMARY KEY (id);


--
-- Name: TicketTag TicketTag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketTag"
    ADD CONSTRAINT "TicketTag_pkey" PRIMARY KEY (id);


--
-- Name: Ticket Ticket_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _TicketToTicketTag _TicketToTicketTag_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_TicketToTicketTag"
    ADD CONSTRAINT "_TicketToTicketTag_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: playing_with_neon playing_with_neon_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.playing_with_neon
    ADD CONSTRAINT playing_with_neon_pkey PRIMARY KEY (id);


--
-- Name: AuditLog_action_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AuditLog_action_idx" ON public."AuditLog" USING btree (action);


--
-- Name: AuditLog_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AuditLog_createdAt_idx" ON public."AuditLog" USING btree ("createdAt");


--
-- Name: AuditLog_entity_entityId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "AuditLog_entity_entityId_idx" ON public."AuditLog" USING btree (entity, "entityId");


--
-- Name: BusinessHours_projectId_dayOfWeek_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "BusinessHours_projectId_dayOfWeek_key" ON public."BusinessHours" USING btree ("projectId", "dayOfWeek");


--
-- Name: BusinessHours_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BusinessHours_tenantId_idx" ON public."BusinessHours" USING btree ("tenantId");


--
-- Name: Client_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Client_name_idx" ON public."Client" USING btree (name);


--
-- Name: Client_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Client_status_idx" ON public."Client" USING btree (status);


--
-- Name: Client_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Client_tenantId_idx" ON public."Client" USING btree ("tenantId");


--
-- Name: Client_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Client_tenantId_name_key" ON public."Client" USING btree ("tenantId", name);


--
-- Name: Holiday_projectId_holidayDate_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Holiday_projectId_holidayDate_key" ON public."Holiday" USING btree ("projectId", "holidayDate");


--
-- Name: Holiday_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Holiday_tenantId_idx" ON public."Holiday" USING btree ("tenantId");


--
-- Name: Notification_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Notification_createdAt_idx" ON public."Notification" USING btree ("createdAt");


--
-- Name: Notification_isRead_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Notification_isRead_idx" ON public."Notification" USING btree ("isRead");


--
-- Name: Notification_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Notification_userId_idx" ON public."Notification" USING btree ("userId");


--
-- Name: PasswordResetToken_expiresAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PasswordResetToken_expiresAt_idx" ON public."PasswordResetToken" USING btree ("expiresAt");


--
-- Name: PasswordResetToken_tokenHash_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON public."PasswordResetToken" USING btree ("tokenHash");


--
-- Name: PasswordResetToken_userId_expiresAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PasswordResetToken_userId_expiresAt_idx" ON public."PasswordResetToken" USING btree ("userId", "expiresAt");


--
-- Name: PasswordResetToken_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PasswordResetToken_userId_idx" ON public."PasswordResetToken" USING btree ("userId");


--
-- Name: Project_clientId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Project_clientId_idx" ON public."Project" USING btree ("clientId");


--
-- Name: Project_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Project_status_idx" ON public."Project" USING btree (status);


--
-- Name: Project_tenantId_clientId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Project_tenantId_clientId_name_key" ON public."Project" USING btree ("tenantId", "clientId", name);


--
-- Name: Project_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Project_tenantId_idx" ON public."Project" USING btree ("tenantId");


--
-- Name: SLAPolicy_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "SLAPolicy_tenantId_key" ON public."SLAPolicy" USING btree ("tenantId");


--
-- Name: SLATier_policyId_priority_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "SLATier_policyId_priority_key" ON public."SLATier" USING btree ("policyId", priority);


--
-- Name: Session_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Session_tenantId_idx" ON public."Session" USING btree ("tenantId");


--
-- Name: Session_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Session_userId_idx" ON public."Session" USING btree ("userId");


--
-- Name: Tenant_deletedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Tenant_deletedAt_idx" ON public."Tenant" USING btree ("deletedAt");


--
-- Name: Tenant_domain_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Tenant_domain_key" ON public."Tenant" USING btree (domain);


--
-- Name: Tenant_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Tenant_name_idx" ON public."Tenant" USING btree (name);


--
-- Name: Tenant_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Tenant_slug_key" ON public."Tenant" USING btree (slug);


--
-- Name: Tenant_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Tenant_status_idx" ON public."Tenant" USING btree (status);


--
-- Name: TicketAttachment_ticketId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TicketAttachment_ticketId_idx" ON public."TicketAttachment" USING btree ("ticketId");


--
-- Name: TicketCategory_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TicketCategory_tenantId_idx" ON public."TicketCategory" USING btree ("tenantId");


--
-- Name: TicketCategory_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TicketCategory_tenantId_name_key" ON public."TicketCategory" USING btree ("tenantId", name);


--
-- Name: TicketComment_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TicketComment_createdAt_idx" ON public."TicketComment" USING btree ("createdAt");


--
-- Name: TicketComment_ticketId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TicketComment_ticketId_idx" ON public."TicketComment" USING btree ("ticketId");


--
-- Name: TicketHistory_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TicketHistory_createdAt_idx" ON public."TicketHistory" USING btree ("createdAt");


--
-- Name: TicketHistory_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TicketHistory_tenantId_idx" ON public."TicketHistory" USING btree ("tenantId");


--
-- Name: TicketHistory_ticketId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TicketHistory_ticketId_idx" ON public."TicketHistory" USING btree ("ticketId");


--
-- Name: TicketSLA_ticketId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TicketSLA_ticketId_key" ON public."TicketSLA" USING btree ("ticketId");


--
-- Name: TicketTag_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TicketTag_tenantId_idx" ON public."TicketTag" USING btree ("tenantId");


--
-- Name: TicketTag_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TicketTag_tenantId_name_key" ON public."TicketTag" USING btree ("tenantId", name);


--
-- Name: Ticket_assignedToId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Ticket_assignedToId_idx" ON public."Ticket" USING btree ("assignedToId");


--
-- Name: Ticket_clientId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Ticket_clientId_idx" ON public."Ticket" USING btree ("clientId");


--
-- Name: Ticket_closedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Ticket_closedAt_idx" ON public."Ticket" USING btree ("closedAt");


--
-- Name: Ticket_projectId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Ticket_projectId_idx" ON public."Ticket" USING btree ("projectId");


--
-- Name: Ticket_resolvedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Ticket_resolvedAt_idx" ON public."Ticket" USING btree ("resolvedAt");


--
-- Name: Ticket_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Ticket_status_idx" ON public."Ticket" USING btree (status);


--
-- Name: Ticket_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Ticket_tenantId_idx" ON public."Ticket" USING btree ("tenantId");


--
-- Name: Ticket_tenantId_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Ticket_tenantId_number_key" ON public."Ticket" USING btree ("tenantId", number);


--
-- Name: User_clientId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_clientId_idx" ON public."User" USING btree ("clientId");


--
-- Name: User_deletedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_deletedAt_idx" ON public."User" USING btree ("deletedAt");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_invitationTokenHash_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_invitationTokenHash_key" ON public."User" USING btree ("invitationTokenHash");


--
-- Name: User_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_tenantId_idx" ON public."User" USING btree ("tenantId");


--
-- Name: _TicketToTicketTag_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_TicketToTicketTag_B_index" ON public."_TicketToTicketTag" USING btree ("B");


--
-- Name: BusinessHours BusinessHours_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BusinessHours"
    ADD CONSTRAINT "BusinessHours_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BusinessHours BusinessHours_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BusinessHours"
    ADD CONSTRAINT "BusinessHours_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Client Client_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Client"
    ADD CONSTRAINT "Client_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Holiday Holiday_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Holiday"
    ADD CONSTRAINT "Holiday_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Holiday Holiday_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Holiday"
    ADD CONSTRAINT "Holiday_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Ticket"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PasswordResetToken PasswordResetToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Project Project_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Project Project_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SLAPolicy SLAPolicy_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SLAPolicy"
    ADD CONSTRAINT "SLAPolicy_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SLATier SLATier_policyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SLATier"
    ADD CONSTRAINT "SLATier_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES public."SLAPolicy"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TicketAttachment TicketAttachment_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketAttachment"
    ADD CONSTRAINT "TicketAttachment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Ticket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TicketAttachment TicketAttachment_uploaderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketAttachment"
    ADD CONSTRAINT "TicketAttachment_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TicketCategory TicketCategory_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketCategory"
    ADD CONSTRAINT "TicketCategory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TicketComment TicketComment_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketComment"
    ADD CONSTRAINT "TicketComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TicketComment TicketComment_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketComment"
    ADD CONSTRAINT "TicketComment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Ticket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TicketHistory TicketHistory_changedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketHistory"
    ADD CONSTRAINT "TicketHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TicketHistory TicketHistory_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketHistory"
    ADD CONSTRAINT "TicketHistory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TicketHistory TicketHistory_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketHistory"
    ADD CONSTRAINT "TicketHistory_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Ticket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TicketSLA TicketSLA_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketSLA"
    ADD CONSTRAINT "TicketSLA_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Ticket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TicketTag TicketTag_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TicketTag"
    ADD CONSTRAINT "TicketTag_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ticket Ticket_assignedToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Ticket Ticket_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."TicketCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Ticket Ticket_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ticket Ticket_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ticket Ticket_reportedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Ticket Ticket_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _TicketToTicketTag _TicketToTicketTag_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_TicketToTicketTag"
    ADD CONSTRAINT "_TicketToTicketTag_A_fkey" FOREIGN KEY ("A") REFERENCES public."Ticket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _TicketToTicketTag _TicketToTicketTag_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_TicketToTicketTag"
    ADD CONSTRAINT "_TicketToTicketTag_B_fkey" FOREIGN KEY ("B") REFERENCES public."TicketTag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict ghlLX3YbXUG74SIS48AjwDicV6J8xkY9qYUaSHZyIS2N9LBDYQ6Dgz31U4UWcvj

