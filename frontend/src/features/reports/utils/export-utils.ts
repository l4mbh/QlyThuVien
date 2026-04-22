import Papa from "papaparse";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  type MonthlyReport, 
  type InventoryReport, 
} from "@/types/report/report.entity";

export const exportToCSV = (data: any, fileName: string) => {
  try {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("CSV Export Error:", err);
    throw err;
  }
};

export const exportMonthlyToPDF = (data: MonthlyReport) => {
  const doc = new jsPDF();
  const { summary, topBooks, period, generatedAt } = data;

  // Header
  doc.setFontSize(20);
  doc.text("MONTHLY LIBRARY REPORT", 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Period: ${period}`, 14, 30);
  doc.text(`Generated At: ${new Date(generatedAt).toLocaleString()}`, 14, 36);

  // Summary Table
  autoTable(doc, {
    startY: 45,
    head: [["Metric", "Value"]],
    body: [
      ["Total Borrows", summary.totalBorrows.toString()],
      ["Total Returns", summary.totalReturns.toString()],
      ["Return Rate", `${(summary.returnRate * 100).toFixed(1)}%`],
      ["Overdue Cases", summary.overdueCases.toString()],
      ["Overdue Rate", `${(summary.overdueRate * 100).toFixed(1)}%`],
      ["Total Fines Collected", new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(summary.totalFinesCollected)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138] } 
  });

  // Top Books Table
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Top Borrowed Books", 14, (doc as any).lastAutoTable.finalY + 15);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [["Rank", "Title", "Author", "Borrows"]],
    body: topBooks.map((b, i) => [
      `#${i + 1}`,
      b.title,
      b.author,
      b.borrowCount.toString()
    ]),
    headStyles: { fillColor: [30, 58, 138] }
  });

  doc.save(`monthly-report-${period}.pdf`);
};

export const exportInventoryToPDF = (data: InventoryReport) => {
  const doc = new jsPDF();
  const { totalBooks, available, borrowed, byCategory, generatedAt } = data;

  doc.setFontSize(20);
  doc.text("INVENTORY REPORT", 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated At: ${new Date(generatedAt).toLocaleString()}`, 14, 30);

  autoTable(doc, {
    startY: 40,
    head: [["Metric", "Value"]],
    body: [
      ["Total Books", totalBooks.toString()],
      ["Available", available.toString()],
      ["On Borrow", borrowed.toString()],
    ],
    headStyles: { fillColor: [30, 58, 138] }
  });

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Category Distribution", 14, (doc as any).lastAutoTable.finalY + 15);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [["Category", "Count", "Percentage"]],
    body: byCategory.map(c => [
      c.categoryName,
      c.count.toString(),
      `${(c.count / totalBooks * 100).toFixed(1)}%`
    ]),
    headStyles: { fillColor: [30, 58, 138] }
  });

  doc.save(`inventory-report-${new Date().toISOString().split('T')[0]}.pdf`);
};
