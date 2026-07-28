import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ select: { email: true, deletedAt: true } });
  const tenants = await prisma.tenant.findMany({
    select: { name: true, domain: true, deletedAt: true },
  });
  console.log('Users:', users);
  console.log('Tenants:', tenants);
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
