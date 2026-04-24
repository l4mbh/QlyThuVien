"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditService = exports.AuditService = void 0;
const audit_repository_1 = require("../../repositories/audit/audit.repository");
class AuditService {
    constructor() {
        this.auditRepository = new audit_repository_1.AuditRepository();
    }
    /**
     * Log a system event
     */
    async logEvent(data) {
        try {
            // We can add more logic here, like filtering sensitive data from metadata
            return await this.auditRepository.create(data);
        }
        catch (error) {
            console.error("Failed to log audit event:", error);
            // We don't throw error here to avoid breaking the main business flow
            // Audit logging should be a side-effect that doesn't crash the app
            return null;
        }
    }
    /**
     * Get recent activities for dashboard
     */
    async getRecentActivities(page = 1, limit = 20) {
        return this.auditRepository.findAll(page, limit);
    }
    /**
     * Get history for a specific entity
     */
    async getEntityHistory(entityType, entityId) {
        return this.auditRepository.findByEntity(entityType, entityId);
    }
}
exports.AuditService = AuditService;
// Export a singleton instance for easy use in other services
exports.auditService = new AuditService();
