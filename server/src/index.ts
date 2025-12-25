import "reflect-metadata";
import { AppDataSource } from "./config/database";
import app from "./server";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    
    // 🔹 Listen SAU DB OK – fix 500 error
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
    process.exit(1);  // Dừng server nếu DB fail
  });