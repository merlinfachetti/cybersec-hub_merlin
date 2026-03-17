import { defineConfig } from 'prisma/config';
import { loadEnvConfig } from '@next/env';

// Load .env.local for Prisma CLI commands (migrate, seed, studio)
const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
