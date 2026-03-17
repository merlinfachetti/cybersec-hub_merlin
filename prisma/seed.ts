/**
 * prisma/seed.ts — Cria superadmin Merlin
 * Uses pg directly (zero Prisma import dependency at seed time)
 * Run: npx prisma db seed
 */

import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

function generateCuid(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(16).toString('base64url').slice(0, 20);
  return `c${timestamp}${random}`;
}

const ADMIN = {
  email: 'merlin@cyberportal.dev',
  password: 'CyberPortal@2025!',
  name: 'Merlin',
  role: 'ADMIN',
  targetRole: 'Security Engineer',
  studyHoursPerWeek: 20,
  location: 'Europe',
};

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('🌱 Seeding database...\n');

    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [ADMIN.email]
    );

    if (existing.rows.length > 0) {
      console.log(`⚠️  User "${ADMIN.email}" already exists — skipping.`);
      return;
    }

    const id = generateCuid();
    const passwordHash = await bcrypt.hash(ADMIN.password, 12);
    const now = new Date().toISOString();

    await pool.query(
      `INSERT INTO users (id, email, "passwordHash", name, role, "targetRole", "studyHoursPerWeek", location, "isActive", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5::"UserRole", $6, $7, $8, true, $9, $9)`,
      [id, ADMIN.email, passwordHash, ADMIN.name, ADMIN.role,
       ADMIN.targetRole, ADMIN.studyHoursPerWeek, ADMIN.location, now]
    );

    console.log('✅ Superadmin created!');
    console.log(`   ID:    ${id}`);
    console.log(`   Email: ${ADMIN.email}`);
    console.log('\n🔑 Credentials:');
    console.log(`   Email:    ${ADMIN.email}`);
    console.log(`   Password: ${ADMIN.password}`);

  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
