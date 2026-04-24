import { Router, Request, Response } from "express";
import { settingService } from "../../services/settings/setting.service";
import { SettingKey } from "@qltv/shared";

const router = Router();

/**
 * GET /system/status
 * Public endpoint - khong can auth
 * Tra ve trang thai he thong de FE hien thi warning
 */
router.get("/status", async (req: Request, res: Response) => {
  try {
    const maintenance = await settingService.get<boolean>(SettingKey.MAINTENANCE_MODE);
    res.status(200).json({
      data: { maintenance },
      code: "SUCCESS"
    });
  } catch (error) {
    res.status(200).json({
      data: { maintenance: false },
      code: "SUCCESS"
    });
  }
});

export default router;
