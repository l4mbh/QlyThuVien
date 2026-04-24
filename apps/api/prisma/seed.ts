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

  // Create staff users
  const staffUsers = [
    { name: 'Staff Member 1', email: 'staff1@lib.com' },
    { name: 'Staff Member 2', email: 'staff2@lib.com' },
  ];

  for (const staff of staffUsers) {
    const user = await prisma.user.upsert({
      where: { email: staff.email },
      update: { password: adminPassword, role: 'STAFF' },
      create: {
        name: staff.name,
        email: staff.email,
        password: adminPassword,
        role: 'STAFF',
        status: 'ACTIVE',
      },
    });
    console.log('Staff user created/updated:', user.email);
  }

  // Create reader users
  const readerUsers = [
    { name: 'Active Reader 1', email: 'reader1@gmail.com', status: 'ACTIVE' as const },
    { name: 'Active Reader 2', email: 'reader2@gmail.com', status: 'ACTIVE' as const },
    { name: 'Blocked Reader', email: 'blocked@gmail.com', status: 'BLOCKED' as const },
  ];

  for (const reader of readerUsers) {
    const user = await prisma.user.upsert({
      where: { email: reader.email },
      update: { password: adminPassword, status: reader.status },
      create: {
        name: reader.name,
        email: reader.email,
        password: adminPassword,
        role: 'READER',
        status: reader.status,
      },
    });
    console.log(`Reader user (${reader.status}) created/updated:`, user.email);
  }
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

