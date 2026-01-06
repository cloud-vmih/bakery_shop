// src/services/dashboard.service.ts

import dayjs from "dayjs";
import { Between } from "typeorm";
import {
  orderRepo,
  getNetRevenueInRange,
  findOrdersInRangeWithDetails,
} from "../db/manageOrder.db";
import { Order } from "../entity/Orders";

interface DashboardFilters {
  from?: string;
  to?: string;
}

export const getDashboardData = async (filters: DashboardFilters) => {
  const fromDate = filters.from
    ? dayjs(filters.from).startOf("day").toDate()
    : dayjs().subtract(30, "day").startOf("day").toDate();

  const toDate = filters.to
    ? dayjs(filters.to).endOf("day").toDate()
    : dayjs().endOf("day").toDate();

  // Lấy toàn bộ đơn hàng trong khoảng thời gian để tính các chỉ số chi tiết
  const orders: Order[] = await findOrdersInRangeWithDetails(fromDate, toDate);

  if (orders.length === 0) {
    return {
      summary: {
        netRevenue: 0,
        grossRevenue: 0,
        totalOrders: 0,
        successfulOrders: 0,
        processingOrders: 0,
        canceledOrders: 0,
        totalCakesSold: 0,
        aov: 0,
        newCustomers: 0,
        cancelRate: 0,
        returningRate: 0,
        revenueChangePercent: 0,
      },
      revenueChart: [],
      topProducts: [],
      orderStatusPie: [],
      hourlyOrders: [],
      topCancelReasons: [],
    };
  }

  // ==================== TÍNH TOÁN CHUNG ====================
  let netRevenue = 0;
  let totalCakesSold = 0;

  const productMap = new Map<string, { sold: number; revenue: number }>();
  const statusCount: Record<string, number> = {};
  const revenueByDay = new Map<string, number>();
  const hourlyMap = new Map<string, number>();
  const customerOrderCount = new Map<number, number>();
  const cancelReasonMap = new Map<string, number>();

  orders.forEach((order) => {
    const status = order.status || "UNKNOWN";
    statusCount[status] = (statusCount[status] || 0) + 1;

    const dayKey = dayjs(order.createAt).format("DD/MM");
    let dailyRevenue = 0;

    // Giờ cao điểm
    const hour = dayjs(order.createAt).hour();
    let hourRange = "";
    if (hour < 10) hourRange = "8h-10h";
    else if (hour < 12) hourRange = "10h-12h";
    else if (hour < 14) hourRange = "12h-14h";
    else if (hour < 16) hourRange = "14h-16h";
    else if (hour < 18) hourRange = "16h-18h";
    else hourRange = "18h-20h";
    hourlyMap.set(hourRange, (hourlyMap.get(hourRange) || 0) + 1);

    // Khách quay lại
    if (order.customer?.id) {
      customerOrderCount.set(order.customer.id, (customerOrderCount.get(order.customer.id) || 0) + 1);
    }

    // Lý do hủy
    if (order.status === "CANCELED" && order.cancelReason) {
      const reason = order.cancelReason.trim() || "Không có lý do";
      cancelReasonMap.set(reason, (cancelReasonMap.get(reason) || 0) + 1);
    }

    // Chi tiết sản phẩm & doanh thu
    order.orderDetails?.forEach((detail) => {
      const item = detail.item;
      const quantity = detail.quantity || 1;
      const price = item?.price || 0;
      const subtotal = quantity * price;

      netRevenue += subtotal;
      totalCakesSold += quantity;
      dailyRevenue += subtotal;

      const name = item?.name || "Sản phẩm không tên";
      const current = productMap.get(name) || { sold: 0, revenue: 0 };
      productMap.set(name, {
        sold: current.sold + quantity,
        revenue: current.revenue + subtotal,
      });
    });

    revenueByDay.set(dayKey, (revenueByDay.get(dayKey) || 0) + dailyRevenue);
  });

  // ==================== TÍNH TOÁN CHỈ SỐ ====================
  const totalOrders = orders.length;
  const successfulOrders = statusCount["COMPLETED"] || 0;
  const canceledOrders = statusCount["CANCELED"] || 0;
  const processingOrders = totalOrders - successfulOrders - canceledOrders;

  const grossRevenue = netRevenue + totalOrders * 30000; // phí ship giả định
  const aov = totalOrders > 0 ? Math.round(netRevenue / totalOrders) : 0;
  const cancelRate = totalOrders > 0 ? Math.round((canceledOrders / totalOrders) * 1000) / 10 : 0;

  // Tỷ lệ khách quay lại
  const totalUniqueCustomers = customerOrderCount.size;
  const returningCustomers = Array.from(customerOrderCount.values()).filter((count) => count > 1).length;
  const returningRate = totalUniqueCustomers > 0 ? Math.round((returningCustomers / totalUniqueCustomers) * 100) : 0;

  // So sánh doanh thu kỳ trước - dùng method từ repository
  const durationMs = toDate.getTime() - fromDate.getTime();
  const prevFrom = new Date(fromDate.getTime() - durationMs - 1);
  const prevTo = new Date(toDate.getTime() - durationMs - 1);

  const prevNetRevenue = await getNetRevenueInRange(prevFrom, prevTo);

  const revenueChangePercent =
    prevNetRevenue > 0
      ? Math.round(((netRevenue - prevNetRevenue) / prevNetRevenue) * 1000) / 10
      : netRevenue > 0
      ? 100
      : 0;

  // Top lý do hủy
  const topCancelReasons = Array.from(cancelReasonMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([reason, count]) => ({ reason, count }));

  // Top sản phẩm
  const topProducts = Array.from(productMap.entries())
    .map(([name, data]) => ({
      name,
      sold: data.sold,
      revenue: data.revenue,
      percent: netRevenue > 0 ? Math.round((data.revenue / netRevenue) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Biểu đồ doanh thu theo ngày
  const revenueChart = Array.from(revenueByDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, revenue]) => ({ name, revenue }));

  // Biểu đồ tròn trạng thái đơn
  const orderStatusPie = Object.entries(statusCount).map(([status, value]) => ({
    name:
      status === "PENDING" ? "Chờ xác nhận" :
      status === "CONFIRMED" ? "Đã xác nhận" :
      status === "PREPARING" ? "Đang chuẩn bị" :
      status === "DELIVERING" ? "Đang giao" :
      status === "COMPLETED" ? "Hoàn thành" :
      status === "CANCELED" ? "Đã hủy" :
      status,
    value,
  }));

  // Đơn hàng theo khung giờ
  const hourlyOrders = Array.from(hourlyMap.entries())
    .map(([hour, orders]) => ({ hour, orders }))
    .sort((a, b) => a.hour.localeCompare(b.hour));

  return {
    summary: {
      netRevenue,
      grossRevenue,
      totalOrders,
      successfulOrders,
      processingOrders,
      canceledOrders,
      totalCakesSold,
      aov,
      newCustomers: totalUniqueCustomers,
      cancelRate,
      returningRate,
      revenueChangePercent,
    },
    revenueChart,
    topProducts,
    orderStatusPie,
    hourlyOrders,
    topCancelReasons,
  };
};