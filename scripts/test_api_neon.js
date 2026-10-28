const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testApi() {
  const ws = await prisma.workspace.create({
    data: {
      name: 'API Test Workspace',
      slug: 'api-test-' + Date.now(),
    }
  });
  console.log('1. Created temporary workspace in Neon:', ws.id);

  try {
    const res = await fetch('http://localhost:3000/api/contents?workspaceId=' + ws.id);
    const data = await res.json();
    console.log('2. HTTP GET /api/contents?workspaceId=' + ws.id);
    console.log('   Status:', res.status, res.statusText);
    console.log('   Response JSON:', JSON.stringify(data));
    if (res.status === 200 && Array.isArray(data.contents)) {
      console.log('✓ API endpoint successfully queried Neon Postgres through Prisma and returned contents array!');
    } else {
      throw new Error('API did not return expected format');
    }
  } finally {
    await prisma.workspace.delete({ where: { id: ws.id } });
    console.log('3. Cleaned up temporary workspace in Neon.');
    await prisma.$disconnect();
  }
}

testApi().catch(e => {
  console.error('API Test Error:', e);
  process.exit(1);
});
