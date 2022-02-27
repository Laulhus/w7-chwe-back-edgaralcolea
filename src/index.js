require("dotenv").config();
const debug = require("debug")("myFriends:root");
const chalk = require("chalk");
const bcrypt = require("bcrypt");
const connectDatabase = require("./db/connectDatabase");
const app = require("./server");
const startServer = require("./server/startServer");

const port = process.env.PORT || 4000;
const connectString = process.env.MONGO_CONNECT;

(async () => {
  try {
    await connectDatabase(connectString);
    await startServer(app, port);
    debug(chalk.bgGray.greenBright(`Connection succesful!`));
    console.log(await bcrypt.hash("testpass", 10));
  } catch (error) {
    debug(chalk.redBright(`Error: ${error.message}`));
  }
})();
