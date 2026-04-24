"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
const audit_service_1 = require("../../services/audit/audit.service");
const shared_1 = require("@qltv/shared");
class AuditController {
    constructor() {
        this.getRecentActivities = async (req, res, next) => {
            try {
                const page = req.query.page ? parseInt(req.query.page) : 1;
                const limit = req.query.limit ? parseInt(req.query.limit) : 20;
                const activities = await audit_service_1.auditService.getRecentActivities(page, limit);
                const response = { data: activities, code: shared_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.getEntityHistory = async (req, res, next) => {
            try {
                const type = req.params.type;
                const id = req.params.id;
                const history = await audit_service_1.auditService.getEntityHistory(type, id);
                const response = { data: history, code: shared_1.ErrorCode.SUCCESS };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.AuditController = AuditController;
