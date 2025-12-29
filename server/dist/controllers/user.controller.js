"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileController = exports.getProfileController = void 0;
const user_service_1 = require("../services/user.service");
const getProfileController = async (req, res) => {
    try {
        console.log(req.user.id);
        const user = await (0, user_service_1.getProfile)(req.user.id);
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.getProfileController = getProfileController;
const updateProfileController = async (req, res) => {
    try {
        const updates = req.body;
        const updatedUser = await (0, user_service_1.updateProfile)(req.user.id, updates);
        res.status(200).json({ success: true, data: updatedUser });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateProfileController = updateProfileController;
