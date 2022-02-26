const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const userRegister = require("./controllers/userController");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use("/users", userRegister);

// app.use(notFoundError);

module.exports = app;
