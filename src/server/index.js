const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const { notFoundError, generalError } = require("./middlewares/errors");
const userRouter = require("./routers/userRouter");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("uploads"));
app.use(helmet());

app.use("/users", userRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
