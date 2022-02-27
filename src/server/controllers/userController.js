const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../db/models/User");

const userRegister = async (req, res, next) => {
  try {
    const { userName } = req.body;
    const usedUserName = await User.findOne({ userName });
    if (!usedUserName) {
      const createdUser = await User.create(req.body);
      res.status(201).json(createdUser);
    } else {
      const error = new Error("This username already exists");
      error.code = 400;
      next(error);
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
