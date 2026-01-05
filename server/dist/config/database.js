"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config();
}
console.log("DATABASE_URL =", process.env.DATABASE_URL);
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER,
    password: String(process.env.DB_PASS),
    database: process.env.DB_NAME,
    //ssl: { rejectUnauthorized: false }, 
    synchronize: false,
    entities: [path_1.default.join(__dirname, "../entity/**/*.js")],
    migrations: [path_1.default.join(__dirname, "../migration/*.js")],
    logging: ["error"],
});
