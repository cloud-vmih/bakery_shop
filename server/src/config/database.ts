import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// import { Account } from "../entity/Account";
// import { User } from "../entity/User";
// import { Cart } from "../entity/Cart";
// import { CartItem } from "../entity/CartItem";
// import { Item } from "../entity/Item";
// import { Wishlist } from "../entity/Wishlist";
// import { Rating } from "../entity/Rating";
// import { Order } from "../entity/Orders";
// import { OrderDetail } from "../entity/OrderDetails";
// import { Payment } from "../entity/Payment";
// import { ItemsDiscount } from "../entity/ItemDiscount";
// import { GoogleAccount } from "../entity/GoogleAccount";
// import { EmailVerification } from "../entity/EmailVerification";
// import { Message } from "../entity/Message";
// import { Conversation } from "../entity/Conversation";
// import { Notification } from "../entity/Notification";
// import { Address } from "../entity/Address";
// import { Customer} from "../entity/Customer";
// import { Staff } from "../entity/Staff";
// import { Admin } from "../entity/Admin";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER, 
  password: String(process.env.DB_PASS), 
  database: process.env.DB_NAME ,
  synchronize: true, 
  // entities: [
  //   Account,
  //   User,
  //   Customer,
  //   Staff,
  //   Admin,
  //   Cart,
  //   CartItem,
  //   Item,
  //   Wishlist,
  //   Rating,
  //   Order,
  //   OrderDetail,
  //   Payment,   
  //   ItemsDiscount,
  //   GoogleAccount,
  //   EmailVerification,
  //   Message,
  //   Conversation,
  //   Notification,
  //   Address,
  // ],
  entities: [path.join(__dirname, "../entity/**/*.ts")],
  migrations: [path.join(__dirname, "../migration/*.ts")],
  logging: ["error"],
});
