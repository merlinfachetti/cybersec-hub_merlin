import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
try {
  const hash = await bcrypt.hash('@Jully2026', 12);
  const result = await prisma.user.update({
    where: { email: 'merlinfachetti@gmail.com' },
    data: { passwordHash: hash },
    select: { id: true, email: true, name: true }
  });
  console.log('Password updated:', JSON.stringify(result));
} catch(e) {
  console.error('Error:', e.message);
} finally {
  await prisma.$disconnect();
}
