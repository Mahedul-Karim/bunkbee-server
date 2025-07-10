const express = require("express");

const { addMeal } = require("../controller/meals");
const { verifyUser } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(verifyUser, addMeal);

exports.mealsRoutes = router;
