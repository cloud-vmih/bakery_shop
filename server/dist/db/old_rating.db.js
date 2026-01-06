"use strict";
// // db/rating.db.ts
// import { AppDataSource } from "../config/database";
// import { Rating } from "../entity/Rating";
// import { Item } from "../entity/Item";
// import { Customer } from "../entity/Customer";
//
// /**
//  * Thêm hoặc cập nhật rating của user cho item
//  */
// export const createOrUpdateRating = async (
//   customerID: number,
//   itemID: number,
//   contents: string
// ) => {
//   const repo = AppDataSource.getRepository(Rating);
//
//   let rating = await repo.findOne({ where: { customer: {id : customerID}, item: {id: itemID } } });
//
//   if (rating) {
//     // Update nội dung nếu đã tồn tại
//     rating.contents = contents;
//   } else {
//     // Tạo mới rating
//     rating = repo.create({
//         customer: {id: customerID}, item: {id : itemID}, contents });
//   }
//
//   await repo.save(rating);
//   return rating;
// };
//
// /**
//  * Lấy tất cả rating của 1 item
//  */
// export const getRatingsByItem = async (itemID: number) => {
//   const repo = AppDataSource.getRepository(Rating);
//   return await repo.find({
//     where: { item: {id : itemID} },
//     relations: ["customer"],
//     order: { createAt: "DESC" },
//   });
// };
//
// /**
//  * Lấy tất cả rating của 1 user
//  */
// export const getRatingsByCustomer = async (customerID: number) => {
//   const repo = AppDataSource.getRepository(Rating);
//   return await repo.find({
//     where: { customer: {id: customerID} },
//     relations: ["item"],
//     order: { createAt: "DESC" },
//   });
// };
//
// /**
//  * Xóa rating
//  */
// // export const deleteRating = async (customerID: number, itemID: number) => {
// //   const repo = AppDataSource.getRepository(Rating);
// //   await repo.delete({ customerID, itemID });
// // };
