import { AuditRepository } from "../../repositories/audit/audit.repository";
import { CreateAuditLogDto, AuditLog, PaginatedData } from "@qltv/shared";
import { Prisma } from "@prisma/client";

export class AuditService {
  private auditRepository: AuditRepository;

  constructor() {
    this.auditRepository = new AuditRepository();
  }

  /**
   * Log a system event
   */
  async logEvent(data: CreateAuditLogDto, tx?: Prisma.TransactionClient): Promise<AuditLog> {
    try {
      // We can add more logic here, like filtering sensitive data from metadata
      return await this.auditRepository.create(data, tx);
    } catch (error) {
      console.error("Failed to log audit event:", error);
      // We don't throw error here to avoid breaking the main business flow
      // Audit logging should be a side-effect that doesn't crash the app
      return null as any;
    }
  }

  /**
   * Get recent activities for dashboard
   */
  async getRecentActivities(page: number = 1, limit: number = 20): Promise<PaginatedData<AuditLog>> {
    return this.auditRepository.findAll(page, limit);
  }

  /**
   * Get history for a specific entity
   */
  async getEntityHistory(entityType: string, entityId: string): Promise<AuditLog[]> {
    return this.auditRepository.findByEntity(entityType, entityId);
  }
}

// Export a singleton instance for easy use in other services
export const auditService = new AuditService();
