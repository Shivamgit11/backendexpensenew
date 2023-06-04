const Sib = require("sib-api-v3-sdk");

const dotenv = require("dotenv");
dotenv.config();

const client = Sib.ApiClient.instance;

const apiKey = client.authentications["api-key"];
// apiKey.apiKey = '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';
apiKey.apiKey = process.env.SENGRID_API_KEY;

const transEmailApi = new Sib.TransactionalEmailsApi();

const sender = {
  email: "mailtoshivam2002@gmail.com",
  name: "Shivam",
};

const receivers = [
  {
    email: "shivamworking123@gmail.com",
  },
  {
    email: "mailtoshivam2002@gmail.com",
  },
];

const sendmain = () => {
  transEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: "HEllo buddy how are you",
      textContent: `
  <h1>Hello devashis kaise ho</h1>
  <img src='https://scontent.fjai1-4.fna.fbcdn.net/v/t1.6435-9/186477805_1114244332414128_6709179158852729546_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=174925&_nc_ohc=35Get6xSAmAAX_ixtyO&_nc_ht=scontent.fjai1-4.fna&oh=00_AfCqmI34uSlUCvo3MHKNKYm-W28pJtmB5LNuc4hQYuI55w&oe=64A2C72B' />
  <a href="http://localhost:3000/password/resetpassword/">See your facebook</a>
,
  `,
      html: `<a href="http://localhost:3000/password/resetpassword/">Reset password</a>`,
    })
    .then(console.log)
    .catch(console.log);
};

sendmain();
