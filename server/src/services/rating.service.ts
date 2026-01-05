import { Rating } from "../entity/Rating";
import { ratingRepository } from "../db/rating.db";

export const ratingService = {
  addOrUpdateRating: async (customerID: number, itemID: number, contents: string): Promise<Rating> => {
    return await ratingRepository.createOrUpdateRating(customerID, itemID, contents);
  },

  getItemRatings: async (itemID: number): Promise<Rating[]> => {
    return await ratingRepository.getRatingsByItem(itemID);
  },

  getCustomerRatings: async (customerID: number): Promise<Rating[]> => {
    return await ratingRepository.getRatingsByCustomer(customerID);
  },

  removeRating: async (customerID: number, itemID: number): Promise<void> => {
    await ratingRepository.deleteRating(customerID, itemID);
  },
};
