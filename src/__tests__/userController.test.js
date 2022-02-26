const jwt = require("jsonwebtoken");
const User = require("../db/models/User");
const {
  userRegister,
  userLogin,
} = require("../server/controllers/userController");

describe("Given a userRegister controller", () => {
  describe("When it receives a request with an user", () => {
    test("Then it should call json method of the received response", async () => {
      const user = {
        username: "Testman",
        password: "testpass",
        name: "Testy",
        lastName: "McTest",
        age: 30,
        city: "Testingvania",
      };

      const req = {
        body: user,
      };
      const res = {
        json: jest.fn(),
      };

      User.create = jest.fn().mockResolvedValue(req.body);

      await userRegister(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe("When it receives request with invalid data format", () => {
    test("Then it should call next with error 'Invalid data format'", async () => {
      const user = {
        username: "Testman",
        name: "Testy",
        lastName: "McTest",
        age: 30,
        city: "Testingvania",
      };
      const req = {
        body: user,
      };
      const next = jest.fn();
      const error = new Error("Invalid data format");

      User.create = jest.fn().mockResolvedValue(null);

      await userRegister(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a request without and database isn't connected", () => {
    test("Then it should call next method with an error: 'Couldn't create user", async () => {
      const next = jest.fn();
      const req = {
        body: { name: "Lola" },
      };
      const error = new Error("Couldn't create user");

      User.create = jest.fn().mockRejectedValue(error);

      await userRegister(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a userLogin controller", () => {
  describe("When it receives a response with invalid username", () => {
    test("Then it should call next with error 'User not found'", async () => {
      const req = {
        body: {
          username: "Testman",
          password: "testpass",
        },
      };
      const next = jest.fn();
      const error = new Error("User not found");

      User.findOne = jest.fn().mockResolvedValue(null);

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a response with invalid password", () => {
    test("Then it should call next with error 'Invalid password'", async () => {
      const req = {
        body: {
          username: "Testman",
          password: "testpass",
        },
      };
      const next = jest.fn();
      const error = new Error("Invalid password");
      const user = {
        username: "Testman",
        password:
          "$2b$10$7uqVZ5a5QmeinnPp098Us.09BLm2xUGbB7fC4P8I4lq7n5KWadpRO",
      };

      User.findOne = jest.fn().mockResolvedValue(user);

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives request with valid username amd password", () => {
    test("Then it should call json method of the received response", async () => {
      const req = {
        body: {
          username: "Lila",
          password: "rosa",
        },
      };
      const user = {
        username: "Lila",
        password:
          "$2b$10$7uqVZ5a5QmeinnPp098Us.09BLm2xUGbB7fC4P8I4lq7n5KWadpRO",
      };
      const res = {
        json: jest.fn(),
      };

      const token = "flkjakjdf";
      User.findOne = jest.fn().mockResolvedValue(user);
      jwt.sign = jest.fn().mockResolvedValue(token);

      await userLogin(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });
});
