const router = require("express").Router();
const ctrl = require("../controllers/walletController");
const { protect } = require("../middlewares/authMiddleware");
const { transferLimiter } = require("../middlewares/rateLimiter");
const { transferValidator } = require("../validators/transferValidators");
const validate = require("../middlewares/validate");

router.use(protect);
router.get("/", ctrl.getWallet);
router.post("/add-money", ctrl.addMoney);
router.post("/withdraw", ctrl.withdrawMoney);
router.post("/transfer", transferLimiter, transferValidator, validate, ctrl.transfer);

module.exports = router;
