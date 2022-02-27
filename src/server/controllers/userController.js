const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const User = require("../../db/models/User");

const userRegister = async (req, res, next) => {
  const { userName, password } = req.body;
  try {
    const usedUserName = await User.findOne({ userName });
    if (!usedUserName) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      console.log(req.file.originalName);
      const oldFileName = path.join("uploads", req.file.filename);
      const newFileName = path.join("uploads", req.file.originalname);
      fs.rename(oldFileName, newFileName, (error) => {
        if (error) {
          next(error);
        }
      });
      const createdUser = await User.create({
        ...req.body,
        password: encryptedPassword,
      });
      res.status(201).json(createdUser);
    } else {
      const error = new Error("This username already exists");
      error.code = 400;
      next(error);
      return;
    }
  } catch (error) {
    error.code = 400;
    error.message = "Invalid data format";
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });
  if (!user) {
    const error = new Error("User not found");
    error.code = 404;
    next(error);
  } else {
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      const error = new Error(`Invalid password`);
      error.code = 401;
      next(error);
    } else {
      const userData = {
        userName: user.userName,
        id: user.id,
      };
      const token = jwt.sign(userData, process.env.JWT_SECRET);
      res.json({ token });
    }
  }
};

module.exports = { userRegister, userLogin };
