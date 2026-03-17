import { defineConfig } from 'prisma/config';

// Load .env.local only in local development (not on Vercel/CI where vars come from environment)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
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
