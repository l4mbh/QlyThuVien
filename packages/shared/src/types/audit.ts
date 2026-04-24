import { AuditAction, AuditEntityType } from "../constants/audit";

export interface AuditLog {
  id: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  userId: string;
  userName?: string; // For display purposes
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface CreateAuditLogDto {
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  userId: string;
  metadata?: Record<string, any>;
}
