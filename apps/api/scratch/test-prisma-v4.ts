import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

try {
  // @ts-ignore
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  } as any);
  console.log('PrismaClient instantiated successfully with datasourceUrl and as any');
  prisma.$connect().then(() => {
    console.log('Connected!');
    process.exit(0);
  }).catch((e) => {
    console.error('Connection failed:', e);
    process.exit(1);
  });
} catch (e) {
  console.error('Instantiation failed:', e);
  process.exit(1);
}
