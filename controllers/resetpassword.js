const Sib = require("sib-api-v3-sdk");
const uuid = require("uuid");
const sgMail = require("@sendgrid/mail");

const bcrypt = require("bcrypt");
const Auth = require("../models/Auth");

const Forgotpassword = require("../models/forgetpassword");

const dotenv = require("dotenv");
dotenv.config();

const client = Sib.ApiClient.instance;

const apiKey = client.authentications["api-key"];
// apiKey.apiKey = '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';
apiKey.apiKey = process.env.SENGRID_API_KEY;

const transEmailApi = new Sib.TransactionalEmailsApi();

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Auth.findOne({ where: { email } });
    console.log(user, "line 12" + " kjsfd" + email);
    if (user) {
      console.log(email);
      const id = uuid.v4();
      // console.log(id, "line 15");

      user.createForgotpassword({ id, active: true }).catch((err) => {
        throw new Error(err);
      });

      // sgMail.setApiKey(process.env.SENGRID_API_KEY);
      // console.log("line 22", process.env.SENGRID_API_KEY);
      // const msg = {
      //   to: email, // Change to your recipient
      //   from: "mailtoshivam2002@gmail.com", // Change to your verified sender
      //   subject: "Sending with SendGrid is Fun",
      //   text: "and easy to do anywhere, even with Node.js",
      //   html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
      // };
      // console.log(msg);

      const sender = {
        email: "mailtoshivam2002@gmail.com",
        name: "Shivam",
      };

      const receivers = [
        {
          email: `${email}`,
        },
      ];

      transEmailApi
        .sendTransacEmail({
          sender,
          to: receivers,
          subject: "HEllo buddy how are you",
          textContent: `
  <h1>Hello subodh kaise ho</h1>
  <img src='https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1bUaVh.img?w=1920&h=1080&q=60&m=2&f=jpg' />
  <a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>,
  `,
          html: `<a href="http://localhost:3000/password/resetpassword/">Reset password</a>`,
        })
        .then(console.log)
        .catch(console.log);

      console.log("line 64 triggere");

      // sgMail
      //   .send(msg)
      //   .then((response) => {
      //     console.log(response[0].statusCode);
      //     console.log(response[0].headers);
      //     return res.status(response[0].statusCode).json({
      //       message: "Link to reset password sent to your mail ",
      //       sucess: true,
      //     });
      //   })
      //   .catch((error) => {
      //     console.log("line44", error);
      //     throw new Error(error);
      //   });

      //send mail
    } else {
      throw new Error("User doesnt exist");
    }
  } catch (err) {
    console.error("kaunsa error", err);
    return res.json({ message: err, sucess: false });
  }
};

const resetpassword = (req, res) => {
  const id = req.params.id;
  Forgotpassword.findOne({ where: { id } }).then((forgotpasswordrequest) => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
      res.end();
    }
  });
};

const updatepassword = (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    console.log(newpassword + "dkjf" + resetpasswordid);
    Forgotpassword.findOne({ where: { id: resetpasswordid } }).then(
      (resetpasswordrequest) => {
        console.log(resetpasswordrequest);
        Auth.findOne({ where: { id: resetpasswordrequest.authId } }).then(
          (user) => {
            console.log("userDetails", user);
            if (user) {
              //encrypt the password

              const saltRounds = 10;
              bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                  console.log(err);
                  throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, function (err, hash) {
                  // Store hash in your password DB.
                  if (err) {
                    console.log(err);
                    throw new Error(err);
                  }
                  user.update({ password: hash }).then(() => {
                    res
                      .status(201)
                      .json({ message: "Successfuly update the new password" });
                  });
                });
              });
            } else {
              return res
                .status(404)
                .json({ error: "No user Exists", success: false });
            }
          }
        );
      }
    );
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};

module.exports = {
  forgotpassword,
  updatepassword,
  resetpassword,
};
