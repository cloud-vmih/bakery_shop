import { AppDataSource } from "../config/database";
//import { pool } from "../config/db";
import { EmailVerification } from "../entity/EmailVerification";

export const createEmailVerification = async (accountId: number) => {
    const repo = AppDataSource.getRepository(EmailVerification);
    const verification = repo.create({ account: { id: accountId }, isVerified: false, verifiedAt: new Date() });
    await repo.save(verification);
};

export const verify = async (accountId: number) => {
    const repo = AppDataSource.getRepository(EmailVerification);
    const verification = await repo.findOne({ where: { account: { id: accountId } } });
    if (verification) {
        verification.isVerified = true;
        verification.verifiedAt = new Date();
        await repo.save(verification);
    }
};

export const isAccountVerified = async (accountId: number) => {
    const repo = AppDataSource.getRepository(EmailVerification);
    const verification = await repo.findOne({ where: { account: { id: accountId } } });
    return verification?.isVerified || false;
}

export const isEmailVerified = async (email: string) => {
    const repo = AppDataSource.getRepository(EmailVerification);
    const verification = await repo
        .createQueryBuilder("ev")
        .leftJoin("ev.account", "acc")
        .leftJoin("acc.user", "u")
        .where("u.email = :email", { email })
        .select(["ev.isVerified"])
        .getOne();

    return verification?.isVerified ?? false;
}