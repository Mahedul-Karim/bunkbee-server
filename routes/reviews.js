const express = require("express");

const { verifyUser } = require("../middleware/auth");
const { createReview } = require("../controller/reviews");

const router = express.Router();

router.route("/").post(verifyUser, createReview);

exports.reviewRoutes = router;
