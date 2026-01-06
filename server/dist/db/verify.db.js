"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmailVerified = exports.isAccountVerified = exports.verify = exports.createEmailVerification = void 0;
const database_1 = require("../config/database");
//import { pool } from "../config/db";
const EmailVerification_1 = require("../entity/EmailVerification");
const createEmailVerification = async (accountId) => {
    const repo = database_1.AppDataSource.getRepository(EmailVerification_1.EmailVerification);
    const verification = repo.create({ account: { id: accountId }, isVerified: false, verifiedAt: new Date() });
    await repo.save(verification);
};
exports.createEmailVerification = createEmailVerification;
const verify = async (accountId) => {
    const repo = database_1.AppDataSource.getRepository(EmailVerification_1.EmailVerification);
    const verification = await repo.findOne({ where: { account: { id: accountId } } });
    if (verification) {
        verification.isVerified = true;
        verification.verifiedAt = new Date();
        await repo.save(verification);
    }
};
exports.verify = verify;
const isAccountVerified = async (accountId) => {
    const repo = database_1.AppDataSource.getRepository(EmailVerification_1.EmailVerification);
    const verification = await repo.findOne({ where: { account: { id: accountId } } });
    return verification?.isVerified || false;
};
exports.isAccountVerified = isAccountVerified;
const isEmailVerified = async (email) => {
    const repo = database_1.AppDataSource.getRepository(EmailVerification_1.EmailVerification);
    const verification = await repo
        .createQueryBuilder("ev")
        .leftJoin("ev.account", "acc")
        .leftJoin("acc.user", "u")
        .where("u.email = :email", { email })
        .select(["ev.isVerified"])
        .getOne();
    return verification?.isVerified ?? false;
};
exports.isEmailVerified = isEmailVerified;
