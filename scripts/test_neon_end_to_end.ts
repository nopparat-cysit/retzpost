import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  log: ['error'],
});

async function main() {
  console.log('--- 1. Testing Neon Postgres Connection ---');
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
  console.log('DATABASE_URL_UNPOOLED:', process.env.DATABASE_URL_UNPOOLED?.replace(/:[^:@]+@/, ':****@'));
  console.log('NEON_BRANCH:', process.env.NEON_BRANCH);

  const [dbInfo] = await prisma.$queryRaw<Array<{ version: string; current_database: string; current_user: string }>>`
    SELECT version(), current_database(), current_user;
  `;
  console.log('Connected to Database:', dbInfo.current_database);
  console.log('Database User:', dbInfo.current_user);
  console.log('PostgreSQL Version:', dbInfo.version.split('\n')[0]);

  console.log('\n--- 2. Testing End-to-End Prisma CRUD on Neon Postgres ---');
  const testWorkspaceName = `Neon Test Studio ${Date.now()}`;
  
  // Create
  const createdWorkspace = await prisma.workspace.create({
    data: {
      name: testWorkspaceName,
      slug: `neon-test-${Date.now()}`,
    },
  });
  console.log('✓ Successfully created Workspace record in Neon Postgres:', {
    id: createdWorkspace.id,
    name: createdWorkspace.name,
    createdAt: createdWorkspace.createdAt,
  });

  // Read
  const fetchedWorkspace = await prisma.workspace.findUnique({
    where: { id: createdWorkspace.id },
  });
  if (!fetchedWorkspace || fetchedWorkspace.name !== testWorkspaceName) {
    throw new Error('Workspace verification failed on Neon!');
  }
  console.log('✓ Successfully read back Workspace record from Neon Postgres');

  // Update
  const updatedWorkspace = await prisma.workspace.update({
    where: { id: createdWorkspace.id },
    data: { name: `${testWorkspaceName} (Updated)` },
  });
  console.log('✓ Successfully updated Workspace record in Neon Postgres:', updatedWorkspace.name);

  // Delete
  await prisma.workspace.delete({
    where: { id: createdWorkspace.id },
  });
  console.log('✓ Successfully cleaned up test Workspace record from Neon Postgres');

  console.log('\n--- 3. Testing Schema Relations & Model Counts ---');
  const workspaceCount = await prisma.workspace.count();
  const userCount = await prisma.user.count();
  const contentCount = await prisma.content.count();
  console.log('Current table row counts in Neon Postgres:');
  console.log(`- Workspaces: ${workspaceCount}`);
  console.log(`- Users: ${userCount}`);
  console.log(`- Contents: ${contentCount}`);

  console.log('\n=== ALL NEON POSTGRES END-TO-END TESTS PASSED SUCCESSFULLY! ===');
}

main()
  .catch((err) => {
    console.error('Neon test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
