const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const books = await prisma.book.findMany({
    select: {
      id: true,
      title: true,
      totalQuantity: true,
      availableQuantity: true,
      reservations: {
        where: { status: { in: ['PENDING', 'READY'] } }
      }
    }
  });
  console.log('BOOKS:', JSON.stringify(books, null, 2));
  
  const borrows = await prisma.borrowItem.findMany({
    where: { status: 'BORROWING' },
    include: { book: true }
  });
  console.log('ACTIVE BORROWS:', JSON.stringify(borrows, null, 2));
  
  process.exit(0);
}

check();
