const express = require("express");

const { addMeal, getAllMeals } = require("../controller/meals");
const { verifyUser } = require("../middleware/auth");
const { upload } = require("../config/multer");

const router = express.Router();

router.route("/").post(verifyUser, upload.single("image"), addMeal).get(getAllMeals);

exports.mealsRoutes = router;
