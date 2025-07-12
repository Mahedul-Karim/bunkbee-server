const { Schema, model } = require("mongoose");

const reviewsSchema = new Schema({
  title: {
    type: String,
  },
  likes: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  reviews_count: {
    type: Number,
  },
  review: {
    type: String,
  },
  reviewerName: {
    type: String,
  },
  reviewerAvatar: {
    type: String,
  },
  reviewerEmail: {
    type: String,
  },
  mealId: {
    type: String,
  },
  reviewerId:{
    type:String
  }
});

exports.Reviews = model("Reviews", reviewsSchema);
