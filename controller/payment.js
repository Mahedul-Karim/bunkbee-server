const { User } = require("../model/user");
const { asyncWrapper } = require("../util/asyncWrapper");
const AppError = require("../util/error");
const { Transactions } = require("../model/transactions");
const Stripe = require("stripe");

exports.createIntents = asyncWrapper(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET);

  const { price } = req.body;

  const paymentIntents = await stripe.paymentIntents.create({
    currency: "usd",
    amount: price * 100,
  });

  res.status(201).json({
    success: true,
    client_secret: paymentIntents.client_secret,
  });
});

exports.updateTransactions = asyncWrapper(async (req, res, next) => {
  const user = req.user;

  const { title, type, category, price,packageName } = req.body;

  await Transactions.create({ title, type, category, price, userId: user._id });

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      badge: packageName,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    success: true,
    user:updatedUser,
  });
});
