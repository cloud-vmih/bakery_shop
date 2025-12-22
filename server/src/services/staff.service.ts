// src/services/staff.service.ts
import { AppDataSource } from "../config/database";
import { User } from "../entity/User";
import { Account } from "../entity/Account";
import { Staff } from "../entity/Staff";

export const createStaff = async (staffData: any) => {
  const userRepo = AppDataSource.getRepository(User);
  const accountRepo = AppDataSource.getRepository(Account);
  const staffRepo = AppDataSource.getRepository(Staff);

  const { fullName, email, phoneNumber, dateOfBirth, status } = staffData;

  //Tạo Account với mật khẩu tạm
  const account = accountRepo.create({
    username: email,   // username = email
    password: "123456", // mật khẩu tạm
  });
  await accountRepo.save(account);

  //Tạo Staff
  const staff = staffRepo.create({
    account: account,      // liên kết Account
    fullName: fullName,
    email: email,
    phoneNumber: phoneNumber,
    dateOfBirth: dateOfBirth,
  });

  return await staffRepo.save(staff);
};

export const getAllStaff = async () => {
  const staffRepo = AppDataSource.getRepository(Staff);
  return await staffRepo.find();
};

export const updateStaff = async (id: number, data: any) => {
  const staffRepo = AppDataSource.getRepository(Staff);
  const accountRepo = AppDataSource.getRepository(Account);

  // Lấy staff kèm account
  const staff = await staffRepo.findOne({ where: { id }, relations: ["account"] });
  if (!staff) throw new Error("Staff not found");

  if (data.role) staff.type = data.role;
  if (data.fullName) staff.fullName = data.fullName;
  if (data.email) staff.email = data.email;
  if (data.phoneNumber) staff.phoneNumber = data.phoneNumber;
  if (data.dateOfBirth) staff.dateOfBirth = new Date(data.dateOfBirth);

  // Update Account password nếu có
  if (data.password && staff.account) {
    staff.account.password = data.password; // hoặc hash nếu cần
    await accountRepo.save(staff.account);
  }

  return await staffRepo.save(staff);
};


export const deleteStaff = async (id: number) => {
  const staffRepo = AppDataSource.getRepository(Staff);
  const staff = await staffRepo.findOne({ where: { id } });
  if (!staff) throw new Error("Staff not found");

  return await staffRepo.remove(staff);
};

export const getStaffById = async (id: number) => {
  const staffRepo = AppDataSource.getRepository(Staff);
  const staff = await staffRepo.findOne({ where: { id }, relations: ["account"] });
  if (!staff) throw new Error("Staff not found");
  return staff;
};

