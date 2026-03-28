/**
 * Prisma 7 uses the "client" engine in this project, which requires a driver
 * adapter. We keep both the pg pool and Prisma client as singletons in dev to
 * avoid opening new connections on every hot reload.
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  pool: Pool | undefined;
  prisma: PrismaClient | undefined;
};

function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured.');
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

function createClient(pool: Pool) {
  return new PrismaClient({
    adapter: new PrismaPg(pool),
  });
}

const pool = globalForPrisma.pool ?? createPool();

export const prisma = globalForPrisma.prisma ?? createClient(pool);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.pool = pool;
  globalForPrisma.prisma = prisma;
}
