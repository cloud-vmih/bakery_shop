"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
const user_db_1 = require("../db/user.db");
// Lấy profile
async function getProfile(userId) {
    const user = await (0, user_db_1.getUserById)(userId);
    if (!user)
        throw new Error('Không tìm thấy người dùng!');
    return user;
}
// Cập nhật profile
async function updateProfile(userId, updates) {
    const updatedUser = await (0, user_db_1.updateUser)(userId, updates); // được join làm sạch, nếu không có file nào update thì trả về null
    if (!updatedUser)
        throw new Error('Không có thay đổi nào hoặc người dùng không tồn tại!');
    return updatedUser;
}
