const express = require("express");

const {
  addMeal,
  getAllMeals,
  getSingleMeals,
  likeMeals,
  requestMeals,
  getUserRequestedMeals,
  deleteRequestedMeal,
  adminAllMeals,
  updateMeals,
  deleteMeal,
  allRequestedMeals,
  updateRequestedMeals,
  getUpcomingMeals,
  updateUpcomingMeals,
  addUpcomingMeal,
  manageUpcomingMealsLikes,
} = require("../controller/meals");
const { verifyUser } = require("../middleware/auth");
const { upload } = require("../config/multer");

const router = express.Router();

router
  .route("/")
  .post(verifyUser, upload.single("image"), addMeal)
  .get(getAllMeals)
  .patch(verifyUser, likeMeals);

router
  .route("/upcoming/meal")
  .post(verifyUser, upload.single("image"), addUpcomingMeal)
  .patch(verifyUser, manageUpcomingMealsLikes);

router
  .route("/:mealId")
  .get(getSingleMeals)
  .patch(verifyUser, upload.single("image"), updateMeals)
  .delete(verifyUser, deleteMeal);
router
  .route("/request/meals")
  .post(verifyUser, requestMeals)
  .get(verifyUser, allRequestedMeals)
  .patch(verifyUser, updateRequestedMeals);

router
  .route("/request/user")
  .get(verifyUser, getUserRequestedMeals)
  .delete(verifyUser, deleteRequestedMeal);

router
  .route("/upcoming/admin")
  .get(getUpcomingMeals)
  .patch(verifyUser, updateUpcomingMeals);

router.route("/admin/all").get(verifyUser, adminAllMeals);

exports.mealsRoutes = router;
