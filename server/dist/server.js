"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const account_route_1 = __importDefault(require("./routes/account.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const cart_route_1 = __importDefault(require("./routes/cart.route"));
const branch_route_1 = __importDefault(require("./routes/branch.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const item_route_1 = __importDefault(require("./routes/item.route"));
const inventory_route_1 = __importDefault(require("./routes/inventory.route"));
const address_route_1 = __importDefault(require("./routes/address.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const orders_route_1 = __importDefault(require("./routes/orders.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const payment_vnpay_route_1 = __importDefault(require("./routes/payment.vnpay.route"));
const manageOrder_route_1 = __importDefault(require("./routes/manageOrder.route"));
const wishlist_route_1 = __importDefault(require("./routes/wishlist.route"));
const chat_route_1 = __importDefault(require("./routes/chat.route"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route")); // ← ĐẢM BẢO IMPORT ĐÚNG ĐƯỜNG DẪN
const itemsDiscount_route_1 = __importDefault(require("./routes/itemsDiscount.route"));
const staff_route_1 = __importDefault(require("./routes/staff.route"));
const review_route_1 = __importDefault(require("./routes/review.route"));
const membershipDiscount_route_1 = __importDefault(require("./routes/membershipDiscount.route"));
const mempoint_route_1 = __importDefault(require("./routes/mempoint.route"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api", category_route_1.default);
app.use("/api/cart", cart_route_1.default); // Thêm dòng này
// Mount route cụ thể TRƯỚC route chung
app.use("/api/dashboard", dashboard_route_1.default); // ← PHẢI CÓ DÒNG NÀY, ĐẶT TRƯỚC /api
app.use("/api/manage-orders", manageOrder_route_1.default);
// Route chung user ĐẶT SAU CÙNG
app.use("/api", account_route_1.default);
app.use("/api/branchs", branch_route_1.default);
app.use("/api/items", item_route_1.default);
app.use("/api", inventory_route_1.default);
//app.use("/api", addressRoutes);
app.use('/api', user_route_1.default);
app.use("/api/order", order_route_1.default);
app.use("/api/wishlist", wishlist_route_1.default);
app.use("/api/chat", chat_route_1.default);
app.use("/api", mempoint_route_1.default);
app.use("/addresses", address_route_1.default); // cho FE mới
app.use("/api/addresses", address_route_1.default); // cho API cũ / thống nhất
app.use("/api/orders", orders_route_1.default);
app.use("/api/payment", payment_route_1.default);
app.use("/api/payment/vnpay", payment_vnpay_route_1.default);
app.use("/api/items-discount", itemsDiscount_route_1.default);
app.use("/api/staff", staff_route_1.default);
app.use('/api/reviews', review_route_1.default);
app.use("/api/promotion", membershipDiscount_route_1.default);
app.get("/api/__ping", (req, res) => {
    res.send("OK");
});
// export đặt CUỐI CÙNG
exports.default = app;
