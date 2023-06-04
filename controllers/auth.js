const Auth = require("../models/Auth");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

function isstringinvalid(string) {
  if (string === undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}
const addAuth = async (req, res, next) => {
  console.log(req);
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (
      isstringinvalid(name) ||
      isstringinvalid(email) ||
      isstringinvalid(password)
    ) {
      return res
        .status(400)
        .json({ err: "Bad parameters, something is missing" });
    }

    const saltRound = 10;

    bcrypt.hash(password, saltRound, async (err, hash) => {
      console.log(err);
      await Auth.create({ name, email, password: hash });
      res.status(201).json({ message: "Successfully created new user" });
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

function generateAccessToken(id, name, isPremiumUser) {
  return jwt.sign({ userId: id, name: name, isPremiumUser }, "secret");
}

const loginAuth = async (req, res) => {
  try {
    // console.log(req);
    const email = req.body.email;
    const password = req.body.password;

    console.log(email, password);

    if (isstringinvalid(email) || isstringinvalid(password)) {
      res
        .status(400)
        .json({ message: "email or password is missing", success: false });
    }

    const user = await Auth.findAll({ where: { email } });
    // console.log(user);

    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) {
          throw new Error("Something went wrong");
        }
        if (result === true) {
          const jwtotken = generateAccessToken(
            user[0].id,
            user[0].name,
            user[0].isPremiumUser
          );
          console.log("checking token", jwtotken);
          return res.status(200).json({
            success: true,
            message: "User LOgged in successfully",
            token: jwtotken,
          });
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Password is incorrect" });
        }
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User Doenst exits" });
    }
  } catch {
    (err) => {
      res.status(500).json({ message: err, success: false });
    };
  }
};

module.exports = {
  addAuth,
  loginAuth,
};
