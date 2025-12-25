// src/services/dashboard.service.ts
import dayjs from "dayjs";
import { Between } from "typeorm";
import { orderRepo } from "../db(raw)/db.manageOrder";
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

  // Lấy đơn hàng trong khoảng thời gian hiện tại
  const orders = await orderRepo.find({
    where: {
      createAt: Between(fromDate, toDate),
    },
    relations: ["customer", "orderDetails"],
    order: { createAt: "ASC" },
  });

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

  // Map để tính khách quay lại
  const customerOrderCount = new Map<number, number>(); // customerID -> số đơn

  // Map lý do hủy
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

    // Khách hàng quay lại
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
      const info = detail.itemInfo || {};
      const quantity = info.quantity || 1;
      const price = info.price || 0;
      const subtotal = quantity * price;

      netRevenue += subtotal;
      totalCakesSold += quantity;
      dailyRevenue += subtotal;

      const name = info.name || "Sản phẩm không tên";
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
  const processingOrders = totalOrders - successfulOrders - (statusCount["CANCELED"] || 0);
  const canceledOrders = statusCount["CANCELED"] || 0;

  const grossRevenue = netRevenue + totalOrders * 30000; // phí ship giả định
  const aov = totalOrders > 0 ? Math.round(netRevenue / totalOrders) : 0;
  const cancelRate = totalOrders > 0 ? Math.round((canceledOrders / totalOrders) * 100 * 10) / 10 : 0;

  // 3. Tỷ lệ khách quay lại
  const totalUniqueCustomers = customerOrderCount.size;
  const returningCustomers = Array.from(customerOrderCount.values()).filter(count => count > 1).length;
  const returningRate = totalUniqueCustomers > 0 ? Math.round((returningCustomers / totalUniqueCustomers) * 100) : 0;

  // 1. So sánh doanh thu kỳ trước
  const durationMs = toDate.getTime() - fromDate.getTime();
  const prevFrom = new Date(fromDate.getTime() - durationMs - 1); // trừ chính xác khoảng thời gian
  const prevTo = new Date(toDate.getTime() - durationMs - 1);

  const prevOrders = await orderRepo.find({
    where: { createAt: Between(prevFrom, prevTo) },
    relations: ["orderDetails"],
  });

  let prevNetRevenue = 0;
  prevOrders.forEach(order => {
    order.orderDetails?.forEach(d => {
      const info = d.itemInfo || {};
      prevNetRevenue += (info.quantity || 1) * (info.price || 0);
    });
  });

  const revenueChangePercent = prevNetRevenue > 0
    ? Math.round(((netRevenue - prevNetRevenue) / prevNetRevenue) * 100 * 10) / 10
    : netRevenue > 0 ? 100 : 0;

  // 4. Top lý do hủy
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

  // Biểu đồ
  const revenueChart = Array.from(revenueByDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, revenue]) => ({ name, revenue }));

  const orderStatusPie = Object.entries(statusCount).map(([status, value]) => ({
    name:
      status === "PENDING" ? "Chờ xác nhận" :
      status === "CONFIRMED" ? "Đã xác nhận" :
      status === "PREPARING" ? "Đang chuẩn bị" :
      status === "DELIVERING" ? "Đang giao" :
      status === "COMPLETED" ? "Hoàn thành" :
      status === "CANCELED" ? "Đã hủy" : status,
    value,
  }));

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
      newCustomers: totalUniqueCustomers, // cập nhật thực tế
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