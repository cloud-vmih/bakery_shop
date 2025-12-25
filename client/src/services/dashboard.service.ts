// src/services/dashboard.service.ts
import API from "../api/axois.config"; // dùng instance chung

export const getDashboardData = (params?: { from?: string; to?: string }) =>
  API.get("/dashboard", { params }).then((res) => res.data); 