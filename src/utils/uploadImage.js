const s3 = require("../aws/awsConfig");

const uploadImage = async (req, imageRemoteName, bucket) => {

  return s3
    .putObject({
      ACL: "public-read",
      Bucket: bucket,
      Body: req.file.buffer,
      ContentType:'image/jpeg',
      Key: imageRemoteName
    })
    .promise()
    .then(response => response)
    .catch(err => err);
};

module.exports = uploadImage;
