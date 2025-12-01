import "reflect-metadata";
import { AppDataSource } from "./config/database";
import { server } from "./socket";

AppDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
}).catch((err) => {
  console.error("Error during Data Source initialization:", err);
});

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});