const Auth = require("../models/Auth");

const Expense = require("../models/Expense");

const sequelize = require("../util/database");

const getUserLeaderBoard = async (req, res) => {
  try {
    const leaderboardofusers = await Auth.findAll({
      order: [["totalExpenses", "DESC"]],
    });
    // const userAggreatedExpenses = await Expense.findAll({
    //   attributes: [
    //     "authId",
    //     [sequelize.fn("sum", sequelize.col("expenses.amount")), "total_cost"],
    //   ],
    //   group: ["authID"],
    // });

    // const userAggreatedExpenses = [];
    // console.log(expenses);

    // expenses.forEach((expense) => {
    //   if (userAggreatedExpenses[expense.authId]) {
    //     userAggreatedExpenses[expense.authId] =
    //       userAggreatedExpenses[expense.authId] + expense.amount;
    //   } else {
    //     userAggreatedExpenses[expense.authId] = expense.amount;
    //   }    // });

    // var userLeaderBoardDetails = [];
    // users.forEach((user) => {
    //   userLeaderBoardDetails.push({
    //     name: user.name,
    //     total_cost: userAggreatedExpenses[user.id] || 0,
    //   });
    // });
    // console.log(userLeaderBoardDetails);
    // userLeaderBoardDetails.sort((a, b) => {
    //   b.total_cost - a.total_cost;
    // });
    res.status(200).json(leaderboardofusers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  getUserLeaderBoard,
};
