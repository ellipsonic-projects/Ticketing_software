import {
  PrismaClient,
  Role,
  TicketHistoryAction,
  TicketPriority,
  TicketStatus,
} from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ---------------------------------------------------------------------------
  // 1. Tenant
  // ---------------------------------------------------------------------------
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'elipdesk' },
    update: {},
    create: {
      name: 'Elipdesk Tech',
      slug: 'elipdesk',
      status: 'ACTIVE',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
    },
  });
  console.log('✅ Tenant created:', tenant.slug);

  // ---------------------------------------------------------------------------
  // 2. Internal Users
  // ---------------------------------------------------------------------------
  const adminPass = await argon2.hash('Admin@1234');
  const engPass = await argon2.hash('Engineer@1234');

  const [platformAdmin, tenantAdmin, eng1, eng2, eng3] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'platform@elipdesk.com' },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'platform@elipdesk.com',
        password: adminPass,
        firstName: 'Platform',
        lastName: 'Admin',
        role: Role.PLATFORM_ADMIN,
        status: 'ACTIVE',
        activatedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: 'admin@elipdesk.com' },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'admin@elipdesk.com',
        password: adminPass,
        firstName: 'Arun',
        lastName: 'Sharma',
        role: Role.TENANT_ADMIN,
        status: 'ACTIVE',
        activatedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: 'john.doe@elipdesk.com' },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'john.doe@elipdesk.com',
        password: engPass,
        firstName: 'John',
        lastName: 'Doe',
        role: Role.ENGINEER,
        status: 'ACTIVE',
        activatedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah.wilson@elipdesk.com' },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'sarah.wilson@elipdesk.com',
        password: engPass,
        firstName: 'Sarah',
        lastName: 'Wilson',
        role: Role.ENGINEER,
        status: 'ACTIVE',
        activatedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: 'michael.lee@elipdesk.com' },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'michael.lee@elipdesk.com',
        password: engPass,
        firstName: 'Michael',
        lastName: 'Lee',
        role: Role.ENGINEER,
        status: 'ACTIVE',
        activatedAt: new Date(),
      },
    }),
  ]);
  console.log('✅ Users created');

  // ---------------------------------------------------------------------------
  // 3. Client (Acme Corporation)
  // ---------------------------------------------------------------------------
  const client = await prisma.client.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Acme Corporation' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Acme Corporation',
      code: 'ACME',
      email: 'contact@acme.com',
      phone: '+91-9876543210',
      contactName: 'Priya Sharma',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Client created:', client.name);

  // ---------------------------------------------------------------------------
  // 4. Client User Account
  // ---------------------------------------------------------------------------
  const clientPass = await argon2.hash('Client@1234');
  const portalAccount = await prisma.user.upsert({
    where: { email: 'priya@acme.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      clientId: client.id,
      email: 'priya@acme.com',
      password: clientPass,
      firstName: 'Priya',
      lastName: 'Sharma',
      role: Role.CLIENT,
      status: 'ACTIVE',
      activatedAt: new Date(),
    },
  });
  console.log('✅ Client User created:', portalAccount.email);

  // ---------------------------------------------------------------------------
  // 5. Projects with SLA policies
  // ---------------------------------------------------------------------------
  const projectDefs = [
    { name: 'CRM Portal', code: 'CRM', color: '#6366f1', responseMin: 60, resolutionMin: 480 },
    {
      name: 'Website Redesign',
      code: 'WEB',
      color: '#8b5cf6',
      responseMin: 120,
      resolutionMin: 720,
    },
    { name: 'API Integration', code: 'API', color: '#10b981', responseMin: 30, resolutionMin: 240 },
    { name: 'Mobile App', code: 'MOB', color: '#f59e0b', responseMin: 60, resolutionMin: 480 },
  ];

  const projects = await Promise.all(
    projectDefs.map(async (pd) => {
      const project = await prisma.project.upsert({
        where: {
          tenantId_clientId_name: { tenantId: tenant.id, clientId: client.id, name: pd.name },
        },
        update: {},
        create: {
          tenantId: tenant.id,
          clientId: client.id,
          name: pd.name,
          code: pd.code,
          color: pd.color,
          status: 'ACTIVE',
          supportStatus: 'ENABLED',
        },
      });

      return project;
    }),
  );
  console.log('✅ Projects created');

  // Seed Tenant SLA Policy
  const slaPolicy = await prisma.sLAPolicy.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      businessHoursEnabled: true,
      tiers: {
        create: [
          { priority: 'LOW', responseTimeMinutes: 480, resolutionTimeMinutes: 5760 },
          { priority: 'MEDIUM', responseTimeMinutes: 240, resolutionTimeMinutes: 2880 },
          { priority: 'HIGH', responseTimeMinutes: 120, resolutionTimeMinutes: 1440 },
          { priority: 'URGENT', responseTimeMinutes: 30, resolutionTimeMinutes: 480 },
        ],
      },
    },
  });
  console.log('✅ Tenant SLA Policy created');

  // ---------------------------------------------------------------------------
  // 6. Tickets
  // ---------------------------------------------------------------------------
  const engineers = [eng1, eng2, eng3];

  const ticketDefs = [
    // CRM Portal — project 0
    {
      project: 0,
      title: 'Login button unresponsive on mobile',
      status: 'OPEN' as TicketStatus,
      priority: 'HIGH' as TicketPriority,
      assignedIdx: 0,
    },
    {
      project: 0,
      title: 'Export to CSV fails for large datasets',
      status: 'IN_PROGRESS' as TicketStatus,
      priority: 'URGENT' as TicketPriority,
      assignedIdx: 1,
    },
    {
      project: 0,
      title: 'Dashboard shows incorrect revenue figures',
      status: 'RESOLVED' as TicketStatus,
      priority: 'HIGH' as TicketPriority,
      assignedIdx: 0,
      daysAgo: 2,
    },
    {
      project: 0,
      title: 'Search results not paginated correctly',
      status: 'CLOSED' as TicketStatus,
      priority: 'MEDIUM' as TicketPriority,
      assignedIdx: 2,
      daysAgo: 5,
    },
    {
      project: 0,
      title: 'Email notifications not delivered',
      status: 'OPEN' as TicketStatus,
      priority: 'MEDIUM' as TicketPriority,
      assignedIdx: null,
    },
    {
      project: 0,
      title: 'Custom fields not saving on user profile',
      status: 'IN_PROGRESS' as TicketStatus,
      priority: 'LOW' as TicketPriority,
      assignedIdx: 1,
    },
    // Website Redesign — project 1
    {
      project: 1,
      title: 'Hero banner image broken on Safari',
      status: 'OPEN' as TicketStatus,
      priority: 'HIGH' as TicketPriority,
      assignedIdx: 2,
    },
    {
      project: 1,
      title: 'Contact form submissions not forwarded',
      status: 'IN_PROGRESS' as TicketStatus,
      priority: 'URGENT' as TicketPriority,
      assignedIdx: 0,
    },
    {
      project: 1,
      title: 'Footer links pointing to 404',
      status: 'RESOLVED' as TicketStatus,
      priority: 'LOW' as TicketPriority,
      assignedIdx: 1,
      daysAgo: 1,
    },
    {
      project: 1,
      title: 'SEO meta tags missing on blog posts',
      status: 'OPEN' as TicketStatus,
      priority: 'MEDIUM' as TicketPriority,
      assignedIdx: null,
    },
    {
      project: 1,
      title: 'Responsive layout broken on tablet',
      status: 'CLOSED' as TicketStatus,
      priority: 'HIGH' as TicketPriority,
      assignedIdx: 2,
      daysAgo: 6,
    },
    {
      project: 1,
      title: 'Page load time exceeds 3 seconds',
      status: 'IN_PROGRESS' as TicketStatus,
      priority: 'MEDIUM' as TicketPriority,
      assignedIdx: 0,
    },
    // API Integration — project 2
    {
      project: 2,
      title: 'OAuth token refresh failing silently',
      status: 'OPEN' as TicketStatus,
      priority: 'URGENT' as TicketPriority,
      assignedIdx: 1,
    },
    {
      project: 2,
      title: 'Rate limiting not applied correctly',
      status: 'IN_PROGRESS' as TicketStatus,
      priority: 'HIGH' as TicketPriority,
      assignedIdx: 2,
    },
    {
      project: 2,
      title: 'Webhook payload schema mismatch',
      status: 'RESOLVED' as TicketStatus,
      priority: 'HIGH' as TicketPriority,
      assignedIdx: 0,
      daysAgo: 3,
    },
    {
      project: 2,
      title: 'API response time degraded on batch calls',
      status: 'OPEN' as TicketStatus,
      priority: 'MEDIUM' as TicketPriority,
      assignedIdx: null,
    },
    {
      project: 2,
      title: 'CORS headers missing for third-party origins',
      status: 'CLOSED' as TicketStatus,
      priority: 'LOW' as TicketPriority,
      assignedIdx: 1,
      daysAgo: 4,
    },
    {
      project: 2,
      title: 'Endpoint documentation outdated',
      status: 'CLOSED' as TicketStatus,
      priority: 'LOW' as TicketPriority,
      assignedIdx: 2,
      daysAgo: 7,
    },
    // Mobile App — project 3
    {
      project: 3,
      title: 'Push notifications not received on Android 14',
      status: 'OPEN' as TicketStatus,
      priority: 'URGENT' as TicketPriority,
      assignedIdx: 0,
    },
    {
      project: 3,
      title: 'App crashes on profile screen',
      status: 'IN_PROGRESS' as TicketStatus,
      priority: 'HIGH' as TicketPriority,
      assignedIdx: 1,
    },
    {
      project: 3,
      title: 'Offline mode data not syncing on reconnect',
      status: 'OPEN' as TicketStatus,
      priority: 'HIGH' as TicketPriority,
      assignedIdx: null,
    },
    {
      project: 3,
      title: 'Camera permission dialog not shown',
      status: 'RESOLVED' as TicketStatus,
      priority: 'MEDIUM' as TicketPriority,
      assignedIdx: 2,
      daysAgo: 2,
    },
    {
      project: 3,
      title: 'Dark mode colors incorrect',
      status: 'CLOSED' as TicketStatus,
      priority: 'LOW' as TicketPriority,
      assignedIdx: 0,
      daysAgo: 5,
    },
    {
      project: 3,
      title: 'Biometric login failing on iPhone 15',
      status: 'IN_PROGRESS' as TicketStatus,
      priority: 'URGENT' as TicketPriority,
      assignedIdx: 1,
    },
  ];

  const now = new Date();

  for (let i = 0; i < ticketDefs.length; i++) {
    const def = ticketDefs[i];
    const project = projects[def.project];
    const number = i + 1;
    const daysAgo = (def as { daysAgo?: number }).daysAgo ?? 0;
    const createdAt = new Date(now.getTime() - daysAgo * 86400000 - Math.random() * 86400000);
    const updatedAt = new Date(createdAt.getTime() + Math.random() * 3600000 * 6);
    const resolvedAt = def.status === 'RESOLVED' || def.status === 'CLOSED' ? updatedAt : null;
    const closedAt = def.status === 'CLOSED' ? updatedAt : null;
    const assignedTo = def.assignedIdx !== null ? engineers[def.assignedIdx as number] : null;

    const ticket = await prisma.ticket.upsert({
      where: { tenantId_number: { tenantId: tenant.id, number } },
      update: {},
      create: {
        tenantId: tenant.id,
        projectId: project.id,
        clientId: client.id,
        number,
        title: def.title,
        description: `Detailed description for: ${def.title}. This is a production issue that needs attention.`,
        status: def.status,
        priority: def.priority,
        assignedToId: assignedTo?.id ?? null,
        reportedById: tenantAdmin.id,
        createdAt,
        updatedAt,
        resolvedAt,
        closedAt,
      },
    });

    // SLA record
    const tier = [
      { priority: 'LOW', responseTimeMinutes: 480, resolutionTimeMinutes: 5760 },
      { priority: 'MEDIUM', responseTimeMinutes: 240, resolutionTimeMinutes: 2880 },
      { priority: 'HIGH', responseTimeMinutes: 120, resolutionTimeMinutes: 1440 },
      { priority: 'URGENT', responseTimeMinutes: 30, resolutionTimeMinutes: 480 },
    ].find((t) => t.priority === ticket.priority) || {
      responseTimeMinutes: 240,
      resolutionTimeMinutes: 2880,
    };

    const responseBreachAt = new Date(createdAt.getTime() + tier.responseTimeMinutes * 60000);
    const resolutionBreachAt = new Date(createdAt.getTime() + tier.resolutionTimeMinutes * 60000);
    const firstRespondedAt = assignedTo
      ? new Date(createdAt.getTime() + tier.responseTimeMinutes * 0.6 * 60000)
      : null;

    await prisma.ticketSLA.upsert({
      where: { ticketId: ticket.id },
      update: {},
      create: {
        ticketId: ticket.id,
        firstResponseTimeMins: tier.responseTimeMinutes,
        resolutionTimeMins: tier.resolutionTimeMinutes,
        businessHoursEnabled: true,
        firstResponseBreachAt: responseBreachAt,
        resolutionBreachAt,
        firstRespondedAt,
        resolvedAt,
      },
    });

    // TicketHistory — CREATED event
    await prisma.ticketHistory.create({
      data: {
        tenantId: tenant.id,
        ticketId: ticket.id,
        action: TicketHistoryAction.CREATED,
        changedById: tenantAdmin.id,
        createdAt,
      },
    });

    // Assignment history
    if (assignedTo) {
      await prisma.ticketHistory.create({
        data: {
          tenantId: tenant.id,
          ticketId: ticket.id,
          action: TicketHistoryAction.ASSIGNED,
          newValue: `${assignedTo.firstName} ${assignedTo.lastName}`,
          changedById: tenantAdmin.id,
          createdAt: new Date(createdAt.getTime() + 600000),
        },
      });
    }

    // Status change history
    if (def.status !== 'OPEN') {
      await prisma.ticketHistory.create({
        data: {
          tenantId: tenant.id,
          ticketId: ticket.id,
          action: TicketHistoryAction.STATUS_CHANGED,
          oldValue: 'OPEN',
          newValue: def.status,
          changedById: assignedTo?.id ?? tenantAdmin.id,
          createdAt: updatedAt,
        },
      });
    }
  }
  console.log('✅ 24 tickets + SLA records + TicketHistory created');

  // ---------------------------------------------------------------------------
  // 7. Notifications for Priya
  // ---------------------------------------------------------------------------
  const notificationDefs = [
    { title: 'Ticket #2 updated', message: 'CSV export ticket is now In Progress.' },
    {
      title: 'SLA Warning on Ticket #13',
      message: 'OAuth token refresh ticket is approaching SLA breach.',
    },
    {
      title: 'New comment on Ticket #8',
      message: 'Sarah Wilson left a comment on your contact form ticket.',
    },
  ];

  await Promise.all(
    notificationDefs.map((n) =>
      prisma.notification.create({
        data: {
          tenantId: tenant.id,
          userId: portalAccount.id,
          title: n.title,
          message: n.message,
          isRead: false,
        },
      }),
    ),
  );
  console.log('✅ 3 unread notifications created for Priya');

  console.log('\n🎉 Seed complete!');
  console.log('\n📋 Login credentials:');
  console.log('  Platform Admin : platform@elipdesk.com / Admin@1234');
  console.log('  Tenant Admin   : admin@elipdesk.com / Admin@1234');
  console.log('  Engineer       : john.doe@elipdesk.com / Engineer@1234');
  console.log('  Client Portal  : priya@acme.com / Client@1234  (slug: elipdesk)');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
