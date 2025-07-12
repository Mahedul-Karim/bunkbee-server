const express = require("express");

const {
  addMeal,
  getAllMeals,
  getSingleMeals,
  likeMeals,
  requestMeals,
} = require("../controller/meals");
const { verifyUser } = require("../middleware/auth");
const { upload } = require("../config/multer");

const router = express.Router();

router
  .route("/")
  .post(verifyUser, upload.single("image"), addMeal)
  .get(getAllMeals)
  .patch(verifyUser, likeMeals);
router.route("/:mealId").get(getSingleMeals);
router.route("/request").post(verifyUser, requestMeals);

exports.mealsRoutes = router;
