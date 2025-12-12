"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const account_routes_1 = __importDefault(require("./routes/account.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "https://bakery-taupe.vercel.app", // chỉ định frontend origin
    credentials: true // cho phép gửi cookie / auth headers
}));
app.use(express_1.default.json());
app.use("/api/category", category_routes_1.default);
app.use("/api/cart", cart_routes_1.default); // Thêm dòng này
app.use("/api", account_routes_1.default);
exports.default = app;
