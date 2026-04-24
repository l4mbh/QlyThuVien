import { PrismaClient, BorrowItemStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({ where: { email: "admin@qltv.com" } });
  
  if (!admin) {
    console.error("Admin user not found");
    return;
  }

  console.log(`Found Admin: ${admin.id}`);

  // Create some test notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: admin.id,
        type: "BORROW_SUCCESS",
        title: "Welcome to LibMgnt!",
        message: "Your account is now ready to borrow books. Enjoy reading!",
        isRead: false,
      },
      {
        userId: admin.id,
        type: "OVERDUE",
        title: "Overdue Reminder",
        message: "You have a book that was due yesterday. Please return it to avoid fines.",
        isRead: false,
      },
      {
        userId: admin.id,
        type: "SYSTEM",
        title: "System Update",
        message: "The library system has been upgraded to v2.0 with Audit Logs and Notifications.",
        isRead: true,
      }
    ]
  });

  console.log("Seed notifications created successfully!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
