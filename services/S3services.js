const AWS = require("aws-sdk");

const uploadToS3 = (data, filename) => {
  const BUCKET_NAME = "expensetrackingappsave";
  const IAM_USER_KEY = "AKIA2RM5B3NEH6HNHFDH";
  const IAM_USER_SECRET = "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";

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    //Bucket: BUCKET_NAME
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Something went wrong", err);
        reject(err);
      } else {
        console.log("Success", s3response);
        resolve(s3response.Location);
      }
    });
  });
};

module.exports = {
  uploadToS3,
};
