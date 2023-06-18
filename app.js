const path = require("path");
const sgMail = require("@sendgrid/mail");
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const compression = require("compression");
const fs = require("fs");

const app = express();

// app.set("view engine", "ejs");
// app.set("views", "views");

const expeneRoutes = require("./routes/expense");
const authRoutes = require("./routes/auth");
const purchaseroutes = require("./routes/purchase");
const leaderrouter = require("./routes/premiumFeature");
const Forgotpassword = require("./models/forgetpassword");

app.use(compression());
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

const resetPasswordRoutes = require("./routes/resetPassword");
var cors = require("cors");
const Expense = require("./models/Expense");
const Auth = require("./models/Auth");

const dotenv = require("dotenv");
const Order = require("./models/order");

// get config vars
dotenv.config();

app.use(cors());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//expense
app.use("/expense", expeneRoutes);

app.use("/auth", authRoutes);

app.use("/purchase", purchaseroutes);

app.use("/premium", leaderrouter);
app.use("/password", resetPasswordRoutes);

app.use((req, res) => {
  console.log("just chill buddyfault", req.originalUrl);
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

console.log("i am ");

//working for expense backend

///everty thing for expense will be done inside it
Auth.hasMany(Expense);
Expense.belongsTo(Auth);

Auth.hasMany(Order);
Order.belongsTo(Auth);

Auth.hasMany(Forgotpassword);
Forgotpassword.belongsTo(Auth);

// sequelize
//   .sync({ alter: true })
//   .then((result) => {
//     // console.log(result);
//     app.listen(3000);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

sequelize
  .sync({ alter: true })
  .then((result) => {
    // console.log(result);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
