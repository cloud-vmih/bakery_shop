import app from "./server";
import "reflect-metadata";
import { AppDataSource } from "./config/database";

AppDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
}).catch((err) => {
  console.error("Error during Data Source initialization:", err);
});

// Khớp với baseURL phía client (http://localhost:5000/api)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


