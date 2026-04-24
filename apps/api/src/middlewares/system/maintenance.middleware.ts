import { Request, Response, NextFunction } from "express";
import { SettingKey, UserRole, ErrorCode } from "@qltv/shared";
import { settingService } from "../../services/settings/setting.service";
import { verifyToken } from "../../utils/jwt.util";

/**
 * Maintenance Mode Middleware
 * Always 200 strategy
 * Cho phep login di qua de AuthService xu ly logic phan quyen
 * Cho phep system/status di qua de FE check trang thai
 */
export const maintenanceMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const isMaintenance = await settingService.get<boolean>(SettingKey.MAINTENANCE_MODE);

    if (!isMaintenance) {
      return next();
    }

    // Cho phep endpoint check trang thai (public)
    if (req.path.includes("/system/status")) {
      return next();
    }

    // Cho phep login di qua -> AuthService se check role
    if (req.path.includes("/auth/login")) {
      return next();
    }

    // Cac request khac: check token xem co phai Admin khong
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        if (decoded && decoded.role === UserRole.ADMIN) {
          return next();
        }
      } catch (_) {
        // Token loi -> chan
      }
    }

    // Chan voi response chuan Always 200
    return res.status(200).json({
      code: ErrorCode.MAINTENANCE_MODE,
      error: {
        msg: "System is under maintenance. Please try again later."
      }
    });

  } catch (error) {
    next();
  }
};
