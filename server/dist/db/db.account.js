"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialAuthRepo = exports.isPhoneNumberTaken = exports.isEmailTaken = exports.findUserByAccountId = exports.findAccountByUsername = exports.createUser = exports.createAccount = void 0;
const database_1 = require("../config/database");
const Account_1 = require("../entity/Account");
const GoogleAccount_1 = require("../entity/GoogleAccount");
const User_1 = require("../entity/User");
const createAccount = async (account) => {
    //console.log("Creating account for username:", username);
    const repo = database_1.AppDataSource.getRepository(Account_1.Account);
    const acc = repo.create(account);
    await repo.save(acc);
    return acc;
};
exports.createAccount = createAccount;
const createUser = async (user) => {
    const repo = database_1.AppDataSource.getRepository(User_1.User);
    const newUser = repo.create(user);
    await repo.save(newUser);
    return newUser;
};
exports.createUser = createUser;
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
const isEmailTaken = async (email) => {
    const repo = database_1.AppDataSource.getRepository(User_1.User);
    const user = await repo.findOne({
        where: { email }
    });
    return !!user;
};
exports.isEmailTaken = isEmailTaken;
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
