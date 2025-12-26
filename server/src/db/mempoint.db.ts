import { AppDataSource } from "../config/database";
import { MembershipPoint } from "../entity/MembershipPoint";

export class MembershipPointDB {
  private static repository = AppDataSource.getRepository(MembershipPoint);

  // Thêm bản ghi tích điểm
  static async addPointRecord(data: Partial<MembershipPoint>) {
    const record = this.repository.create(data);
    return await this.repository.save(record);
  }

  // Lấy lịch sử tích điểm của khách hàng
  static async getHistoryByCustomerId(customerId: number) {
    return await this.repository.find({
      where: { user: { id: customerId } },
      order: { createdAt: "DESC" },
    });
  }

  // Tính tổng điểm hiện tại (có thể dùng field trong Customer, nhưng backup bằng query)
  static async getTotalPoints(customerId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder("point")
      .select("COALESCE(SUM(point.earnedPoints), 0)", "total")
      .where("point.customerId = :customerId", { customerId })
      .getRawOne();
    return Number(result.total);
  }
}