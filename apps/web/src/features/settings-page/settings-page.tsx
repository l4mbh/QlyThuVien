import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header/page-header";
import { settingService } from "@/services/setting.service";
import { SettingItem } from "./components/setting-item";
import { NotificationRoutingTable } from "./components/notification-routing-table";
import { SettingKey } from "@qltv/shared";
import { toast } from "sonner";
import { Loader2, Settings, Bell, BookOpen, CircleDollarSign } from "lucide-react";

/**
 * Trang quản lý cấu hình hệ thống (Admin Only)
 */
export const SettingsPage = () => {
  const [settings, setSettings] = useState<any[]>([]);
  const [notifSettings, setNotifSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [s, ns] = await Promise.all([
        settingService.getAll(),
        settingService.getNotificationSettings(),
      ]);
      setSettings(s);
      setNotifSettings(ns);
    } catch (error) {
      toast.error("Failed to fetch settings from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = async (key: SettingKey, value: any) => {
    try {
      await settingService.update(key, value);
      toast.success(`Setting [${key}] updated successfully`);
      
      // Cập nhật state cục bộ để tránh re-fetch
      setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
    } catch (error: any) {
      toast.error(error.message || "Failed to update setting");
    }
  };

  const handleUpdateNotif = async (type: string, roles: string[], isEnabled: boolean) => {
    try {
      await settingService.updateNotificationRouting(type, roles, isEnabled);
      toast.success(`Notification routing for [${type}] updated`);
      
      setNotifSettings(prev => prev.map(s => s.type === type ? { ...s, roles, isEnabled } : s));
    } catch (error: any) {
      toast.error(error.message || "Failed to update notification routing");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading system configurations...</p>
      </div>
    );
  }

  const getSettingsByCategory = (category: string) => {
    return settings.filter(s => s.category === category);
  };

  return (
    <div className="container mx-auto py-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="System Settings"
        description="Centralized control for business rules, fine calculations, and automated notification routing."
      />

      <Tabs defaultValue="borrow" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl bg-muted/50 p-1 border border-border/50 shadow-inner">
            <TabsTrigger value="borrow" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <BookOpen className="h-4 w-4 mr-2" /> Borrow
            </TabsTrigger>
            <TabsTrigger value="fine" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <CircleDollarSign className="h-4 w-4 mr-2" /> Fines
            </TabsTrigger>
            <TabsTrigger value="notification" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Bell className="h-4 w-4 mr-2" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Settings className="h-4 w-4 mr-2" /> System
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="borrow" className="space-y-4 focus-visible:outline-none">
          <Card className="border-border/50 shadow-md">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="text-xl">Borrowing Rules</CardTitle>
              <CardDescription>Configure limits and durations to optimize book circulation.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {getSettingsByCategory("BORROW").map(s => (
                <SettingItem
                  key={s.key}
                  label={s.key.split('_').join(' ')}
                  description={s.description}
                  value={s.value}
                  onChange={(val) => handleUpdateSetting(s.key, val)}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fine" className="space-y-4 focus-visible:outline-none">
          <Card className="border-border/50 shadow-md">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="text-xl">Fine Management</CardTitle>
              <CardDescription>Setup automatic fine calculation for overdue items.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {getSettingsByCategory("FINE").map(s => (
                <SettingItem
                  key={s.key}
                  label={s.key.split('_').join(' ')}
                  description={s.description}
                  value={s.value}
                  onChange={(val) => handleUpdateSetting(s.key, val)}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notification" className="space-y-8 focus-visible:outline-none">
          <Card className="border-border/50 shadow-md">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="text-xl">Notification Triggers</CardTitle>
              <CardDescription>Control when automated messages are sent to users.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {getSettingsByCategory("NOTIFICATION").map(s => (
                <SettingItem
                  key={s.key}
                  label={s.key.split('_').join(' ')}
                  description={s.description}
                  value={s.value}
                  onChange={(val) => handleUpdateSetting(s.key, val)}
                  type={s.key === SettingKey.OVERDUE_CHECK_TIME ? "time" : undefined}
                />
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Routing Table
            </h3>
            <NotificationRoutingTable
              settings={notifSettings}
              onUpdate={handleUpdateNotif}
            />
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4 focus-visible:outline-none">
          <Card className="border-border/50 shadow-md">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="text-xl">General Configurations</CardTitle>
              <CardDescription>Core system flags and maintenance mode settings.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {getSettingsByCategory("SYSTEM").map(s => (
                <SettingItem
                  key={s.key}
                  label={s.key.split('_').join(' ')}
                  description={s.description}
                  value={s.value}
                  onChange={(val) => handleUpdateSetting(s.key, val)}
                />
              ))}
              {getSettingsByCategory("GENERAL").map(s => (
                <SettingItem
                  key={s.key}
                  label={s.key.split('_').join(' ')}
                  description={s.description}
                  value={s.value}
                  onChange={(val) => handleUpdateSetting(s.key, val)}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
