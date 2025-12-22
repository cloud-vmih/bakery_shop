// src/config/database.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { ItemsDiscount } from "../entity/ItemDiscount";
import { Item } from "../entity/Item";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // Quan trọng: list entity
  entities: [Item, ItemsDiscount],
  synchronize: true,
  logging: false,
});

// Hàm init gọi trong index.ts
export const initDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source initialized!");
  } catch (error) {
    console.error(" Data Source init error:", error);
  }
};
