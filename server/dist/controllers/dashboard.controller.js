"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const getDashboard = async (req, res) => {
    console.log("Dashboard route hit!");
    try {
        const { from, to } = req.query;
        const data = await (0, dashboard_service_1.getDashboardData)({
            from: from ? String(from) : undefined,
            to: to ? String(to) : undefined,
        });
        res.json(data);
    }
    catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ message: error.message || "Lỗi tải dữ liệu dashboard" });
    }
};
exports.getDashboard = getDashboard;
