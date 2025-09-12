import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const saltRounds = 10;
  const password = await bcrypt.hash('password', saltRounds);

  const acme = await prisma.tenant.create({
    data: {
      name: 'Acme',
      slug: 'acme',
    },
  });

  const globex = await prisma.tenant.create({
    data: {
      name: 'Globex',
      slug: 'globex',
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@acme.test',
      password: password,
      role: 'ADMIN',
      tenantId: acme.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'user@acme.test',
      password: password,
      role: 'MEMBER',
      tenantId: acme.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@globex.test',
      password: password,
      role: 'ADMIN',
      tenantId: globex.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'user@globex.test',
      password: password,
      role: 'MEMBER',
      tenantId: globex.id,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });