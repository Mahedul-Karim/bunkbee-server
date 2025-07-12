const express = require("express");

const {
  addMeal,
  getAllMeals,
  getSingleMeals,
  likeMeals,
  requestMeals,
  getUserRequestedMeals,
  deleteRequestedMeal,
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

router
  .route("/request/user")
  .get(verifyUser, getUserRequestedMeals)
  .delete(verifyUser, deleteRequestedMeal);

exports.mealsRoutes = router;
