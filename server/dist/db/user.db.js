"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.getRawUserByID = getRawUserByID;
exports.getCustomerByID = getCustomerByID;
<<<<<<< HEAD
exports.getAllAdminAndStaff = getAllAdminAndStaff;
exports.getAllCustomer = getAllCustomer;
=======
>>>>>>> origin/feature/cake-filling
// db/user.ts (cho các operations với single user)
const database_1 = require("../config/database");
const User_1 = require("../entity/User");
const Customer_1 = require("../entity/Customer");
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
// Helper để format dateOfBirth thành string (YYYY-MM-DD)
function formatDate(date) {
    if (!date)
        return '';
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
}
// Lấy thông tin user theo ID (không select password để bảo mật)
async function getUserById(userId) {
    const user = await userRepository.findOne({
        where: { id: userId },
        select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            dateOfBirth: true,
            avatarURL: true,
        },
    });
    if (!user || !user.id)
        return null; // Check id để type narrow thành number
    return {
        id: user.id,
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: formatDate(user.dateOfBirth),
        avatar: user.avatarURL || null,
    };
}
// Cập nhật thông tin user
async function updateUser(userId, updates) {
    if (Object.keys(updates).length === 0) {
        return null; // Không có field nào để update
    }
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
        return null;
    }
    // Map updates để khớp entity fields (sử dụng undefined thay vì null để khớp type ?)
    if (updates.fullName !== undefined)
        user.fullName = updates.fullName;
    if (updates.email !== undefined)
        user.email = updates.email;
    if (updates.phoneNumber !== undefined)
        user.phoneNumber = updates.phoneNumber;
    if (updates.dateOfBirth !== undefined) {
        user.dateOfBirth = updates.dateOfBirth ? new Date(updates.dateOfBirth) : undefined;
    }
    if (updates.avatar !== undefined)
        user.avatarURL = updates.avatar;
    const savedUser = await userRepository.save(user);
    if (!savedUser || !savedUser.id) { // Check id sau save
        return null;
    }
    // Trả về response đã map
    return {
        id: savedUser.id,
        fullName: savedUser.fullName || '',
        email: savedUser.email || '',
        phoneNumber: savedUser.phoneNumber || '',
        dateOfBirth: formatDate(savedUser.dateOfBirth),
        avatar: savedUser.avatarURL || null,
    };
}
async function getRawUserByID(userId) {
    return await userRepository.findOne({ where: { id: userId } });
}
async function getCustomerByID(userId) {
    const customerRepository = database_1.AppDataSource.getRepository(Customer_1.Customer);
    return await customerRepository.findOne({ where: { id: userId } });
}
<<<<<<< HEAD
async function getAllAdminAndStaff() {
    return await userRepository.find({
        where: [
            { type: "Admin" },
            { type: "Staff" },
        ],
        select: ["id"],
    });
}
async function getAllCustomer() {
    return await userRepository.find({
        where: { type: "Customer" },
        select: ["id"],
    });
}
=======
>>>>>>> origin/feature/cake-filling
