import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding data...');

  // Create default category
  const unknownCategory = await prisma.category.upsert({
    where: { id: 'unknown-category-id' }, // Using a fixed ID for consistency or just finding by name
    update: {},
    create: {
      id: 'unknown-category-id',
      name: 'Unknown',
      code: '000',
    },
  });

  console.log('Default category created:', unknownCategory);

  // Create admin user
  const bcrypt = require('bcrypt');
  const adminPassword = await bcrypt.hash('123456', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      password: adminPassword,
      role: 'ADMIN'
    },
    create: {
      name: 'Library Admin',
      email: 'admin@admin.com',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE'
    },
  });

  console.log('Admin user created/updated:', adminUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
