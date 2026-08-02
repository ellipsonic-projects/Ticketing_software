import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tickets = await prisma.ticket.findMany({
    where: {
      OR: [
        { title: { contains: 'taking tme', mode: 'insensitive' } },
        { title: { contains: 'taking time', mode: 'insensitive' } },
        { description: { contains: 'taking tme', mode: 'insensitive' } },
        { description: { contains: 'taking time', mode: 'insensitive' } },
      ],
    },
  });
  console.log('Tickets:', tickets);

  const comments = await prisma.ticketComment.findMany({
    where: {
      OR: [
        { body: { contains: 'taking tme', mode: 'insensitive' } },
        { body: { contains: 'taking time', mode: 'insensitive' } },
      ],
    },
  });
  console.log('Comments:', comments);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
