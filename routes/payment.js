const express = require("express");

const { verifyUser } = require("../middleware/auth");
const { createIntents, updateTransactions } = require("../controller/payment");

const router = express.Router();

router.route("/").post(verifyUser, createIntents);
router.route("/success").post(verifyUser, updateTransactions);

exports.paymentRoutes = router;
