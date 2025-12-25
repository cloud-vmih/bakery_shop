import { Request, Response } from "express";
import { MembershipService } from "../servies/mempoint.service";

export class MembershipController {
  // Gọi sau thanh toán thành công
  static async accumulatePoints(req: Request, res: Response) {
    try {
      const { customerId, orderId, orderAmount } = req.body;

      if (!customerId || !orderId || orderAmount == null) {
        return res.status(400).json({ message: "Thiếu thông tin: customerId, orderId, orderAmount" });
      }

      const result = await MembershipService.accumulatePoints(customerId, orderId, orderAmount);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Lỗi tích điểm" });
    }
  }

  // Xem lịch sử và tổng điểm
  static async getPointsInfo(req: Request, res: Response) {
    try {
      const customerId = Number((req as any).user.id)
        console.log(customerId)

      if (!customerId) {
        return res.status(400).json({ message: "Vui lòng đăng nhập" });
      }

      const result = await MembershipService.getPointsInfo(customerId);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Lỗi lấy thông tin điểm" });
    }
  }
}