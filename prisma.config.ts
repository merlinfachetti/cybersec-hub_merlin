import { defineConfig } from 'prisma/config';
import { loadEnvConfig } from '@next/env';

// Load .env.local for local CLI commands (migrate, seed, studio)
// In production (Vercel), env vars are injected directly
if (process.env.NODE_ENV !== 'production') {
  loadEnvConfig(process.cwd());
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  // DATABASE_URL only needed for migrate/seed, not for generate
  ...(process.env.DATABASE_URL ? {
    datasource: { url: process.env.DATABASE_URL },
  } : {}),
});
