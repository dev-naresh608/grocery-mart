import app from "./app.js";
import { config } from "./configs/config.js";
import connectDB from "./configs/database.js";

const PORT = process.env.PORT || config.server.port || 5000;

const startServer = async () => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  await connectDB();
};

startServer();

