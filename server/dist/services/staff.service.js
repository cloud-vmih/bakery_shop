"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlockStaff = exports.lockStaff = exports.deleteStaff = exports.updateStaff = exports.getStaffById = exports.getAllStaff = exports.createStaff = exports.unlockStaffService = exports.lockStaffService = exports.deleteStaffService = exports.updateStaffService = exports.getStaffByIdService = exports.getAllStaffService = exports.createStaffService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const staff_db_1 = require("../db/staff.db");
// ===== CREATE =====
const createStaffService = async (data) => {
    const { fullName, email, phoneNumber, dateOfBirth, role } = data;
    if (await (0, staff_db_1.findUserByEmail)(email))
        throw new Error("Email đã tồn tại");
    if (await (0, staff_db_1.findAccountByUsername)(email))
        throw new Error("Username đã tồn tại");
    const tempPassword = "123456";
    const hashedPassword = await bcryptjs_1.default.hash(tempPassword, 10);
    const account = await (0, staff_db_1.createAccount)({
        username: email,
        password: hashedPassword,
    });
    const staff = await (0, staff_db_1.createStaff)({
        fullName,
        email,
        phoneNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        status: "active",
        account,
    });
    // const staff = await createStaff({
    //   status: "active",
    //   account,
    // });
    return staff;
};
exports.createStaffService = createStaffService;
exports.createStaff = exports.createStaffService;
// ===== GET ALL =====
const getAllStaffService = async (keyword) => {
    return (0, staff_db_1.searchStaff)(keyword);
};
exports.getAllStaffService = getAllStaffService;
exports.getAllStaff = exports.getAllStaffService;
// ===== GET BY ID =====
const getStaffByIdService = async (id) => {
    const staff = await (0, staff_db_1.findStaffById)(id);
    if (!staff)
        throw new Error("Staff not found");
    return staff;
};
exports.getStaffByIdService = getStaffByIdService;
exports.getStaffById = exports.getStaffByIdService;
// ===== UPDATE =====
const updateStaffService = async (id, data) => {
    const staff = await (0, staff_db_1.findStaffById)(id);
    if (!staff?.account?.id)
        throw new Error("Staff not found");
    const user = await (0, staff_db_1.findUserByAccountId)(staff.account.id);
    if (!user)
        throw new Error("User not found");
    if (data.email && data.email !== user.email) {
        if (await (0, staff_db_1.findUserByEmail)(data.email))
            throw new Error("Email đã tồn tại");
        user.email = data.email;
        staff.account.username = data.email;
        await (0, staff_db_1.saveAccount)(staff.account);
    }
    if (data.fullName)
        user.fullName = data.fullName;
    if (data.phoneNumber)
        user.phoneNumber = data.phoneNumber;
    if (data.dateOfBirth)
        user.dateOfBirth = new Date(data.dateOfBirth);
    await (0, staff_db_1.saveStaff)(user);
    // if (data.role) {
    //   staff.role = data.role;
    //   await saveStaff(staff);
    // }
    return staff;
};
exports.updateStaffService = updateStaffService;
exports.updateStaff = exports.updateStaffService;
// ===== DELETE =====
const deleteStaffService = async (id) => {
    const staff = await (0, staff_db_1.findStaffById)(id);
    if (!staff?.account?.id)
        throw new Error("Staff not found");
    const user = await (0, staff_db_1.findUserByAccountId)(staff.account.id);
    return await (0, staff_db_1.removeStaff)(staff);
    // if (user) await removeUser(user);
    // await removeAccount(staff.account);
};
exports.deleteStaffService = deleteStaffService;
exports.deleteStaff = exports.deleteStaffService;
// ===== LOCK / UNLOCK =====
const lockStaffService = async (id) => {
    const staff = await (0, staff_db_1.findStaffById)(id);
    if (!staff)
        throw new Error("Staff not found");
    staff.status = "locked";
    return await (0, staff_db_1.saveStaff)(staff);
};
exports.lockStaffService = lockStaffService;
exports.lockStaff = exports.lockStaffService;
const unlockStaffService = async (id) => {
    const staff = await (0, staff_db_1.findStaffById)(id);
    if (!staff)
        throw new Error("Staff not found");
    staff.status = "active";
    return (0, staff_db_1.saveStaff)(staff);
};
exports.unlockStaffService = unlockStaffService;
exports.unlockStaff = exports.unlockStaffService;
