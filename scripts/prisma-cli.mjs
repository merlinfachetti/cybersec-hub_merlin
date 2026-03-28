import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { config as loadEnv } from 'dotenv';

const rootDir = process.cwd();
const prismaEntry = path.join(rootDir, 'node_modules', 'prisma', 'build', 'index.js');
const envFiles = ['.env', '.env.local'];

for (const file of envFiles) {
  const envPath = path.join(rootDir, file);
  if (existsSync(envPath)) {
    loadEnv({ path: envPath, override: true });
  }
}

if (!existsSync(prismaEntry)) {
  console.error('Prisma CLI entry not found at', prismaEntry);
  process.exit(1);
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node scripts/prisma-cli.mjs <prisma args...>');
  process.exit(1);
}

execFileSync(process.execPath, [prismaEntry, ...args], {
  cwd: rootDir,
  stdio: 'inherit',
  env: process.env,
});
