const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const Message = require("../models/message");
const uploadImage = require("../utils/uploadImage");
const multer = require("multer");
const s3 = require("../aws/awsConfig");

const upload = multer();

router.use("/", express.static(__dirname + "/public"));

router.get("/users/signup", async (req, res) => {
  res.render("signup");
});

router.get("/users/login", async (req, res) => {
  res.render("login");
});

router.get("/users/upload", auth, async (req, res) => {
  res.render("upload");
});

router.post(
  "/users/upload",
  auth,

  upload.single("avatar"),

  async (req, res) => {
    const imageRemoteName = `catImage_${new Date().getTime()}.png`;
    const BUCKET = "matlau-slackify-me";

    const result = await uploadImage(req.file.buffer, imageRemoteName, BUCKET);

    if (result && result.ETag) {
      const avatarImageURL = s3
        .getSignedUrl("getObject", {
          Bucket: BUCKET,
          Key: imageRemoteName
        })
        .split("?")[0];

      req.user.avatarImageURL = avatarImageURL;
      await req.user.save();
      res.redirect("/users/dashboard");
    } else {
      console.log("Failed to upload image");
      res.status(500).send();
    }
  }
);

router.post("/users/signup", async (req, res) => {
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
    res.redirect("/users/upload");
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
router.post(
  "/users/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const imageRemoteName = `catImage_${new Date().getTime()}.png`;
    const BUCKET = "matlau-slackify-me";

    const result = await uploadImage(req.file.buffer, imageRemoteName, BUCKET);

    if (result && result.ETag) {
      const avatarImageURL = s3
        .getSignedUrl("getObject", {
          Bucket: BUCKET,
          Key: imageRemoteName
        })
        .split("?")[0];

      console.log(avatarImageURL);

      req.user.avatarImageURL = avatarImageURL;
      await req.user.save();

      res.status(200).send();
    } else {
      console.log("Failed to upload image");
      res.status(500).send();
    }
  }
);

module.exports = router;
