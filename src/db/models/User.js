const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
  },
});

const User = model("User", userSchema);
