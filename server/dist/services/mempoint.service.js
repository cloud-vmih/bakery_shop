"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipService = void 0;
const mempoint_db_1 = require("../db/mempoint.db");
const database_1 = require("../config/database");
const Customer_1 = require("../entity/Customer");
const user_db_1 = require("../db/user.db");
class MembershipService {
    // Tính điểm theo bậc thang
    static calculatePoints(orderAmount) {
        if (orderAmount < 100000)
            return 0;
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
    static async accumulatePoints(customerId, orderId, orderAmount) {
        const earnedPoints = this.calculatePoints(orderAmount);
        console.log(`Tính được ${earnedPoints} điểm cho đơn hàng #${orderId} (tổng ${orderAmount}đ)`);
        const note = earnedPoints > 0
            ? `Tích ${earnedPoints} điểm từ đơn hàng #${orderId}`
            : "Đơn hàng dưới 100.000đ nên chưa được tích điểm lần này.";
        const customer = await (0, user_db_1.getCustomerByID)(customerId);
        console.log("customer:", customer);
        // Ghi lịch sử
        await mempoint_db_1.MembershipPointDB.addPointRecord({
            user: customer,
            orderId,
            orderAmount,
            earnedPoints,
            note,
        });
        // Cập nhật tổng điểm trong Customer
        const customerRepo = database_1.AppDataSource.getRepository(Customer_1.Customer);
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
    static async getPointsInfo(customerId) {
        const history = await mempoint_db_1.MembershipPointDB.getHistoryByCustomerId(customerId);
        const customer = await database_1.AppDataSource.getRepository(Customer_1.Customer).findOne({
            where: { id: customerId },
        });
        const totalPoints = customer?.membershipPoints || 0;
        console.log(totalPoints);
        console.log(history);
        return { history, totalPoints };
    }
}
exports.MembershipService = MembershipService;
