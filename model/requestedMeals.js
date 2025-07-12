const { Schema, model } = require("mongoose");

const requestedMealsSchema = new Schema({
  title: { type: String },
  category: { type: String },
  image: { type: String },
  price: {
    type: Number,
  },
  requesterName: {
    type: String,
  },
  requesterAvatar: {
    type: String,
  },
  requesterEmail: {
    type: String,
  },
  likes: { type: Number },
  reviews_count: {
    type: Number,
  },
  requesterId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "delivered"],
    default: "pending",
  },
});

exports.Requestes = model("Requestes", requestedMealsSchema);
