const { Schema, model } = require("mongoose");

const mealsSchema = new Schema({
  title: { type: String },
  category: { type: String },
  image: { type: String },
  ingredients: [{ type: String }],
  description: { type: String },
  price: { type: Number },
  postTime: { type: Date, default: Date.now() },
  rating: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  status: { type: String, enum: ["upcoming", "published"] },
  reviews_count: {
    type: String,
    default: 0,
  },
  distributor_name: {
    type: String,
  },
  distributor_email: {
    type: String,
  },
  distributor_avatar: {
    type: String,
  },
});

exports.Meals = model("Meals", mealsSchema);
