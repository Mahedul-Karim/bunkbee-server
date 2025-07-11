const express = require("express");

const { addMeal } = require("../controller/meals");
const { verifyUser } = require("../middleware/auth");
const { upload } = require("../config/multer");

const router = express.Router();

router.route("/").post(verifyUser, upload.single("image"), addMeal);

exports.mealsRoutes = router;
