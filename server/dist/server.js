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
const branch_routes_1 = __importDefault(require("./routes/branch.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const address_routes_1 = __importDefault(require("./routes/address.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // chỉ định frontend origin
    credentials: true // cho phép gửi cookie / auth headers
}));
app.use(express_1.default.json());
app.use("/api", category_routes_1.default);
app.use("/api", cart_routes_1.default); // Thêm dòng này
app.use("/api", account_routes_1.default);
app.use("/api/branchs", branch_routes_1.default);
app.use("/api", address_routes_1.default);
app.use('/api', user_routes_1.default);
exports.default = app;
