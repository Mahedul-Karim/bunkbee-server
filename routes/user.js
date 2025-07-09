const express = require("express");

const { createUser, getMe } = require("../controller/user");

const router = express.Router();

router.route("/").post(createUser);
router.route("/me").post(getMe);

exports.userRoutes = router;
