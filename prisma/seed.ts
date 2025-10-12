import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import path from 'path';
import { hash } from 'argon2';
import { InternalServerErrorException } from '@nestjs/common';

// Explicitly load environment variables
const prisma = new PrismaClient();
async function main() {
  expand(config({ path: path.resolve(process.cwd(), '.env') }));
  console.info('🌱 Database Seed start ');

  // ============LIST OF SEED START============= //
  const user = await prisma.user.findFirst({
    where: {
      email: process.env.MAIL_USER,
      role: 'admin',
    },
  });
  if (user) return console.info('User already seed');

  const pass = await hash(process.env.MAIL_PASS!);
  if (!pass) throw new InternalServerErrorException('Fail to hash password!');

  await prisma.user.create({
    data: {
      email: process.env.MAIL_USER!,
      username: process.env.MAIL_USER!.split('@')[1],
      password: pass,
    },
  });
  // ============LIST OF SEED END============= //

  console.info('🌱 Database Seed successfully 😍');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => { await prisma.$disconnect(); });