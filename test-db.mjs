import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://cybersec:cybersec123@localhost:5432/cybersec_hub';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
});

async function test() {
  try {
    console.log('🔍 Testing database connection...\n');

    // Test 1: Contar certificações
    const certCount = await prisma.certification.count();
    console.log('✅ Certifications count:', certCount);

    if (certCount === 0) {
      console.log('❌ NO CERTIFICATIONS FOUND!');
      console.log('Run: npx prisma db seed');
      process.exit(1);
    }

    // Test 2: Buscar primeira certificação
    const cert = await prisma.certification.findFirst({
      include: {
        provider: true,
        costs: true,
      },
    });

    console.log('\n✅ First certification:');
    console.log('   Name:', cert?.name);
    console.log('   Provider:', cert?.provider.name);
    console.log('   Costs count:', cert?.costs.length);

    // Test 3: Testar query complexa
    const results = await prisma.certification.findMany({
      take: 5,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            website: true,
          },
        },
        costs: {
          where: { currency: 'USD' },
          take: 1,
        },
      },
    });

    console.log('\n✅ Complex query returned:', results.length, 'results');
    console.log('\n✅ ALL TESTS PASSED! Database is working correctly.\n');
  } catch (error) {
    console.error('\n❌ DATABASE ERROR:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

test();
