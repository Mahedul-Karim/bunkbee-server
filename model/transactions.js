const { Schema, model } = require("mongoose");

const transactionsSchema = new Schema({
  title: {
    type: String,
  },
  type: {
    type: String,
  },
  category: {
    type: String,
  },
  purchasedAt: {
    type: Date,
    default: Date.now(),
  },
  price: {
    type: Number,
  },
  userId: {
    type: String,
  },
});

exports.Transactions = model("Transactions", transactionsSchema);
