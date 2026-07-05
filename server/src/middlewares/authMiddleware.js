const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password -refreshTokens");
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  if (user.isFrozen) {
    res.status(403);
    throw new Error("Account is frozen. Contact support.");
  }
  req.user = user;
  next();
});

module.exports = { protect };
