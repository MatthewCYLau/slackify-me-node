const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const Message = require("../models/message");
const multer = require("multer");
const AWS = require("aws-sdk");

const BUCKET = "matlau-slackify-me";
const REGION = "eu-west-2";
const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const SECRET_KEY = process.env.AWS_ACCESS_SECRET;

const upload = multer();

router.get("/users/signup", async (req, res) => {
  res.render("signup");
});

router.get("/users/login", async (req, res) => {
  res.render("login");
});

router.post("/users/signup", upload.single("avatar"), async (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  const user = new User({
    username,
    password
  });

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.cookie("auth_token", token);
    res.redirect("/users/dashboard");
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.cookie("auth_token", token);

    res.redirect("/users/dashboard");
  } catch (e) {
    res.redirect("login");
  }
});

router.get("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    res.clearCookie("auth_token");

    await req.user.save();
    res.redirect("/");
  } catch (e) {
    res.statue(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.redirect("/");
  } catch (e) {
    res.statue(500).send();
  }
});

router.get("/users/dashboard", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      owner: req.user._id
    });

    res.render("dashboard", {
      messages,
      user: req.user
    });
  } catch (e) {
    res.status(500).send();
  }
});

//Upload avatar image from Postman to AWS S3
router.post("/users/avatar", upload.single("avatar"), async (req, res) => {

  const imageRemoteName = `catImage_${new Date().getTime()}.png`;

  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION
  });

  var s3 = new AWS.S3();

  s3.putObject({
    Bucket: BUCKET,
    Body: req.file.buffer,
    Key: imageRemoteName
  })
    .promise()
    .then(response => {
      console.log(`done! - `, response)
      console.log(
        `The URL is ${s3.getSignedUrl('getObject', { Bucket: BUCKET, Key: imageRemoteName })}`
      )
      res.status(200).send();
    })
    .catch(err => {
      console.log('failed:', err)
      res.status(500).send();
    })
  
});

module.exports = router;
