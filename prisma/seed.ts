import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const defaultTenant = await prisma.tenant.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      name: 'Default Organization',
      slug: 'default',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@default.com' },
    update: {},
    create: {
      email: 'admin@default.com',
      name: 'Admin User',
      password: 'hashed_password_placeholder', // TODO: integrate bcrypt when auth is implemented
      role: Role.SUPER_ADMIN,
      tenantId: defaultTenant.id,
    },
  });

  console.log('Seed executed successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
