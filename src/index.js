require("dotenv").config();
const debug = require("debug")("myFriends:root");
const chalk = require("chalk");
const connectDatabase = require("./db/connectDatabase");
const app = require("./server");
const startServer = require("./server/startServer");

const port = process.env.PORT || 4000;
const connectString = process.env.MONGO_CONNECT;

(async () => {
  connectDatabase(connectString);
  startServer(app, port);
  debug(chalk.bgMagenta.greenBright(`Connection succesful!`));
})();
