const { Schema, model } = require("mongoose");

const requestedMealsSchema = new Schema({
  title: { type: String },
  category: { type: String },
  image: { type: String },
  requesterName: {
    type: String,
  },
  requesterAvatar: {
    type: String,
  },
  requesterEmail: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "delivered"],
    default: "pending",
  },
});

exports.Requestes = model("Requestes", requestedMealsSchema);
