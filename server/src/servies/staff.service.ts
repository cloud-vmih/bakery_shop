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

  // 1️⃣ Tạo User
  const user = userRepo.create({
    fullName,
    email,
    phoneNumber,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    type: "staff",
  });
  await userRepo.save(user);

  // 2️⃣ Tạo Account với mật khẩu tạm
  const account = accountRepo.create({
    username: email,   // username = email
    password: "123456", // mật khẩu tạm
    user: user,
  });
  await accountRepo.save(account);

  // 3️⃣ Cập nhật lại user.account
  user.account = account;
  await userRepo.save(user);

  // 4️⃣ Tạo Staff
  const staff = staffRepo.create({
    id: user.id,           // kế thừa từ user
    role: "staff",
    status: status ?? "active",
    account: account,      // liên kết Account
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    dateOfBirth: user.dateOfBirth,
    type: "staff",
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

  // Update Staff fields
  if (data.role) staff.role = data.role;
  if (data.status) staff.status = data.status;
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

