const { Schema, model } = require("mongoose");

const upcomingMealsSchema = new Schema({
  title: { type: String },
  category: { type: String },
  image: { type: String },
  image_id: {
    type: String,
  },
  ingredients: [{ type: String }],
  description: { type: String },
  price: { type: Number },
  postTime: { type: Date, default: Date.now() },
  rating: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  reviews_count: {
    type: Number,
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
  likedBy: [
    {
      type: String,
    },
  ],
});

exports.UpcomingMeals = model("UpcomingMeals", upcomingMealsSchema);
