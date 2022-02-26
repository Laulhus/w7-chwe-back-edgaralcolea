const chalk = require("chalk");
const mongoose = require("mongoose");
const debug = require("debug")("myFriends:db");

const connectDatabase = (connectString) =>
  new Promise((resolve, reject) => {
    mongoose.connect(connectString, (error) => {
      if (error) {
        reject(error);
        return;
      }
      debug(chalk.blue("Connected to database"));
      resolve();
    });
    mongoose.set("debug", true);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        delete ret.__v;
      },
    });
  });

module.exports = connectDatabase;
