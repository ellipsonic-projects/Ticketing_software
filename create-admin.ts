import { PrismaClient } from '@prisma/client';

import { hash } from './src/lib/auth/password';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@elipsonics.com';
  const passwordStr = 'Password123!';

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`User ${email} already exists.`);
    return;
  }

  // Find or create Platform Tenant
  let platformTenant = await prisma.tenant.findUnique({
    where: { slug: 'system' },
  });

  if (!platformTenant) {
    platformTenant = await prisma.tenant.create({
      data: {
        name: 'System Platform',
        slug: 'system',
        status: 'ACTIVE',
      },
    });
    console.log('Platform Tenant created.');
  }

  const password = await hash(passwordStr);

  await prisma.user.create({
    data: {
      email,
      password,
      firstName: 'Platform',
      lastName: 'Admin',
      role: 'PLATFORM_ADMIN',
      status: 'ACTIVE',
      tenantId: platformTenant.id,
    },
  });

  console.log('Platform Admin created successfully!');
  console.log('Email:', email);
  console.log('Password:', passwordStr);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
