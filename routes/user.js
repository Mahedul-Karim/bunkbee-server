const express = require("express");

const {
  createUser,
  getMe,
  logout,
  googleSignin,
} = require("../controller/user");
const { upload } = require("../config/multer");

const router = express.Router();

router.route("/").post(upload.single("image"), createUser);
router.route("/me").post(getMe);
router.route("/logout").post(logout);
router.route("/google").post(googleSignin);

exports.userRoutes = router;
