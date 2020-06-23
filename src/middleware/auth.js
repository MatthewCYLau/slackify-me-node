const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("config");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies["auth_token"];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || config.get("jwtSecret")
    );
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.redirect("/users/login");
  }
};

module.exports = auth;
