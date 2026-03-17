import { defineConfig } from 'prisma/config';
import { loadEnvConfig } from '@next/env';

// Load .env.local for Prisma CLI commands
loadEnvConfig(process.cwd());

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
