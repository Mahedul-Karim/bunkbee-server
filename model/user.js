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
    required: true,
  },
  badge: {
    type: String,
    enum: ["bronze", "silver", "gold", "platinum"],
    default: "bronze",
  },
});

exports.User = model("User", userSchema);
