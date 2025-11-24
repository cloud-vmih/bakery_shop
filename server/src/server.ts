import express from "express";
import cors from "cors";
import userRoutes from "./routes/account.routes";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000",  // chỉ định frontend origin
  credentials: true                 // cho phép gửi cookie / auth headers
}));
app.use(express.json());
app.use("/api", userRoutes);

export default app;


