import Papa from "papaparse";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { 
  MonthlyReport, 
  DailyOperation,
  CollectionHealth
} from "@/types/report/report.entity";

const addReportBranding = (doc: jsPDF, title: string) => {
  const pageCount = (doc as any).internal.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Header
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("ANTIGRAVITY LIBRARY SYSTEM", 14, 10);
    doc.text(new Date().toLocaleDateString(), 196, 10, { align: 'right' });
    doc.setDrawColor(230);
    doc.line(14, 12, 196, 12);
    
    // Footer
    doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: 'right' });
    doc.text(`${title} - Operational Document - Official Use Only`, 14, 285);
  }
};

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

  doc.setFontSize(22);
  doc.setTextColor(30, 58, 138); // Primary blue
  doc.text("MONTHLY OPERATION REPORT", 14, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Reporting Period: ${period}`, 14, 32);
  doc.text(`Generated At: ${new Date(generatedAt).toLocaleString()}`, 14, 37);

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
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138] } 
  });

  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.text("Top Performance Metrics", 14, (doc as any).lastAutoTable.finalY + 15);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [["Rank", "Book Title", "Author", "Circulation Count"]],
    body: topBooks.map((b, i) => [
      `#${i + 1}`,
      b.title,
      b.author,
      b.borrowCount.toString()
    ]),
    headStyles: { fillColor: [71, 85, 105] }
  });

  addReportBranding(doc, "Monthly Report");
  doc.save(`monthly-report-${period}.pdf`);
};

export const exportDailyOperationsToPDF = (data: DailyOperation[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setTextColor(30, 58, 138);
  doc.text("DAILY OPERATIONS LOG", 14, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 32);

  autoTable(doc, {
    startY: 40,
    head: [["Type", "Book Title", "Reader Name", "Time"]],
    body: data.map(op => [
      op.type,
      op.bookTitle,
      op.readerName,
      new Date(op.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ]),
    headStyles: { fillColor: [30, 58, 138] }
  });

  addReportBranding(doc, "Daily Logs");
  doc.save(`daily-ops-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportCollectionHealthToPDF = (data: CollectionHealth) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setTextColor(30, 58, 138);
  doc.text("COLLECTION HEALTH AUDIT", 14, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Inventory State: ${new Date().toLocaleDateString()}`, 14, 32);

  autoTable(doc, {
    startY: 40,
    head: [["Status", "Count", "Percentage"]],
    body: [
      ["Available", data.statusBreakdown.available.toString(), `${(data.statusBreakdown.available/data.totalBooks*100).toFixed(1)}%`],
      ["On Borrow", data.statusBreakdown.borrowed.toString(), `${(data.statusBreakdown.borrowed/data.totalBooks*100).toFixed(1)}%`],
      ["Damaged", data.statusBreakdown.damaged.toString(), `${(data.statusBreakdown.damaged/data.totalBooks*100).toFixed(1)}%`],
      ["Lost", data.statusBreakdown.lost.toString(), `${(data.statusBreakdown.lost/data.totalBooks*100).toFixed(1)}%`],
    ],
    headStyles: { fillColor: [30, 58, 138] }
  });

  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.text("Dead Stock Analysis (Not borrowed > 6 months)", 14, (doc as any).lastAutoTable.finalY + 15);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [["Title", "Author", "Last Borrowed"]],
    body: data.deadStock.map(b => [
      b.title,
      b.author,
      b.lastBorrowedAt ? new Date(b.lastBorrowedAt).toLocaleDateString() : "Never"
    ]),
    headStyles: { fillColor: [71, 85, 105] }
  });

  addReportBranding(doc, "Collection Audit");
  doc.save(`collection-health-${new Date().toISOString().split('T')[0]}.pdf`);
};

