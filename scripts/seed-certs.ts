import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is required to seed certification costs.');
  }

  const pool = new Pool({ connectionString });

  try {
    const sql = await readFile('prisma/seed-certs.sql', 'utf8');
    await pool.query(sql);
    console.log('Seeded certification SQL successfully.');
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
