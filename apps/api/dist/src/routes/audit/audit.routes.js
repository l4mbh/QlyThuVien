"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audit_controller_1 = require("../../controllers/audit/audit.controller");
const auth_middleware_1 = require("../../middlewares/auth/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const auditController = new audit_controller_1.AuditController();
// Only ADMIN and STAFF can view audit logs
router.get("/", auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)([client_1.UserRole.ADMIN, client_1.UserRole.STAFF]), auditController.getRecentActivities);
router.get("/history/:type/:id", auth_middleware_1.authMiddleware, (0, auth_middleware_1.roleMiddleware)([client_1.UserRole.ADMIN, client_1.UserRole.STAFF]), auditController.getEntityHistory);
exports.default = router;
