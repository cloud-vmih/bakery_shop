import { Rating } from "../entity/Rating";
import { ratingRepository } from "../db/rating.db";

const BAD_WORDS_REGEX = /fuck|shit|damn/gi;
export const ratingService = {
  addOrUpdateRating: async (customerID: number, itemID: number, contents: string): Promise<Rating> => {
    return await ratingRepository.createOrUpdateRating(customerID, itemID, contents);
  },

  getItemRatings: async (itemID: number): Promise<Rating[]> => {
    const data = await ratingRepository.getRatingsByItem(itemID);
    for (const item of data) {
        if (BAD_WORDS_REGEX.test(item.contents)) {
            item.contents = item.contents.replace(BAD_WORDS_REGEX, '***');
        }
    }
    return data;
  },

  getCustomerRatings: async (customerID: number): Promise<Rating[]> => {
    const data = await ratingRepository.getRatingsByCustomer(customerID);
    for (const item of data) {
        if (BAD_WORDS_REGEX.test(item.contents)) {
            item.contents = item.contents.replace(BAD_WORDS_REGEX, '***');
        }
    }
    return data;
  },

  removeRating: async (customerID: number, itemID: number): Promise<void> => {
    await ratingRepository.deleteRating(customerID, itemID);
  },
};
