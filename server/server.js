require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./src/config/db");
const { initSocket } = require("./src/config/socketConfig");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  const server = http.createServer(app);
  initSocket(server);
  server.listen(PORT, () => {
    console.log(`SecurePay server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

startServer();
