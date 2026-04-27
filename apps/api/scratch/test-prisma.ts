import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);

try {
  const prisma = new PrismaClient({
    // @ts-ignore
    datasourceUrl: process.env.DATABASE_URL,
  });
  console.log('PrismaClient instantiated with datasourceUrl');
} catch (e) {
  console.error('Failed with datasourceUrl:', e);
}

try {
  const prisma = new PrismaClient({
    // @ts-ignore
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
  console.log('PrismaClient instantiated with datasources');
} catch (e) {
  console.error('Failed with datasources:', e);
}
