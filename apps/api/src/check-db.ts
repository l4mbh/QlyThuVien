import prisma from "./config/db/db";

async function listBooks() {
  console.log('--- DATABASE CHECK ---');
  try {
    const books = await prisma.book.findMany({
      select: { title: true, isbn: true, isArchived: true }
    });
    if (books.length === 0) {
      console.log('No books found in database.');
    } else {
      console.log(`Found ${books.length} books:`);
      console.table(books);
    }
  } catch (error) {
    console.error('Database query failed:', error);
  } finally {
    process.exit(0);
  }
}

listBooks();
