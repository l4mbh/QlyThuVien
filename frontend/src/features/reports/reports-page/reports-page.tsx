import { useState, useEffect } from "react";
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar, 
  BookOpen, 
  Users, 
  AlertCircle 
} from "lucide-react";
import { 
  Card, 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs/tabs";
import { useAuth } from "@/features/auth/auth.hook";
import { UserRole } from "@/types/auth/user.entity";
import { reportService } from "../report.service";
import { toast } from "sonner";

// Previews
import { MonthlyPreview } from "../components/monthly-preview";
import { InventoryPreview } from "../components/inventory-preview";
import { ReaderPreview } from "../components/reader-preview";

// Export Utils
import { 
  exportToCSV, 
  exportMonthlyToPDF, 
  exportInventoryToPDF 
} from "../utils/export-utils";

// Helper to generate last 12 months for the picker
const generateMonths = () => {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    months.push({ value, label });
  }
  return months;
};

export const ReportsPage = () => {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(generateMonths()[0].value);
  const [activeTab, setActiveTab] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const months = generateMonths();

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      let data;
      switch (activeTab) {
        case "monthly":
          data = await reportService.getMonthlyReport(selectedMonth);
          break;
        case "inventory":
          data = await reportService.getInventoryReport();
          break;
        case "readers":
          data = await reportService.getReaderActivityReport();
          break;
      }
      setReportData(data);
    } catch (error) {
      console.error("Failed to fetch report", error);
      toast.error("Failed to generate report");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoadingAuth && user && user.role === UserRole.ADMIN) {
      fetchReport();
    }
  }, [activeTab, selectedMonth, isLoadingAuth, user]);

  const handleExportCSV = () => {
    if (!reportData) return;
    try {
      let fileName = `report-${activeTab}`;
      if (activeTab === "monthly") {
        fileName = `monthly-report-${selectedMonth}`;
        // Flatten monthly data for CSV
        const csvData = [
          { Metric: "Total Borrows", Value: reportData.summary.totalBorrows },
          { Metric: "Total Returns", Value: reportData.summary.totalReturns },
          { Metric: "Return Rate", Value: `${(reportData.summary.returnRate * 100).toFixed(1)}%` },
          { Metric: "Overdue Cases", Value: reportData.summary.overdueCases },
          { Metric: "Overdue Rate", Value: `${(reportData.summary.overdueRate * 100).toFixed(1)}%` },
          { Metric: "Total Fines", Value: reportData.summary.totalFinesCollected },
        ];
        exportToCSV(csvData, fileName);
      } else if (activeTab === "inventory") {
        exportToCSV(reportData.byCategory, `inventory-by-category-${new Date().toISOString().split('T')[0]}`);
      } else {
        exportToCSV(reportData, fileName);
      }
      toast.success("CSV exported successfully");
    } catch (err) {
      toast.error("Failed to export CSV");
    }
  };

  const handleExportPDF = () => {
    if (!reportData) return;
    try {
      if (activeTab === "monthly") {
        exportMonthlyToPDF(reportData);
      } else if (activeTab === "inventory") {
        exportInventoryToPDF(reportData);
      } else {
        toast.info("PDF export for this report type coming soon");
      }
      toast.success("PDF exported successfully");
    } catch (err) {
      toast.error("Failed to export PDF");
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user?.role !== UserRole.ADMIN) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-slate-500">Only administrators can access report documents.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Report Documents
          </h1>
          <p className="text-slate-500">Generate and export snapshot reports for library operations.</p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "monthly" && (
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[200px] bg-white">
                <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map(m => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <div className="flex items-center bg-white border rounded-lg p-1 shadow-sm">
            <Button variant="ghost" size="sm" onClick={handleExportCSV} className="text-xs h-8">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              CSV
            </Button>
            <div className="w-[1px] h-4 bg-slate-200 mx-1" />
            <Button variant="ghost" size="sm" onClick={handleExportPDF} className="text-xs h-8">
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              PDF
            </Button>
          </div>

          <Button variant="default" size="sm" onClick={fetchReport} disabled={isLoading} className="h-9 bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20">
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl mb-6">
          <TabsTrigger value="monthly" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FileText className="mr-2 h-4 w-4" />
            Monthly Report
          </TabsTrigger>
          <TabsTrigger value="inventory" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <BookOpen className="mr-2 h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="readers" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Users className="mr-2 h-4 w-4" />
            Reader Activity
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !reportData ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-2">
              <AlertCircle className="h-8 w-8 opacity-20" />
              <p>No data available for the selected criteria.</p>
            </div>
          ) : (
            <>
              <TabsContent value="monthly" className="mt-0 focus-visible:outline-none">
                <Card className="border-none shadow-md overflow-hidden">
                   <MonthlyPreview data={reportData} />
                </Card>
              </TabsContent>
              <TabsContent value="inventory" className="mt-0 focus-visible:outline-none">
                <Card className="border-none shadow-md overflow-hidden">
                   <InventoryPreview data={reportData} />
                </Card>
              </TabsContent>
              <TabsContent value="readers" className="mt-0 focus-visible:outline-none">
                <Card className="border-none shadow-md overflow-hidden">
                   <ReaderPreview data={reportData} />
                </Card>
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
};
