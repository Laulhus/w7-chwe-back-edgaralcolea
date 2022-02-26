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

module.exports = userRegister;
