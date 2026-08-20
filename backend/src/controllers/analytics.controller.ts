import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { getTaskAnalytics } from "../services/analytics.service.js";

export const getAnalytics = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    const analytics = await getTaskAnalytics(req.user.userId);

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch analytics",
    });
  }
};
