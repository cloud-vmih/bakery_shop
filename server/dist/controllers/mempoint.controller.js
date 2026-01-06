"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipController = void 0;
const mempoint_service_1 = require("../services/mempoint.service");
class MembershipController {
    // Gọi sau thanh toán thành công
    // static async accumulatePoints(req: Request, res: Response) {
    //   try {
    //     const orderId = Number(req.params.orderId);
    //     const { orderAmount } = req.body;
    //     const customerId = Number((req as any).user.id)
    //
    //     if (!customerId || !orderId || orderAmount == null) {
    //       return res.status(400).json({ message: "Thiếu thông tin: customerId, orderId, orderAmount" });
    //     }
    //
    //     const result = await MembershipService.accumulatePoints(customerId, orderId, orderAmount);
    //
    //     return res.status(200).json({
    //       success: true,
    //       data: result,
    //     });
    //   } catch (error: any) {
    //     return res.status(500).json({ message: error.message || "Lỗi tích điểm" });
    //   }
    // }
    // Xem lịch sử và tổng điểm
    static async getPointsInfo(req, res) {
        try {
            const customerId = Number(req.user.id);
            console.log(customerId);
            if (!customerId) {
                return res.status(400).json({ message: "Vui lòng đăng nhập" });
            }
            const result = await mempoint_service_1.MembershipService.getPointsInfo(customerId);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({ message: error.message || "Lỗi lấy thông tin điểm" });
        }
    }
}
exports.MembershipController = MembershipController;
