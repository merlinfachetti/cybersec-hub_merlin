/**
 * prisma/seed.ts — Cria superadmin Merlin
 * Run: npx prisma db seed
 */

// @ts-ignore — types available after `prisma generate`
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

const ADMIN = {
  email: 'merlin@cyberportal.dev',
  password: 'CyberPortal@2025!',
  name: 'Merlin',
  role: 'ADMIN' as const,
  targetRole: 'Security Engineer',
  studyHoursPerWeek: 20,
  location: 'Europe',
};

async function main() {
  console.log('🌱 Seeding database...\n');

  const existing = await prisma.user.findUnique({ where: { email: ADMIN.email } });

  if (existing) {
    console.log(`⚠️  User "${ADMIN.email}" already exists — skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN.password, 12);

  const user = await prisma.user.create({
    data: {
      email: ADMIN.email,
      passwordHash,
      name: ADMIN.name,
      role: ADMIN.role,
      targetRole: ADMIN.targetRole,
      studyHoursPerWeek: ADMIN.studyHoursPerWeek,
      location: ADMIN.location,
      isActive: true,
    },
  });

  console.log('✅ Superadmin created!');
  console.log(`   ID:    ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log('\n🔑 Credentials:');
  console.log(`   Email:    ${ADMIN.email}`);
  console.log(`   Password: ${ADMIN.password}`);
  console.log('\n⚠️  Change password before production!');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
