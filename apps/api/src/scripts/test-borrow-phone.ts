import { BorrowService } from '../services/borrow/borrow.service';
import prisma from '../config/db/db';

async function testBorrowPhone() {
  const borrowService = new BorrowService();
  const testPhone = '0911223344';
  const bookId = '3e26d487-f6aa-4082-a149-6915c718bf16';
  const adminId = '9e1fbc1c-a03f-4be2-8685-f4c42d4f2587';
  
  console.log('🚀 Starting Borrow Test with Phone...');
  console.log(`📱 Phone: ${testPhone}`);
  console.log(`📚 Book ID: ${bookId}`);

  // Cleanup user if exists to ensure we test "Create" part
  await prisma.user.deleteMany({
    where: { phoneRaw: testPhone }
  });

  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const result = await borrowService.createBorrow({
      phone: testPhone,
      bookIds: [bookId],
      dueDate: dueDate
    }, adminId);

    console.log('\n✅ Borrow Record Created Successfully!');
    console.log(`🆔 Record ID: ${result.id}`);
    
    // Verify user creation
    const user = await prisma.user.findFirst({
      where: { phoneRaw: testPhone }
    });
    
    console.log('\n👤 User Verification:');
    console.log(`   - Name: ${user?.name}`);
    console.log(`   - Role: ${user?.role}`);
    console.log(`   - Is Guest: ${user?.isGuest}`);
    
    if (user && result.userId === user.id) {
      console.log('\n🏆 SUCCESS: Borrow record correctly linked to the new/found user.');
    } else {
      console.log('\n❌ FAILURE: User link mismatch.');
    }

  } catch (error) {
    console.error('\n❌ Error during borrow test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBorrowPhone();
