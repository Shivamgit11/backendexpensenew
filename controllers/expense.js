const Auth = require("../models/Auth");
const Expense = require("../models/Expense");
const sequelize = require("../util/database");
const Userservice = require("../services/userservices");
const S3services = require("../services/S3services");

const download = async (req, res) => {
  // if (!req.user.ispremiumuser) {
  //   return res.status(400).json({ message: "only for premium user" });
  // }
  try {
    const expenses = await Expense.findAll({ where: { authId: req.user.id } });
    const stringifiedExpense = JSON.stringify(expenses);

    console.log("expense line 21", expenses);

    console.log("stringified", stringifiedExpense);

    //It should depends upon the userid
    const userId = req.user.id;
    const filename = `Expense${userId}/${new Date()}.txt`;
    console.log("at line 30");
    const fileURL = await S3services.uploadToS3(stringifiedExpense, filename);

    console.log("at line 32");
    res.status(200).json({ fileURL, success: true, err: "something wrong" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileURL: "", success: false, err: err });
  }
};

const addExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const amount = req.body.amount;
    const description = req.body.desc;
    const category = req.body.category;

    if (amount == undefined || amount.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Parameter mission" });
    }

    const expense = await Expense.create(
      {
        amount: amount,
        description: description,
        categoru: category,
        authId: req.user.id,
      },
      { transaction: t }
    );

    const totalExpense = Number(req.user.totalExpenses) + Number(amount);
    console.log(totalExpense);
    await Auth.update(
      {
        totalExpenses: totalExpense,
      },
      {
        where: { id: req.user.id },
        transaction: t,
      }
    );

    await t.commit();
    res.status(200).json({ expense: expense });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, error: err });
  }
};

const Items_Per_Page = 5;

const getExpense = async (req, res) => {
  try {
    //14-05-2023
    console.log("line 108", req.query);
    console.log("line 108", req.params);
    let page = req.query.page || 1;

    console.log(page);

    let Items_Per_Page = +req.query.items_per_page || 5;
    if (page == 0) {
      // Items_Per_Page = 0;
      page = 1;
    }
    console.log(Items_Per_Page);
    let totalItems;

    Expense.count()
      .then((total) => {
        totalItems = total;
        return Expense.findAll({
          where: { authId: req.user.id },
          offset: (page - 1) * Items_Per_Page,
          limit: Items_Per_Page,
        });
      })
      .then((Expense) => {
        res.json({
          Expense: Expense,
          currentPage: page,
          hasNextPage: totalItems > page * Items_Per_Page,
          hasPreviousPage: page > 1,
          nextPage: +page + 1,
          previousPage: +page - 1,
          lastPage: Math.ceil(totalItems / Items_Per_Page),
        });
      });
  } catch (err) {
    res.status(500).json({ error: err, success: false });
  }
};

const deleteExpense = async (req, res, next) => {
  console.log(req);

  if (req.params.id === "undefined" || req.params.id.length === 0) {
    console.log("Id is missing");
    return res.status(400).json({ success: false });
  }
  const uId = req.params.id;

  Expense.destroy({ where: { id: uId, authId: req.user.id } })
    .then((noofrows) => {
      if (noofrows === 0) {
        return res.status(404).json({
          success: false,
          message: "Expense doesnt belong to teh user",
        });
      }
      return res
        .status(200)
        .json({ success: true, message: "Deleted Successfully" });
    })
    .catch((err) => {
      return res.status(500).json({ success: true, message: "failed" });
    });
};

module.exports = {
  addExpense,
  getExpense,
  deleteExpense,
  download,
};
