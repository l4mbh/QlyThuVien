import { UserService } from '../services/user/user.service';
import prisma from '../config/db/db';

async function testConcurrency() {
  const userService = new UserService();
  const testPhone = '0987654321';
  
  console.log('🚀 Starting Concurrency Test for findOrCreateReader...');
  console.log(`📱 Test Phone: ${testPhone}`);

  // Cleanup if exists
  await prisma.user.deleteMany({
    where: { phoneRaw: testPhone }
  });

  const requests = Array.from({ length: 10 }).map((_, i) => {
    console.log(`   > Triggering request #${i + 1}`);
    return userService.findOrCreateReader(testPhone, `Concurrent User ${i + 1}`);
  });

  try {
    const results = await Promise.all(requests);
    console.log('\n✅ All requests finished.');
    
    // Check results
    const userIds = results.map(u => u.id);
    const uniqueIds = [...new Set(userIds)];
    
    console.log(`📊 Total Responses: ${results.length}`);
    console.log(`📊 Unique User IDs: ${uniqueIds.length}`);

    if (uniqueIds.length === 1) {
      console.log('🏆 SUCCESS: Only one user was created/returned for all concurrent requests.');
    } else {
      console.log('❌ FAILURE: Multiple different users were created!');
    }

    // Verify in DB
    const dbUsers = await prisma.user.findMany({
      where: { phoneRaw: testPhone }
    });
    console.log(`📊 DB Record Count: ${dbUsers.length}`);

  } catch (error) {
    console.error('❌ Error during concurrency test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConcurrency();
