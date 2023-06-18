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
];

const sendmain = () => {
  transEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: "HEllo subd how are you",
      textContent: `
  <h1>Hello subodh kaise ho</h1>
  <img src='https://scontent.fjai1-2.fna.fbcdn.net/v/t39.30808-6/299939627_1232560994236263_5850093805129011456_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=05QUNQTMowUAX9dqo_C&_nc_ht=scontent.fjai1-2.fna&oh=00_AfBCPQ9VkfImx6sY-dMq70WEUOe-odd3SzyA3_9S86QvOw&oe=6480E473' />
  <a href="https://www.facebook.com/profile.php?id=1000244712/">See your facebook</a>
,
  `,
      html: `<a href="http://localhost:3000/password/resetpassword/">Reset password</a>`,
    })
    .then(console.log)
    .catch(console.log);
};

sendmain();
