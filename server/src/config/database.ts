import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import dotenv from "dotenv";
import { Order } from '../entity/Orders';
import { OrderDetail } from '../entity/OrderDetails';
import { Item } from '../entity/Item';
import { User } from '../entity/User'; // Nếu có
dotenv.config();
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER, 
  password: String(process.env.DB_PASS), 
  database: process.env.DB_NAME ,
  synchronize: true, 
  entities: [path.join(__dirname, "../entity/**/*.ts")],
  migrations: [path.join(__dirname, "../migration/*.ts")],
  logging: ["error"],
});
