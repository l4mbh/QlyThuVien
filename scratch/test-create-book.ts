import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function testCreateBook() {
  console.log('Testing book creation...');
  try {
    const book = await prisma.book.create({
      data: {
        title: "Test Book",
        author: "Test Author",
        isbn: "TEST-" + Date.now(),
        totalQuantity: 10,
        availableQuantity: 10,
        callNumber: "TEST.CALL." + Date.now(),
      },
      include: {
        _count: {
          select: {
            reservations: {
              where: { status: { in: ['PENDING', 'READY'] } }
            }
          }
        }
      }
    });
    console.log('Success:', book);
  } catch (error: any) {
    console.error('Error details:', error);
    if (error.code) console.error('Prisma Error Code:', error.code);
    if (error.meta) console.error('Prisma Error Meta:', error.meta);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

testCreateBook();
