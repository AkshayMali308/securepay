const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error("Access denied: insufficient permissions");
  }
  next();
};

module.exports = { restrictTo };
