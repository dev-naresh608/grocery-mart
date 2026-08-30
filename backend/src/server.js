import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import app from "./app.js";

import { config } from "./configs/config.js";
import connectDB from "./configs/database.js";

const startServer = async () => {
  await connectDB();

  app.listen(config.server.port || 5000, () => {
    console.log(`Server running on port ${config.server.port || 5000}`);
  });
};

startServer();
