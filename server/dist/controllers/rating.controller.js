"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRatingController = exports.getCustomerRatingsController = exports.getItemRatingsController = exports.addOrUpdateRatingController = void 0;
const rating_service_1 = require("../services/rating.service");
const addOrUpdateRatingController = async (req, res) => {
    try {
        const { itemID, contents } = req.body;
        const customerID = req.user.id; // middleware auth gán user.id
        const rating = await rating_service_1.ratingService.addOrUpdateRating(customerID, itemID, contents);
        res.json(rating);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.addOrUpdateRatingController = addOrUpdateRatingController;
const getItemRatingsController = async (req, res) => {
    try {
        const itemID = Number(req.params.itemID);
        const ratings = await rating_service_1.ratingService.getItemRatings(itemID);
        res.json(ratings);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getItemRatingsController = getItemRatingsController;
const getCustomerRatingsController = async (req, res) => {
    try {
        const customerID = Number(req.params.customerID);
        const ratings = await rating_service_1.ratingService.getCustomerRatings(customerID);
        res.json(ratings);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getCustomerRatingsController = getCustomerRatingsController;
const deleteRatingController = async (req, res) => {
    try {
        const customerID = Number(req.user.id);
        const itemID = Number(req.params.itemID);
        await rating_service_1.ratingService.removeRating(customerID, itemID);
        res.json({ message: "Xóa rating thành công" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteRatingController = deleteRatingController;
