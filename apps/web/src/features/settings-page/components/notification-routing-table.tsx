import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRole } from "@qltv/shared";

interface NotificationSetting {
  type: string;
  roles: string[];
  isEnabled: boolean;
}

interface NotificationRoutingTableProps {
  settings: NotificationSetting[];
  onUpdate: (type: string, roles: string[], isEnabled: boolean) => void;
}

/**
 * Bảng quản lý định tuyến thông báo theo Role
 */
export const NotificationRoutingTable: React.FC<NotificationRoutingTableProps> = ({
  settings,
  onUpdate,
}) => {
  const allRoles = Object.values(UserRole);

  const toggleRole = (setting: NotificationSetting, role: string) => {
    const newRoles = setting.roles.includes(role)
      ? setting.roles.filter((r) => r !== role)
      : [...setting.roles, role];
    onUpdate(setting.type, newRoles, setting.isEnabled);
  };

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[250px] font-bold">Notification Type</TableHead>
            {allRoles.map((role) => (
              <TableHead key={role} className="text-center font-bold">{role}</TableHead>
            ))}
            <TableHead className="text-right font-bold">Enabled</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settings.map((setting) => (
            <TableRow key={setting.type} className="hover:bg-accent/5">
              <TableCell className="font-semibold text-primary">
                {setting.type.replace(/_/g, ' ')}
              </TableCell>
              {allRoles.map((role) => (
                <TableCell key={role} className="text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      id={`${setting.type}-${role}`}
                      checked={setting.roles.includes(role)}
                      onCheckedChange={() => toggleRole(setting, role)}
                      className="transition-transform active:scale-90"
                    />
                  </div>
                </TableCell>
              ))}
              <TableCell className="text-right">
                <Switch
                  checked={setting.isEnabled}
                  onCheckedChange={(checked) => onUpdate(setting.type, setting.roles, checked)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
