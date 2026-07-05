const router = require("express").Router();
const ctrl = require("../controllers/transactionController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect);
router.get("/", ctrl.listTransactions);
router.get("/export", ctrl.exportTransactions);
router.get("/:id", ctrl.getTransaction);

module.exports = router;
