"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipPointDB = void 0;
const database_1 = require("../config/database");
const MembershipPoint_1 = require("../entity/MembershipPoint");
class MembershipPointDB {
    // Thêm bản ghi tích điểm
    static async addPointRecord(data) {
        const record = this.repository.create(data);
        return await this.repository.save(record);
    }
    // Lấy lịch sử tích điểm của khách hàng
    static async getHistoryByCustomerId(customerId) {
        return await this.repository.find({
            where: { user: { id: customerId } },
            order: { createdAt: "DESC" },
        });
    }
    // Tính tổng điểm hiện tại (có thể dùng field trong Customer, nhưng backup bằng query)
    static async getTotalPoints(customerId) {
        const result = await this.repository
            .createQueryBuilder("point")
            .select("COALESCE(SUM(point.earnedPoints), 0)", "total")
            .where("point.customerId = :customerId", { customerId })
            .getRawOne();
        return Number(result.total);
    }
}
exports.MembershipPointDB = MembershipPointDB;
MembershipPointDB.repository = database_1.AppDataSource.getRepository(MembershipPoint_1.MembershipPoint);
