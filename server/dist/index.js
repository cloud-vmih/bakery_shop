"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const database_1 = require("./config/database");
const socket_1 = require("./socket");
database_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
// Khớp với baseURL phía client (http://localhost:5000/api)
const PORT = process.env.PORT || 5000;
socket_1.server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
