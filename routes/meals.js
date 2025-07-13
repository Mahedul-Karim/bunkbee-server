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
  .route("/:mealId")
  .get(getSingleMeals)
  .patch(verifyUser, upload.single("image"), updateMeals)
  .delete(verifyUser, deleteMeal);
router.route("/request").post(verifyUser, requestMeals);

router
  .route("/request/user")
  .get(verifyUser, getUserRequestedMeals)
  .delete(verifyUser, deleteRequestedMeal);

router.route("/admin/all").get(verifyUser, adminAllMeals);

exports.mealsRoutes = router;
