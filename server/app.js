const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const walletRoutes = require("./src/routes/walletRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const { errorHandler, notFound } = require("./src/middlewares/errorHandler");

const app = express();

app.use(helmet());
app.use(cors({ 
  origin: "https://securepay-frontend-pl6a.onrender.com", 
  credentials: true 
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date() })
);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
