const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  avatar_id: {
    type: String,
  },
  badge: {
    type: String,
    enum: ["bronze", "silver", "gold", "platinum"],
    default: "bronze",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  mealsAdded: {
    type: Number,
    default: 0,
  },
});

exports.User = model("User", userSchema);
