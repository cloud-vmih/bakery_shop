// // services/rating.service.ts
// import {
//   createOrUpdateRating,
//   getRatingsByItem,
//   getRatingsByCustomer,
//   deleteRating,
// } from "../db/rating.db";
// import { Rating } from "../entity/Rating";
//
// /**
//  * Tạo hoặc cập nhật rating
//  */
// export const ratingService = {
//   addOrUpdateRating: async (
//     customerID: number,
//     itemID: number,
//     contents: string
//   ): Promise<Rating> => {
//     return await createOrUpdateRating(customerID, itemID, contents);
//   },
//
//   getItemRatings: async (itemID: number): Promise<Rating[]> => {
//     return await getRatingsByItem(itemID);
//   },
//
//   getCustomerRatings: async (customerID: number): Promise<Rating[]> => {
//     return await getRatingsByCustomer(customerID);
//   },
//
//   removeRating: async (customerID: number, itemID: number): Promise<void> => {
//     await deleteRating(customerID, itemID);
//   },
// };
