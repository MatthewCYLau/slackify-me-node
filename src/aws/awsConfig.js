const AWS = require("aws-sdk");
const REGION = "eu-west-2";
const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const SECRET_KEY = process.env.AWS_ACCESS_SECRET;

AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION
  });

const s3 = new AWS.S3();

module.exports = s3;