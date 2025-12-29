"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchStaff = exports.removeAccount = exports.removeUser = exports.removeStaff = exports.saveStaff = exports.saveAccount = exports.saveUser = exports.createStaff = exports.createUser = exports.createAccount = exports.findUserByAccountId = exports.findStaffById = exports.findAccountByUsername = exports.findUserByEmail = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entity/User");
const Account_1 = require("../entity/Account");
const Staff_1 = require("../entity/Staff");
// ===== REPOS =====
const userRepo = () => database_1.AppDataSource.getRepository(User_1.User);
const accountRepo = () => database_1.AppDataSource.getRepository(Account_1.Account);
const staffRepo = () => database_1.AppDataSource.getRepository(Staff_1.Staff);
// ===== FIND =====
const findUserByEmail = async (email) => {
    return userRepo().findOne({ where: { email } });
};
exports.findUserByEmail = findUserByEmail;
const findAccountByUsername = async (username) => {
    return accountRepo().findOne({ where: { username } });
};
exports.findAccountByUsername = findAccountByUsername;
const findStaffById = async (id) => {
    return staffRepo().findOne({
        where: { id },
        relations: ["account", "account.user"],
    });
};
exports.findStaffById = findStaffById;
const findUserByAccountId = async (accountId) => {
    return staffRepo().findOne({
        where: { account: { id: accountId } },
    });
};
exports.findUserByAccountId = findUserByAccountId;
// ===== CREATE =====
const createAccount = async (data) => {
    const acc = accountRepo().create(data);
    return accountRepo().save(acc);
};
exports.createAccount = createAccount;
const createUser = async (data) => {
    const user = userRepo().create(data);
    return userRepo().save(user);
};
exports.createUser = createUser;
const createStaff = async (data) => {
    const staff = staffRepo().create(data);
    return staffRepo().save(staff);
};
exports.createStaff = createStaff;
// ===== UPDATE =====
const saveUser = async (user) => {
    return userRepo().save(user);
};
exports.saveUser = saveUser;
const saveAccount = async (account) => {
    return accountRepo().save(account);
};
exports.saveAccount = saveAccount;
const saveStaff = async (staff) => {
    return staffRepo().save(staff);
};
exports.saveStaff = saveStaff;
// ===== DELETE =====
const removeStaff = async (staff) => {
    return staffRepo().remove(staff);
};
exports.removeStaff = removeStaff;
const removeUser = async (user) => {
    return userRepo().remove(user);
};
exports.removeUser = removeUser;
const removeAccount = async (account) => {
    return accountRepo().remove(account);
};
exports.removeAccount = removeAccount;
// ===== QUERY =====
const searchStaff = async (keyword) => {
    const qb = staffRepo()
        .createQueryBuilder("staff")
        .leftJoinAndSelect("staff.account", "account")
        .leftJoinAndSelect("account.user", "user");
    if (keyword && keyword.trim() !== "") {
        qb.where("(user.fullName ILIKE :kw OR user.email ILIKE :kw OR user.phoneNumber ILIKE :kw)", { kw: `%${keyword}%` });
    }
    return qb.getMany();
};
exports.searchStaff = searchStaff;
