import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label/label";
import { Switch } from "@/components/ui/switch/switch";

interface SettingItemProps {
  label: string;
  description?: string;
  value: any;
  onChange: (value: any) => void;
  type?: "number" | "string" | "boolean" | "time";
}

/**
 * Component hiển thị một dòng cấu hình với Input phù hợp với kiểu dữ liệu
 */
export const SettingItem: React.FC<SettingItemProps> = ({
  label,
  description,
  value,
  onChange,
  type,
}) => {
  const renderInput = () => {
    // Tự động nhận diện type nếu không truyền vào
    const actualType = type || (typeof value === "boolean" ? "boolean" : typeof value === "number" ? "number" : "string");

    if (actualType === "boolean") {
      return (
        <Switch
          checked={!!value}
          onCheckedChange={onChange}
        />
      );
    }

    if (actualType === "number") {
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-32 text-right"
        />
      );
    }

    if (actualType === "time") {
      return (
        <Input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-32"
        />
      );
    }

    return (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-md"
      />
    );
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-border/50 last:border-0 hover:bg-accent/5 transition-colors px-2 rounded-lg">
      <div className="space-y-1 pr-4">
        <Label className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground font-medium">
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        {renderInput()}
      </div>
    </div>
  );
};
