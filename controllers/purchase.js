const Razorpay = require("razorpay");
const Auth = require("../models/Auth");
const Order = require("../models/order");
const jwt = require("jsonwebtoken");
const usercontroller = require("./auth");
function generateAccessToken(id, name, isPremiumUser) {
  return jwt.sign({ userId: id, name: name, isPremiumUser }, "secret");
}
const purchasepremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 2500;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "something went wrong", error: err });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    const authId = req.user.id;
    console.log(authId);

    const promise1 = order.update({
      paymentid: payment_id,
      status: "successfull",
    });
    const promise2 = req.user.update({ isPremiumUser: true });
    Promise.all([promise1, promise2])
      .then(() => {
        return res.status(202).json({
          success: true,
          message: "Transaction Successfull",
          token: generateAccessToken(authId, undefined, true), //generate access token is not a function
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "Something went wrong" });
  }
};

module.exports = {
  purchasepremium,
  updateTransactionStatus,
};
