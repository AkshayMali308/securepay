const router = require("express").Router();
const ctrl = require("../controllers/authController");
const { loginLimiter } = require("../middlewares/rateLimiter");
const { registerValidator, loginValidator, resetPasswordValidator } = require("../validators/authValidators");
const validate = require("../middlewares/validate");

router.post("/register", registerValidator, validate, ctrl.register);
router.post("/login", loginLimiter, loginValidator, validate, ctrl.login);
router.post("/refresh", ctrl.refresh);
router.post("/logout", ctrl.logout);
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password/:token", resetPasswordValidator, validate, ctrl.resetPassword);

module.exports = router;
