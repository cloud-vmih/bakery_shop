"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingService = void 0;
const rating_db_1 = require("../db/rating.db");
const BAD_WORDS_REGEX = /fuck|shit|damn/gi;
exports.ratingService = {
    addOrUpdateRating: async (customerID, itemID, contents) => {
        return await rating_db_1.ratingRepository.createOrUpdateRating(customerID, itemID, contents);
    },
    getItemRatings: async (itemID) => {
        const data = await rating_db_1.ratingRepository.getRatingsByItem(itemID);
        for (const item of data) {
            if (BAD_WORDS_REGEX.test(item.contents)) {
                item.contents = item.contents.replace(BAD_WORDS_REGEX, '***');
            }
        }
        return data;
    },
    getCustomerRatings: async (customerID) => {
        const data = await rating_db_1.ratingRepository.getRatingsByCustomer(customerID);
        for (const item of data) {
            if (BAD_WORDS_REGEX.test(item.contents)) {
                item.contents = item.contents.replace(BAD_WORDS_REGEX, '***');
            }
        }
        return data;
    },
    removeRating: async (customerID, itemID) => {
        await rating_db_1.ratingRepository.deleteRating(customerID, itemID);
    },
};
