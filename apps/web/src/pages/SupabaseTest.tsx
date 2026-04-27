import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Database, Loader2, CheckCircle2, XCircle, Terminal } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const SupabaseTest: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const testConnection = async () => {
    setStatus("loading");
    setError(null);
    try {
      // Try to fetch from a 'todos' table as requested, but handle if it doesn't exist
      const { data: todos, error: fetchError } = await supabase
        .from("todos")
        .select("*")
        .limit(5);

      if (fetchError) {
        throw fetchError;
      }

      setData(todos);
      setStatus("success");
      toast.success("Connection successful!");
    } catch (err: any) {
      console.error("Supabase Error:", err);
      setError(err.message || "Failed to connect to Supabase");
      setStatus("error");
      toast.error("Connection failed");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-600/10 rounded-xl">
          <Database className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supabase Integration</h1>
          <p className="text-muted-foreground">Verify your database connection and environment variables.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 transition-all hover:border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-500" />
              Environment Check
            </CardTitle>
            <CardDescription>Status of Supabase environment variables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">SUPABASE_URL</span>
              {import.meta.env.VITE_SUPABASE_URL ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">SUPABASE_KEY</span>
              {import.meta.env.VITE_SUPABASE_KEY ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 transition-all hover:border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-lg">Test Connection</CardTitle>
            <CardDescription>Fetch sample data from 'todos' table</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <Button 
              onClick={testConnection} 
              disabled={status === "loading"}
              className="w-full mb-4"
            >
              {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Run Connection Test
            </Button>
            
            {status === "success" && (
              <div className="text-center animate-in fade-in zoom-in duration-300">
                <p className="text-sm text-green-600 font-medium mb-2">Success! Found {data?.length || 0} records.</p>
                <div className="text-xs bg-muted p-2 rounded text-left overflow-auto max-h-32">
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="text-center text-red-600 animate-in shake">
                <p className="text-sm font-medium">Error connecting to Supabase</p>
                <p className="text-xs opacity-70">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
