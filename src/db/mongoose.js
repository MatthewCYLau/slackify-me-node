const mongoose = require("mongoose");
const config = require("config");
const mongodbURL = process.env.MONGODB_URL || config.get("mongoURI");

mongoose.connect(mongodbURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
