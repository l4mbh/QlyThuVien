import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import {
  DEFAULT_SETTINGS,
  SettingKey,
  SETTING_CATEGORIES,
  NotificationType,
  UserRole
} from '@qltv/shared';
import * as bcrypt from 'bcrypt';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding data...');

  // Create default category
  const unknownCategory = await prisma.category.upsert({
    where: { id: 'unknown-category-id' },
    update: {},
    create: {
      id: 'unknown-category-id',
      name: 'Unknown',
      code: '000',
    },
  });

  console.log('Default category created:', unknownCategory.name);

  // Create admin user
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
    await prisma.user.upsert({
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
  }

  // Seed System Settings
  console.log('Seeding System Settings...');
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    // Find category
    let category = 'GENERAL';
    for (const [catName, keys] of Object.entries(SETTING_CATEGORIES)) {
      if ((keys as string[]).includes(key)) {
        category = catName;
        break;
      }
    }

    await prisma.systemSetting.upsert({
      where: { key },
      update: { value: value as any },
      create: {
        key,
        value: value as any,
        category,
        description: `System configuration for ${key.toLowerCase().replace(/_/g, ' ')}`,
      },
    });
  }

  // Seed Notification Settings
  console.log('Seeding Notification Settings...');
  const defaultNotificationSettings = [
    { type: NotificationType.OVERDUE, roles: [UserRole.READER, UserRole.ADMIN], isEnabled: true },
    { type: NotificationType.BORROW_SUCCESS, roles: [UserRole.READER], isEnabled: true },
    { type: NotificationType.RETURN_SUCCESS, roles: [UserRole.READER], isEnabled: true },
    { type: NotificationType.FINE_ASSIGNED, roles: [UserRole.READER], isEnabled: true },
    { type: NotificationType.RESERVATION_CANCELLED, roles: [UserRole.READER], isEnabled: true },
    { type: NotificationType.SYSTEM, roles: [UserRole.ADMIN, UserRole.STAFF], isEnabled: true },
  ];

  for (const setting of defaultNotificationSettings) {
    await prisma.notificationSetting.upsert({
      where: { type: setting.type },
      update: { roles: setting.roles, isEnabled: setting.isEnabled },
      create: {
        type: setting.type,
        roles: setting.roles,
        isEnabled: setting.isEnabled,
      },
    });
  }

  console.log('Seeding completed successfully.');
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
