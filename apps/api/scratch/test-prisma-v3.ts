import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';

try {
  // @ts-ignore
  const prisma = new PrismaClient({
    datasource: {
      url: process.env.DATABASE_URL
    }
  });
  console.log('PrismaClient instantiated with datasource (singular)');
} catch (e) {
  console.error('Failed with datasource (singular):', e);
}
