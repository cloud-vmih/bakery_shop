"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffController = void 0;
const staff_service_1 = require("../services/staff.service");
exports.StaffController = {
    create: async (req, res) => {
        try {
            const staff = await (0, staff_service_1.createStaff)(req.body);
            res.status(201).json(staff);
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const keyword = req.query.keyword || "";
            const staffList = await (0, staff_service_1.getAllStaff)(keyword);
            res.json(staffList);
        }
        catch (error) {
            console.error("Lỗi getAll:", error); // Log để xem chi tiết
            res.status(500).json({ error: error.message || "Lỗi DB" });
        }
    },
    getById: async (req, res) => {
        return res.json(await (0, staff_service_1.getStaffById)(Number(req.params.id)));
    },
    update: async (req, res) => {
        return res.json(await (0, staff_service_1.updateStaff)(Number(req.params.id), req.body));
    },
    delete: async (req, res) => {
        return res.json(await (0, staff_service_1.deleteStaff)(Number(req.params.id)));
    },
    lock: async (req, res) => {
        return res.json(await (0, staff_service_1.lockStaff)(Number(req.params.id)));
    },
    unlock: async (req, res) => {
        return res.json(await (0, staff_service_1.unlockStaff)(Number(req.params.id)));
    },
};
