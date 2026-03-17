import { defineConfig } from 'prisma/config';

// Load .env.local only locally (Vercel has env vars natively)
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  const { loadEnvConfig } = await import('@next/env');
  loadEnvConfig(process.cwd());
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
