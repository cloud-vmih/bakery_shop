// src/utils/exportExcel.ts
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { message } from "antd";
import dayjs from "dayjs";

interface DashboardData {
  summary: {
    netRevenue: number;
    grossRevenue: number;
    totalOrders: number;
    successfulOrders: number;
    processingOrders: number;
    canceledOrders: number;
    totalCakesSold: number;
    aov: number;
    newCustomers: number;
    cancelRate: number;
    returningRate?: number;
    revenueChangePercent?: number;
  };
  topProducts: Array<{ name: string; sold: number; revenue: number; percent: number }>;
  topCancelReasons?: Array<{ reason: string; count: number }>;
}

export const exportDashboardToExcel = (
  data: DashboardData,
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null
) => {
  if (data.summary.totalOrders === 0) {
    message.info("Chưa có dữ liệu để xuất báo cáo");
    return;
  }

  const wb = XLSX.utils.book_new();

  // Sheet 1: Tổng quan
  const summaryData = [
    ["BÁO CÁO DOANH SỐ - BAKERY SHOP"],
    [`Khoảng thời gian: ${dateRange?.[0]?.format("DD/MM/YYYY")} - ${dateRange?.[1]?.format("DD/MM/YYYY")}`],
    [""],
    ["CHỈ SỐ", "GIÁ TRỊ"],
    ["Doanh thu thuần", `${data.summary.netRevenue.toLocaleString()} ₫`],
    ["Doanh thu tổng (có phí ship)", `${data.summary.grossRevenue.toLocaleString()} ₫`],
    ["Tổng đơn hàng", data.summary.totalOrders],
    ["Đơn hoàn thành", data.summary.successfulOrders],
    ["Đơn đang xử lý", data.summary.processingOrders],
    ["Đơn đã hủy", data.summary.canceledOrders],
    ["Tổng bánh bán ra", `${data.summary.totalCakesSold} chiếc`],
    ["Đơn trung bình (AOV)", `${data.summary.aov.toLocaleString()} ₫`],
    ["Khách hàng mới", data.summary.newCustomers],
    ["Tỷ lệ hủy đơn", `${data.summary.cancelRate}%`],
    ["Tỷ lệ khách quay lại", `${data.summary.returningRate || 0}%`],
    ["Doanh thu so với kỳ trước", `${data.summary.revenueChangePercent || 0}%`],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary["!cols"] = [{ wch: 35 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, "Tổng quan");

  // Sheet 2: Top sản phẩm
  const topProductsData = [
    ["TOP SẢN PHẨM BÁN CHẠY"],
    ["STT", "Tên sản phẩm", "Số lượng bán", "Doanh thu", "% đóng góp"],
    ...data.topProducts.map((p, i) => [
      i + 1,
      p.name,
      p.sold,
      `${p.revenue.toLocaleString()} ₫`,
      `${p.percent}%`,
    ]),
  ];

  const wsProducts = XLSX.utils.aoa_to_sheet(topProductsData);
  wsProducts["!cols"] = [{ wch: 8 }, { wch: 40 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsProducts, "Top sản phẩm");

  // Sheet 3: Lý do hủy (nếu có)
  if (data.topCancelReasons && data.topCancelReasons.length > 0) {
    const cancelData = [
      ["TOP LÝ DO HỦY ĐƠN"],
      ["STT", "Lý do", "Số lần", "Tỷ lệ"],
      ...data.topCancelReasons.map((r, i) => [
        i + 1,
        r.reason,
        r.count,
        `${Math.round((r.count / data.summary.canceledOrders) * 100)}%`,
      ]),
    ];

    const wsCancel = XLSX.utils.aoa_to_sheet(cancelData);
    wsCancel["!cols"] = [{ wch: 8 }, { wch: 50 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsCancel, "Lý do hủy");
  }

  // Xuất file
  const fileName = `BaoCao_DoanhSo_${dayjs(dateRange?.[0]).format("DD-MM-YYYY")}_den_${dayjs(dateRange?.[1]).format("DD-MM-YYYY")}.xlsx`;
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, fileName);

  message.success("Xuất báo cáo Excel thành công!");
};