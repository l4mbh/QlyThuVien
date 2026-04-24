import { 
  AuditAction as SharedAuditAction, 
  AuditEntityType as SharedAuditEntityType,
  type AuditLog as SharedAuditLog,
  type CreateAuditLogDto as SharedCreateAuditLogDto
} from "@qltv/shared";

export const AuditAction = SharedAuditAction;
export type AuditAction = SharedAuditAction;

export const AuditEntityType = SharedAuditEntityType;
export type AuditEntityType = SharedAuditEntityType;

export type AuditLog = SharedAuditLog;
export type CreateAuditLogDto = SharedCreateAuditLogDto;
