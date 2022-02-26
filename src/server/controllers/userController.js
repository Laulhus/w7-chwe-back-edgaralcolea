const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../db/models/User");

const userRegister = async (req, res, next) => {
  try {
    const createdUser = await User.create(req.body);
    res.json(createdUser);
  } catch (error) {
    error.code = 400;
    error.message = "Invalid data format";
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    const error = new Error("User not found");
    error.code = 401;
    next(error);
  } else {
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      const error = new Error(`Invalid password`);
      error.code = 401;
      next(error);
    } else {
      const UserDate = {
        username: user.username,
        id: user.id,
      };
      const token = jwt.sign(UserDate, process.env.JWT_SECRET);
      res.json({ token });
    }
  }
};

module.exports = { userRegister, userLogin };
