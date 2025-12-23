"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialAuthRepo = exports.isPhoneNumberTaken = exports.findUserByEmail = exports.updatePassword = exports.findUserByAccountId = exports.findAccountByUsername = exports.deletedUserNotVerified = exports.createUser = exports.createAccount = void 0;
const database_1 = require("../config/database");
const Account_1 = require("../entity/Account");
const Customer_1 = require("../entity/Customer");
const GoogleAccount_1 = require("../entity/GoogleAccount");
const User_1 = require("../entity/User");
const EmailVerification_1 = require("../entity/EmailVerification");
const typeorm_1 = require("typeorm");
const createAccount = async (account) => {
    //console.log("Creating account for username:", username);
    const repo = database_1.AppDataSource.getRepository(Account_1.Account);
    const acc = repo.create(account);
    await repo.save(acc);
    return acc;
};
exports.createAccount = createAccount;
const createUser = async (user) => {
    const repo = database_1.AppDataSource.getRepository(Customer_1.Customer);
    const newUser = repo.create(user);
    await repo.save(newUser);
    return newUser;
};
exports.createUser = createUser;
const deletedUserNotVerified = async () => {
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    const verRepo = database_1.AppDataSource.getRepository(EmailVerification_1.EmailVerification);
    const accRepo = database_1.AppDataSource.getRepository(Account_1.Account);
    // Tìm account chưa verify
    const pending = await verRepo.find({
        where: {
            isVerified: false,
            verifiedAt: (0, typeorm_1.LessThan)(thirtyMinsAgo)
        },
        relations: ["account"],
    });
    // Xoá account -> auto xoá user + verification
    for (const v of pending) {
        await accRepo.delete(v.account.id);
    }
};
exports.deletedUserNotVerified = deletedUserNotVerified;
const findAccountByUsername = async (username) => {
    const repo = database_1.AppDataSource.getRepository(Account_1.Account);
    return await repo.findOne({
        where: { username },
    });
};
exports.findAccountByUsername = findAccountByUsername;
const findUserByAccountId = async (id) => {
    const repo = database_1.AppDataSource.getRepository(User_1.User);
    return await repo.findOne({
        where: { account: { id: id } },
    });
};
exports.findUserByAccountId = findUserByAccountId;
const updatePassword = async (hash, id) => {
    const accountRepo = database_1.AppDataSource.getRepository(Account_1.Account);
    await accountRepo.update({ id }, { password: hash });
};
exports.updatePassword = updatePassword;
const findUserByEmail = async (email) => {
    const repo = database_1.AppDataSource.getRepository(User_1.User);
    const user = await repo.findOne({
        where: { email },
        relations: ["account"]
    });
    return user ?? null;
};
exports.findUserByEmail = findUserByEmail;
const isPhoneNumberTaken = async (phoneNumber) => {
    const repo = database_1.AppDataSource.getRepository(User_1.User);
    const user = await repo.findOne({
        where: { phoneNumber }
    });
    return !!user;
};
exports.isPhoneNumberTaken = isPhoneNumberTaken;
exports.socialAuthRepo = {
    findSocialAccount: async (providerUserId) => {
        const repo = database_1.AppDataSource.getRepository(GoogleAccount_1.GoogleAccount);
        return await repo.findOne({
            where: { provider_user_id: providerUserId },
            relations: ["account"],
        });
    },
    linkSocialAccount: async (providerUserId, email, accountId) => {
        const repo = database_1.AppDataSource.getRepository(GoogleAccount_1.GoogleAccount);
        const acc = repo.create({
            provider_user_id: providerUserId,
            email,
            account: { id: accountId },
        });
        await repo.save(acc);
    },
};
