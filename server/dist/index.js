"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
require("reflect-metadata");
const database_1 = require("./config/database");
database_1.AppDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!");
}).catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
// Khớp với baseURL phía client (http://localhost:5000/api)
const PORT = process.env.PORT || 5000;
server_1.default.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
