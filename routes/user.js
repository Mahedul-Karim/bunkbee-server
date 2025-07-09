const express = require("express");

const { createUser, getMe, logout } = require("../controller/user");

const router = express.Router();

router.route("/").post(createUser);
router.route("/me").post(getMe);
router.route("/logout").post(logout);

exports.userRoutes = router;
