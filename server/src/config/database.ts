import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
console.log("DATABASE_URL =", process.env.DATABASE_URL);
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres", 
  password: String(process.env.DB_PASS) || "nthg", 
  database: process.env.DB_NAME ,
  //ssl: { rejectUnauthorized: false }, 
  synchronize: true, 
  entities: [path.join(__dirname, "../entity/**/*.ts")],
  migrations: [path.join(__dirname, "../migration/*.js")],
  logging: ["error"],
});