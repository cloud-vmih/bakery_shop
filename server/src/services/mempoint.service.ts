import { MembershipPointDB } from "../db/mempoint.db";
import { AppDataSource } from "../config/database";
import { Customer } from "../entity/Customer";

export class MembershipService {
  // Tính điểm theo bậc thang
  static calculatePoints(orderAmount: number): number {
    if (orderAmount < 100000) return 0;

    const thresholds = [
      100000, 200000, 300000, 400000, 500000,
      600000, 700000, 800000, 900000, 1000000
    ];
    const points = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (orderAmount >= thresholds[i]) {
        return points[i];
      }
    }
    return 10; // >= 1 triệu
  }

  // Tích điểm sau khi thanh toán thành công
  static async accumulatePoints(customerId: number, orderId: number, orderAmount: number) {
    const earnedPoints = this.calculatePoints(orderAmount);

    const note =
      earnedPoints > 0
        ? `Tích ${earnedPoints} điểm từ đơn hàng #${orderId}`
        : "Đơn hàng dưới 100.000đ nên chưa được tích điểm lần này.";

    // Ghi lịch sử
    await MembershipPointDB.addPointRecord({
      id:customerId,
      orderId,
      orderAmount,
      earnedPoints,
      note,
    });

    // Cập nhật tổng điểm trong Customer
    const customerRepo = AppDataSource.getRepository(Customer);
    await customerRepo.increment({ id: customerId }, "membershipPoints", earnedPoints);

    // Lấy tổng điểm mới
    const updatedCustomer = await customerRepo.findOne({ where: { id: customerId } });
    const totalPoints = updatedCustomer?.membershipPoints || 0;

    return {
      earnedPoints,
      totalPoints,
      message: note,
    };
  }

  // Lấy lịch sử và tổng điểm
  static async getPointsInfo(customerId: number) {
    const history = await MembershipPointDB.getHistoryByCustomerId(customerId);
    const customer = await AppDataSource.getRepository(Customer).findOne({
      where: { id: customerId },
    });
    const totalPoints = customer?.membershipPoints || 0;
    console.log(totalPoints);
    console.log(history);

    return { history, totalPoints };
  }
}