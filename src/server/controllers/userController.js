const userRegister = async (req, res, next) => {
  try {
    const createdUser = await User.create(req.body);
    if (createdUser) {
      res.json(createdUser);
    } else {
      const error = new Error("Invalid data format");
      error.code = 400;
      next(error);
    }
  } catch (error) {
    error.code = 500;
    error.message = "Couldn't create user";
    next(error);
  }
};
module.exports = userRegister;
